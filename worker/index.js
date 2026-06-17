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

      if (!slug) {
        return new Response(
          JSON.stringify({ error: "Falta el parámetro cliente" }),
          {
            status: 400,
            headers: corsHeaders,
          },
        );
      }

      const cliente = await getCliente(slug, env);
      if (!cliente) {
        return new Response(
          JSON.stringify({ error: "Cliente no encontrado" }),
          {
            status: 404,
            headers: corsHeaders,
          },
        );
      }

      const reporte = await getOCrearReporte(cliente, anio, mes, env);
      const datos = await getDatosReporte(reporte.id, env);

      const necesitaActualizar =
        !datos.resumen ||
        Date.now() - new Date(reporte.cached_at).getTime() > 1000 * 60 * 60 * 6;

      if (necesitaActualizar) {
        const ga4Data = await fetchGA4(cliente.ga4_property_id, anio, mes, env);
        await guardarEnSupabase(reporte.id, ga4Data, env);
        const datosActualizados = await getDatosReporte(reporte.id, env);
        return new Response(
          JSON.stringify({ cliente, reporte, datos: datosActualizados }),
          {
            headers: corsHeaders,
          },
        );
      }

      return new Response(JSON.stringify({ cliente, reporte, datos }), {
        headers: corsHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

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

  const fechaInicio = new Date(anio, mes - 1, 1).toISOString().split("T")[0];
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
        `/rest/v1/metricas_consultas?reporte_id=eq.${reporteId}&order=clics.desc`,
        env,
      ).then((r) => r.json()),
      supabaseFetch(
        `/rest/v1/metricas_paginas?reporte_id=eq.${reporteId}&order=clics.desc`,
        env,
      ).then((r) => r.json()),
      supabaseFetch(
        `/rest/v1/metricas_paises?reporte_id=eq.${reporteId}&order=clics.desc`,
        env,
      ).then((r) => r.json()),
      supabaseFetch(
        `/rest/v1/metricas_dispositivos?reporte_id=eq.${reporteId}&order=clics.desc`,
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

async function fetchGA4(propertyId, anio, mes, env) {
  const token = await getGoogleToken(env);
  const fechaInicio = `${anio}-${String(mes).padStart(2, "0")}-01`;
  const fechaFin = new Date(anio, mes, 0).toISOString().split("T")[0];

  const body = {
    dateRanges: [{ startDate: fechaInicio, endDate: fechaFin }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "sessions" }, { name: "totalUsers" }],
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

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GA4 error: ${err}`);
  }

  return res.json();
}

async function guardarEnSupabase(reporteId, ga4Data, env) {
  const filas = (ga4Data.rows || []).map((row) => ({
    reporte_id: reporteId,
    fecha: formatearFecha(row.dimensionValues[0].value),
    clics: 0,
    impresiones: 0,
    ctr: 0,
    posicion: 0,
  }));

  if (filas.length > 0) {
    await supabaseFetch("/rest/v1/metricas_diario", env, "POST", filas, {
      Prefer: "resolution=merge-duplicates",
    });
  }

  const totalSesiones = (ga4Data.rows || []).reduce(
    (s, r) => s + parseInt(r.metricValues[0].value),
    0,
  );
  await supabaseFetch(
    "/rest/v1/metricas_resumen",
    env,
    "POST",
    {
      reporte_id: reporteId,
      clics: 0,
      impresiones: 0,
      ctr: 0,
      posicion_media: 0,
    },
    { Prefer: "resolution=merge-duplicates" },
  );
}

function formatearFecha(str) {
  return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
}

function supabaseFetch(
  path,
  env,
  method = "GET",
  body = null,
  extraHeaders = {},
) {
  return fetch(`${env.SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : null,
  });
}

async function getGoogleToken(env) {
  const sa = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT);
  const now = Math.floor(Date.now() / 1000);

  const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
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

async function importPrivateKey(pem) {
  const pemContents = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\n/g, "");
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
  const data = encoder.encode(input);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, data);
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
