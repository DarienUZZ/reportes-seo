import clsx from "clsx";

export function Skeleton({ className }) {
  return (
    <div className={clsx("animate-pulse rounded-md bg-[#F1F1F4]", className)} />
  );
}
