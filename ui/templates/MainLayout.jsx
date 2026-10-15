"use client";
import { useState } from "react";
import SideBar from "../organisms/Sidebar";
import Header from "../organisms/Header";
import { useFetchUserOnLoad } from "@/hooks/useFetchUserOnLoad";

export default function MainLayout({ children, pageTitle }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useFetchUserOnLoad();

  return (
    <div className="flex  flex-row overflow-hidden h-screen bg-gray-100">
      <SideBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 backdrop-blur-[2px] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className="flex flex-1 flex-col">
        <Header
          pageTitle={pageTitle}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="w-full max-w-full bg-[#F5F6FA] overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
