"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HomeServicesTab from "../../../components/dashboard/home/HomeServicesTab";
import HomeHeroVideoTab from "../../../components/dashboard/home/HomeHeroVideoTab";
import HomeHeroTextTab from "../../../components/dashboard/home/HomeHeroTextTab";
import Link from "next/link";

export default function HomeAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"heroVideo" | "heroText" | "services">("heroVideo");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/auth/signin");
  }, [session, status, router]);
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                ← Volver al dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inicio</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona los bloques de la Home: Servicios y Video del Hero</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs container */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
            <button
              onClick={() => setActiveTab("heroVideo")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "heroVideo"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Video del Hero
            </button>
            <button
              onClick={() => setActiveTab("heroText")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "heroText"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Texto del Hero
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "services"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Servicios
            </button>
          </div>

          {activeTab === "heroVideo" && <HomeHeroVideoTab />}
          {activeTab === "heroText" && <HomeHeroTextTab />}
          {activeTab === "services" && <HomeServicesTab />}
        </div>
      </main>
    </div>
  );
}
