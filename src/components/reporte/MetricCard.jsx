import clsx from "clsx";

export function MetricCard({
  label,
  value,
  icon: Icon,
  color = "green",
  sub,
  highlight,
}) {
  const colors = {
    green: { bg: "#115A36", light: "#E6F5EC", accent: "#259D63" },
    cyan: { bg: "#006F83", light: "#E5F7FA", accent: "#00A3BF" },
    blue: { bg: "#0017C1", light: "#E6E8F8", accent: "#0017C1" },
    gray: { bg: "#333333", light: "#F1F1F4", accent: "#666666" },
  };
  const c = colors[color] || colors.green;

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl border bg-white p-5 transition-all hover:shadow-md",
        highlight ? "border-transparent" : "border-[#F1F1F4]",
      )}
    >
      {highlight && (
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundColor: c.bg }}
        />
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-[#626264] uppercase tracking-wider">
            {label}
          </p>
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: c.bg }}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <p className="text-3xl font-bold text-black tracking-tight">{value}</p>

        {sub && <p className="text-xs text-[#626264] mt-1">{sub}</p>}
      </div>
    </div>
  );
}
