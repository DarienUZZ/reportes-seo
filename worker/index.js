export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const slug = url.searchParams.get("cliente");
      const anio = parseInt(
        url.searchParams.get("anio") || new Date().getFullYear(),
      );
      const mes = parseInt(
        url.searchParams.get("mes") || new Date().getMonth() + 1,
      );
      const refresh = url.searchParams.get("refresh") === "true";

      if (!slug) {
        return json({ error: "Falta el parámetro cliente" }, 400, corsHeaders);
      }

      const cliente = await getCliente(slug, env);
      if (!cliente) {
        return json({ error: "Cliente no encontrado" }, 404, corsHeaders);
      }

      const reporte = await getOCrearReporte(cliente, anio, mes, env);
      const datos = await getDatosReporte(reporte.id, env);

      const cacheEdadHoras =
        (Date.now() - new Date(reporte.cached_at).getTime()) / 1000 / 60 / 60;
      const necesitaActualizar =
        refresh || !datos.resumen || cacheEdadHoras > 6;

      if (necesitaActualizar) {
        const token = await getGoogleToken(env);

        const [ga4Data, scData] = await Promise.all([
          fetchGA4(cliente.ga4_property_id, anio, mes, token),
          fetchSearchConsole(slug, anio, mes, token),
        ]);

        await guardarEnSupabase(reporte.id, ga4Data, scData, env);
        await actualizarCache(reporte.id, env);

        const datosActualizados = await getDatosReporte(reporte.id, env);
        return json(
          { cliente, reporte, datos: datosActualizados, actualizado: true },
          200,
          corsHeaders,
        );
      }

      return json(
        { cliente, reporte, datos, actualizado: false },
        200,
        corsHeaders,
      );
    } catch (err) {
      return json({ error: err.message, stack: err.stack }, 500, corsHeaders);
    }
  },
};

// ─── HELPERS ──────────────────────────────────────────────

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers });
}

async function getCliente(slug, env) {
  const res = await supabaseFetch(
    `/rest/v1/clientes?slug=eq.${slug}&limit=1`,
    env,
  );
  const data = await res.json();
  return data[0] || null;
}

async function getOCrearReporte(cliente, anio, mes, env) {
  const res = await supabaseFetch(
    `/rest/v1/reportes?cliente_id=eq.${cliente.id}&anio=eq.${anio}&mes=eq.${mes}&limit=1`,
    env,
  );
  const data = await res.json();
  if (data[0]) return data[0];

  const fechaInicio = `${anio}-${String(mes).padStart(2, "0")}-01`;
  const fechaFin = new Date(anio, mes, 0).toISOString().split("T")[0];

  const crear = await supabaseFetch("/rest/v1/reportes", env, "POST", {
    cliente_id: cliente.id,
    tipo_busqueda_id: 1,
    anio,
    mes,
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  });
  const nuevo = await crear.json();
  return nuevo[0];
}

async function actualizarCache(reporteId, env) {
  await supabaseFetch(`/rest/v1/reportes?id=eq.${reporteId}`, env, "PATCH", {
    cached_at: new Date().toISOString(),
  });
}

async function getDatosReporte(reporteId, env) {
  const [resumen, diario, consultas, paginas, paises, dispositivos] =
    await Promise.all([
      supabaseFetch(
        `/rest/v1/metricas_resumen?reporte_id=eq.${reporteId}&limit=1`,
        env,
      ).then((r) => r.json()),
      supabaseFetch(
        `/rest/v1/metricas_diario?reporte_id=eq.${reporteId}&order=fecha.asc`,
        env,
      ).then((r) => r.json()),
      supabaseFetch(
        `/rest/v1/metricas_consultas?reporte_id=eq.${reporteId}&order=clics.desc.nullslast&limit=50`,
        env,
      ).then((r) => r.json()),
      supabaseFetch(
        `/rest/v1/metricas_paginas?reporte_id=eq.${reporteId}&order=clics.desc.nullslast&limit=20`,
        env,
      ).then((r) => r.json()),
      supabaseFetch(
        `/rest/v1/metricas_paises?reporte_id=eq.${reporteId}&select=*,cat_paises(codigo,nombre)&order=clics.desc.nullslast`,
        env,
      ).then((r) => r.json()),
      supabaseFetch(
        `/rest/v1/metricas_dispositivos?reporte_id=eq.${reporteId}&select=*,cat_dispositivos(nombre)&order=clics.desc.nullslast`,
        env,
      ).then((r) => r.json()),
    ]);
  return {
    resumen: resumen[0],
    diario,
    consultas,
    paginas,
    paises,
    dispositivos,
  };
}

// ─── GA4 ──────────────────────────────────────────────────

async function fetchGA4(propertyId, anio, mes, token) {
  const fechaInicio = `${anio}-${String(mes).padStart(2, "0")}-01`;
  const fechaFin = new Date(anio, mes, 0).toISOString().split("T")[0];

  const body = {
    dateRanges: [{ startDate: fechaInicio, endDate: fechaFin }],
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "screenPageViews" },
    ],
  };

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) throw new Error(`GA4 error: ${await res.text()}`);
  return res.json();
}

// ─── SEARCH CONSOLE ───────────────────────────────────────

async function fetchSearchConsole(slug, anio, mes, token) {
  const fechaInicio = `${anio}-${String(mes).padStart(2, "0")}-01`;
  const fechaFin = new Date(anio, mes, 0).toISOString().split("T")[0];
  const siteUrl = `sc-domain:${slug}.com`;

  async function query(dimensions) {
    const res = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: fechaInicio,
          endDate: fechaFin,
          dimensions,
          rowLimit: 1000,
        }),
      },
    );
    if (!res.ok) {
      const errTxt = await res.text();
      if (errTxt.includes("does not match any sites")) {
        const res2 = await fetch(
          `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(`https://${slug}.com/`)}/searchAnalytics/query`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              startDate: fechaInicio,
              endDate: fechaFin,
              dimensions,
              rowLimit: 1000,
            }),
          },
        );
        if (!res2.ok) throw new Error(`SC error: ${await res2.text()}`);
        return res2.json();
      }
      throw new Error(`SC error: ${errTxt}`);
    }
    return res.json();
  }

  const [diario, consultas, paginas, paises, dispositivos] = await Promise.all([
    query(["date"]),
    query(["query"]),
    query(["page"]),
    query(["country"]),
    query(["device"]),
  ]);

  return { diario, consultas, paginas, paises, dispositivos };
}

// ─── GUARDAR EN SUPABASE ──────────────────────────────────

async function guardarEnSupabase(reporteId, ga4Data, scData, env) {
  // Limpiar datos anteriores del reporte
  await Promise.all([
    supabaseFetch(
      `/rest/v1/metricas_diario?reporte_id=eq.${reporteId}`,
      env,
      "DELETE",
    ),
    supabaseFetch(
      `/rest/v1/metricas_consultas?reporte_id=eq.${reporteId}`,
      env,
      "DELETE",
    ),
    supabaseFetch(
      `/rest/v1/metricas_paginas?reporte_id=eq.${reporteId}`,
      env,
      "DELETE",
    ),
    supabaseFetch(
      `/rest/v1/metricas_paises?reporte_id=eq.${reporteId}`,
      env,
      "DELETE",
    ),
    supabaseFetch(
      `/rest/v1/metricas_dispositivos?reporte_id=eq.${reporteId}`,
      env,
      "DELETE",
    ),
    supabaseFetch(
      `/rest/v1/metricas_resumen?reporte_id=eq.${reporteId}`,
      env,
      "DELETE",
    ),
  ]);

  // ─── DIARIO ───
  const ga4Diario = {};
  for (const row of ga4Data.rows || []) {
    const fecha = formatGA4Date(row.dimensionValues[0].value);
    ga4Diario[fecha] = {
      sesiones: parseInt(row.metricValues[0].value) || 0,
    };
  }

  const filasDiario = (scData.diario.rows || []).map((row) => ({
    reporte_id: reporteId,
    fecha: row.keys[0],
    clics: row.clicks || 0,
    impresiones: row.impressions || 0,
    ctr: row.ctr || 0,
    posicion: row.position || 0,
  }));

  if (filasDiario.length) {
    await supabaseFetch("/rest/v1/metricas_diario", env, "POST", filasDiario);
  }

  // ─── RESUMEN ───
  const totalClics = filasDiario.reduce((s, r) => s + r.clics, 0);
  const totalImpr = filasDiario.reduce((s, r) => s + r.impresiones, 0);
  const avgCtr = totalImpr > 0 ? totalClics / totalImpr : 0;
  const posVals = filasDiario
    .filter((r) => r.posicion > 0)
    .map((r) => r.posicion);
  const avgPos = posVals.length
    ? posVals.reduce((a, b) => a + b, 0) / posVals.length
    : 0;

  await supabaseFetch("/rest/v1/metricas_resumen", env, "POST", {
    reporte_id: reporteId,
    clics: totalClics,
    impresiones: totalImpr,
    ctr: parseFloat(avgCtr.toFixed(4)),
    posicion_media: parseFloat(avgPos.toFixed(2)),
  });

  // ─── CONSULTAS ───
  const filasConsultas = (scData.consultas.rows || [])
    .slice(0, 100)
    .map((row) => ({
      reporte_id: reporteId,
      consulta: row.keys[0],
      clics: row.clicks || 0,
      impresiones: row.impressions || 0,
      ctr: parseFloat((row.ctr || 0).toFixed(4)),
      posicion: parseFloat((row.position || 0).toFixed(2)),
    }));
  if (filasConsultas.length) {
    await supabaseFetch(
      "/rest/v1/metricas_consultas",
      env,
      "POST",
      filasConsultas,
    );
  }

  // ─── PÁGINAS ───
  const filasPaginas = (scData.paginas.rows || []).slice(0, 50).map((row) => ({
    reporte_id: reporteId,
    url: row.keys[0],
    clics: row.clicks || 0,
    impresiones: row.impressions || 0,
    ctr: parseFloat((row.ctr || 0).toFixed(4)),
    posicion: parseFloat((row.position || 0).toFixed(2)),
  }));
  if (filasPaginas.length) {
    await supabaseFetch("/rest/v1/metricas_paginas", env, "POST", filasPaginas);
  }

  // ─── PAÍSES ───
  const paisesMap = await getPaisesMap(env);
  const filasPaises = [];
  for (const row of scData.paises.rows || []) {
    const codigoISO3 = row.keys[0].toUpperCase();
    const codigoISO2 = ISO3_TO_ISO2[codigoISO3];
    if (!codigoISO2) continue;
    const paisId = paisesMap[codigoISO2];
    if (!paisId) continue;
    filasPaises.push({
      reporte_id: reporteId,
      pais_id: paisId,
      clics: row.clicks || 0,
      impresiones: row.impressions || 0,
      ctr: parseFloat((row.ctr || 0).toFixed(4)),
      posicion: parseFloat((row.position || 0).toFixed(2)),
    });
  }
  if (filasPaises.length) {
    await supabaseFetch("/rest/v1/metricas_paises", env, "POST", filasPaises);
  }

  // ─── DISPOSITIVOS ───
  const dispMap = await getDispositivosMap(env);
  const filasDisp = [];
  for (const row of scData.dispositivos.rows || []) {
    const nombre = row.keys[0].toUpperCase();
    const dispId = dispMap[nombre];
    if (!dispId) continue;
    filasDisp.push({
      reporte_id: reporteId,
      dispositivo_id: dispId,
      clics: row.clicks || 0,
      impresiones: row.impressions || 0,
      ctr: parseFloat((row.ctr || 0).toFixed(4)),
      posicion: parseFloat((row.position || 0).toFixed(2)),
    });
  }
  if (filasDisp.length) {
    await supabaseFetch(
      "/rest/v1/metricas_dispositivos",
      env,
      "POST",
      filasDisp,
    );
  }
}

// ─── CATÁLOGOS ────────────────────────────────────────────

let _paisesCache = null;
async function getPaisesMap(env) {
  if (_paisesCache) return _paisesCache;
  const res = await supabaseFetch("/rest/v1/cat_paises?select=id,codigo", env);
  const data = await res.json();
  _paisesCache = Object.fromEntries(data.map((p) => [p.codigo, p.id]));
  return _paisesCache;
}

let _dispCache = null;
async function getDispositivosMap(env) {
  if (_dispCache) return _dispCache;
  const res = await supabaseFetch(
    "/rest/v1/cat_dispositivos?select=id,nombre",
    env,
  );
  const data = await res.json();
  _dispCache = Object.fromEntries(data.map((d) => [d.nombre, d.id]));
  return _dispCache;
}

// GA4 devuelve países en ISO-3, Supabase los tiene en ISO-2
const ISO3_TO_ISO2 = {
  AFG: "AF",
  ALB: "AL",
  DZA: "DZ",
  AND: "AD",
  AGO: "AO",
  ATG: "AG",
  ARG: "AR",
  ARM: "AM",
  AUS: "AU",
  AUT: "AT",
  AZE: "AZ",
  BHS: "BS",
  BHR: "BH",
  BGD: "BD",
  BRB: "BB",
  BLR: "BY",
  BEL: "BE",
  BLZ: "BZ",
  BEN: "BJ",
  BTN: "BT",
  BOL: "BO",
  BIH: "BA",
  BWA: "BW",
  BRA: "BR",
  BRN: "BN",
  BGR: "BG",
  BFA: "BF",
  BDI: "BI",
  CPV: "CV",
  KHM: "KH",
  CMR: "CM",
  CAN: "CA",
  CAF: "CF",
  TCD: "TD",
  CHL: "CL",
  CHN: "CN",
  COL: "CO",
  COM: "KM",
  COG: "CG",
  COD: "CD",
  CRI: "CR",
  CIV: "CI",
  HRV: "HR",
  CUB: "CU",
  CYP: "CY",
  CZE: "CZ",
  DNK: "DK",
  DJI: "DJ",
  DMA: "DM",
  DOM: "DO",
  ECU: "EC",
  EGY: "EG",
  SLV: "SV",
  GNQ: "GQ",
  ERI: "ER",
  EST: "EE",
  SWZ: "SZ",
  ETH: "ET",
  FJI: "FJ",
  FIN: "FI",
  FRA: "FR",
  GAB: "GA",
  GMB: "GM",
  GEO: "GE",
  DEU: "DE",
  GHA: "GH",
  GRC: "GR",
  GRD: "GD",
  GTM: "GT",
  GIN: "GN",
  GNB: "GW",
  GUY: "GY",
  HTI: "HT",
  HND: "HN",
  HUN: "HU",
  ISL: "IS",
  IND: "IN",
  IDN: "ID",
  IRN: "IR",
  IRQ: "IQ",
  IRL: "IE",
  ISR: "IL",
  ITA: "IT",
  JAM: "JM",
  JPN: "JP",
  JOR: "JO",
  KAZ: "KZ",
  KEN: "KE",
  KIR: "KI",
  PRK: "KP",
  KOR: "KR",
  XKX: "XK",
  KWT: "KW",
  KGZ: "KG",
  LAO: "LA",
  LVA: "LV",
  LBN: "LB",
  LSO: "LS",
  LBR: "LR",
  LBY: "LY",
  LIE: "LI",
  LTU: "LT",
  LUX: "LU",
  MDG: "MG",
  MWI: "MW",
  MYS: "MY",
  MDV: "MV",
  MLI: "ML",
  MLT: "MT",
  MHL: "MH",
  MRT: "MR",
  MUS: "MU",
  MEX: "MX",
  FSM: "FM",
  MDA: "MD",
  MCO: "MC",
  MNG: "MN",
  MNE: "ME",
  MAR: "MA",
  MOZ: "MZ",
  MMR: "MM",
  NAM: "NA",
  NRU: "NR",
  NPL: "NP",
  NLD: "NL",
  NZL: "NZ",
  NIC: "NI",
  NER: "NE",
  NGA: "NG",
  NOR: "NO",
  OMN: "OM",
  PAK: "PK",
  PLW: "PW",
  PAN: "PA",
  PNG: "PG",
  PRY: "PY",
  PER: "PE",
  PHL: "PH",
  POL: "PL",
  PRT: "PT",
  QAT: "QA",
  ROU: "RO",
  RUS: "RU",
  RWA: "RW",
  KNA: "KN",
  LCA: "LC",
  VCT: "VC",
  WSM: "WS",
  SMR: "SM",
  STP: "ST",
  SAU: "SA",
  SEN: "SN",
  SRB: "RS",
  SYC: "SC",
  SLE: "SL",
  SGP: "SG",
  SVK: "SK",
  SVN: "SI",
  SLB: "SB",
  SOM: "SO",
  ZAF: "ZA",
  SSD: "SS",
  ESP: "ES",
  LKA: "LK",
  SDN: "SD",
  SUR: "SR",
  SWE: "SE",
  CHE: "CH",
  SYR: "SY",
  TJK: "TJ",
  TZA: "TZ",
  THA: "TH",
  TLS: "TL",
  TGO: "TG",
  TON: "TO",
  TTO: "TT",
  TUN: "TN",
  TUR: "TR",
  TKM: "TM",
  TUV: "TV",
  UGA: "UG",
  UKR: "UA",
  ARE: "AE",
  GBR: "GB",
  USA: "US",
  URY: "UY",
  UZB: "UZ",
  VUT: "VU",
  VAT: "VA",
  VEN: "VE",
  VNM: "VN",
  YEM: "YE",
  ZMB: "ZM",
  ZWE: "ZW",
};

function formatGA4Date(str) {
  return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
}

// ─── SUPABASE FETCH ───────────────────────────────────────

function supabaseFetch(path, env, method = "GET", body = null) {
  return fetch(`${env.SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: body ? JSON.stringify(body) : null,
  });
}

// ─── GOOGLE AUTH ──────────────────────────────────────────

async function getGoogleToken(env) {
  const sa = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT);
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: [
        "https://www.googleapis.com/auth/analytics.readonly",
        "https://www.googleapis.com/auth/webmasters.readonly",
      ].join(" "),
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );

  const signingInput = `${header}.${payload}`;
  const privateKey = await importPrivateKey(sa.private_key);
  const signature = await signJWT(signingInput, privateKey);
  const jwt = `${signingInput}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  if (!data.access_token)
    throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

function base64url(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function importPrivateKey(pem) {
  const pemContents = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function signJWT(input, key) {
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    encoder.encode(input),
  );
  return base64url(String.fromCharCode(...new Uint8Array(signature)));
}
