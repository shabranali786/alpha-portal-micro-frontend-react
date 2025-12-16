import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  BsBoxArrowRight,
  BsFillMoonStarsFill,
  BsFillSunFill,
  BsGear,
  BsPerson,
  BsPersonGear,
  BsArrowsFullscreen,
} from "react-icons/bs";
import NetworkStatusIndicator from "../../components/NetworkStatusIndicator";
import SessionTimer from "../SessionTimer";
import WeatherWidget from "../WeatherWidget";

const Header = ({ onOpenMenu, isDarkMode, onToggleDarkMode, isSidebarMinimized }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {
        setIsFullscreen(false);
      });
    } else {
      document.exitFullscreen?.().catch(() => {
        setIsFullscreen(true);
      });
    }
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const handleChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header
      className="relative top-2 z-30 h-16 bg-white/90 dark:bg-[#0d121e] backdrop-blur border-b border-gray-100  rounded-lg mx-3 dark:border-gray-700/50 dark:!shadow-none"
      style={{ boxShadow: "0px 0px 35px 0px rgba(104, 134, 177, .15)" }}
    >
      <div className="h-full mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
            onClick={onOpenMenu}
            aria-label="Open menu"
          >
            ☰
          </button>
          {isSidebarMinimized && (
            <img
              src="/fav.svg"
              alt="Logo"
              className="h-8 w-8 object-contain"
            />
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-pressed={isFullscreen}
            className="font-medium text-lg text-left rounded-md p-2 hover:bg-white/20"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            <BsArrowsFullscreen size={15} />
          </button>
        </div>

        {/* Network Status and Controls */}
        <div className="flex items-stretch gap-3">
          <SessionTimer />
          <NetworkStatusIndicator showToast={true} />
          {/* <WeatherWidget /> */}

          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-600 transition-colors dark:bg-white/10 dark:hover:bg-white/20 dark:text-gray-200"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            aria-pressed={isDarkMode}
          >
            {isDarkMode ? (
              <BsFillSunFill size={15} />
            ) : (
              <BsFillMoonStarsFill size={15} />
            )}
          </button>
          <Menu as="div" className="relative">
            <MenuButton className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg dark:bg-white/10 dark:hover:bg-white/20 transition-colors">
              <BsPersonGear size={15} />
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom end"
              className="w-52 origin-top-right rounded-lg border border-gray-100 bg-white shadow-lg transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-closed:scale-95 data-closed:opacity-0 overflow-hidden z-50"
            >
              {/* User Info */}
              <div className="px-3 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                    <BsPersonGear color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800 truncate block">
                      {user?.name || "User"}
                    </span>
                    <p className="text-xs text-gray-500 truncate m-0">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <MenuItem>
                  <Link
                    to="/profile"
                    className="flex items-center w-full rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100  transition-colors gap-2"
                  >
                    <BsPerson size={15} />
                    Profile
                  </Link>
                </MenuItem>

                {/* <MenuItem>
                  <Link
                    to="/setting"
                    className="flex items-center w-full rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100  transition-colors gap-2"
                  >
                    <BsGear size={15} />
                    Settings
                  </Link>
                </MenuItem> */}

                <div className="border-t border-gray-100 my-1"></div>

                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full rounded-md px-3 py-2 text-sm text-red-600 data-focus:bg-red-50 transition-colors gap-2"
                  >
                    <BsBoxArrowRight />
                    Logout
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Header;
