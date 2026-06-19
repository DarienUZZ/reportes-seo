import { useState } from "react";
import { Sidebar } from "./Sidebar";

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F8FB] overflow-x-hidden">
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {typeof children === "function"
          ? children({ openSidebar: () => setSidebarOpen(true) })
          : children}
      </main>
    </div>
  );
}
