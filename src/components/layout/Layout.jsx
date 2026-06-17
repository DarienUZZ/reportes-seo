import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#F8F8FB]">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
