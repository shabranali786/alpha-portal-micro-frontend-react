import React, { useState, useEffect, useCallback, useMemo } from "react";
import Header from "./Header";
import SideMenus from "./SideMenus";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { EventListener } from "../EventListener";
import { useDarkMode } from "../../hooks/useDarkMode";

const Master = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);

  const handleToggleMinimize = useCallback(() => {
    isLargeScreen
      ? setSidebarMinimized((prev) => !prev)
      : setSidebarOpen(false);
  }, [isLargeScreen]);


  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!sidebarOpen || isLargeScreen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const handleEscape = (e) => e.key === "Escape" && closeSidebar();
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [sidebarOpen, isLargeScreen, closeSidebar]);

  const mainClassName = useMemo(
    () =>
      `transition-all duration-300 pt-1 ${
        isLargeScreen ? (sidebarMinimized ? "lg:pl-16" : "lg:pl-65") : ""
      }`,
    [isLargeScreen, sidebarMinimized]
  );

  return (
    <div className="min-h-screen dark:text-gray-300 transition-colors duration-300">
      {/* Socket.IO Event Listener - handles all real-time events */}
      <EventListener />

      {!isLargeScreen && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-30"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <SideMenus
        open={sidebarOpen}
        onClose={closeSidebar}
        isMinimized={isLargeScreen && sidebarMinimized}
        onToggleMinimize={handleToggleMinimize}
        showToggleButton={isLargeScreen}
      />

      <div className={mainClassName}>
        <Header
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onOpenMenu={openSidebar}
          isSidebarMinimized={isLargeScreen && sidebarMinimized}
        />
        <main className="mx-auto p-[clamp(15px,2vw,35px)] min-h-[calc(100dvh-136px)]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Master;
