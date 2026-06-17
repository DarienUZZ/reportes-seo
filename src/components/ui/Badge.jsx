import clsx from "clsx";

const variants = {
  default: "bg-[#F1F1F4] text-[#626264]",
  green: "bg-[#E6F5EC] text-[#115A36]",
  cyan: "bg-[#00A3BF]/10 text-[#006F83]",
  blue: "bg-[#0017C1]/10 text-[#0017C1]",
  gray: "bg-[#F1F1F4] text-[#666666]",
};

export function Badge({ variant = "default", children, className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
