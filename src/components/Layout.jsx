import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8F8FB] overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
    </div>
  );
}
