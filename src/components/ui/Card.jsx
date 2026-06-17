import clsx from "clsx";

export function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-[#F1F1F4] bg-white shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return <div className={clsx("px-6 pt-5 pb-3", className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={clsx("text-sm font-semibold text-black", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }) {
  return <div className={clsx("px-6 pb-5", className)}>{children}</div>;
}
