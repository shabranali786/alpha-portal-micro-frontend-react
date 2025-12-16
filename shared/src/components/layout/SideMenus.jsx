import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  BsCreditCard2FrontFill,
  BsCurrencyExchange,
  BsCashStack,
  BsFileEarmarkRuledFill,
  BsGridFill,
  BsPersonFillLock,
  BsPersonGear,
  BsPerson,
  BsGear,
  BsBoxArrowRight,
  BsBriefcaseFill,
  BsDiagram3Fill,
  BsMailbox2,
} from "react-icons/bs";
import { NavLink, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@crm/shared/store/authSlice";
import { useNavigate } from "react-router-dom";
import { checkPermission } from "@crm/shared/utils/permissions";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const allMenuItems = [
  {
    title: "Dashboard",
    route: "/",
    type: "single",
    icon: <BsGridFill size={15} />,
    permissions: ["dashboard.index"],
  },

  // Sales & Billing
  {
    title: "Sales & Billing",
    type: "group",
    icon: <BsCreditCard2FrontFill size={15} />,
    open_when: ["/leads", "/invoices", "/customer"],
    items: [
      {
        title: "Leads",
        route: "/leads",
        permissions: ["lead.index"],
      },
      {
        title: "Customer",
        route: "/customer",
        permissions: ["customer.index"],
      },
      {
        title: "Invoices",
        route: "/invoices",
        permissions: ["invoice.index"],
      },
    ],
  },

  // Finance
  {
    title: "Finance",
    type: "group",
    icon: <BsCashStack size={15} />,
    open_when: [
      "/transactions",
      "/chargebacks",
      "/external-payments",
      "/expenses",
    ],
    items: [
      {
        title: "Transactions",
        route: "/transactions",
        permissions: ["payment.index"],
      },
      {
        title: "Chargebacks",
        route: "/chargebacks",
        permissions: ["chargeback.index"],
      },
      {
        title: "External Payments",
        route: "/external-payments",
        permissions: ["external-payment.index"],
      },
      {
        title: "Expenses",
        route: "/expenses",
        permissions: ["expenses.index"],
      },
    ],
  },

  // Brands & Merchants
  {
    title: "Brands & Merchants",
    type: "group",
    icon: <BsCurrencyExchange size={15} />,
    open_when: ["/units", "/brands", "/chats", "/merchants"],
    items: [
      {
        title: "Units",
        route: "/units",
        permissions: ["unit.index"],
      },
      {
        title: "Brands",
        route: "/brands",
        permissions: ["brand.index"],
      },
      {
        title: "Chats",
        route: "/chats",
        permissions: ["chat.index"],
      },
      {
        title: "Merchants",
        route: "/merchants",
        permissions: ["merchant.index"],
      },
    ],
  },

  // Cases & Documents
  {
    title: "Cases & Documents",
    type: "group",
    icon: <BsFileEarmarkRuledFill size={15} />,
    open_when: ["/office-letters"],
    items: [
      {
        title: "Office Letters",
        route: "/office-letters",
        permissions: ["office-letter.index"],
      },
    ],
  },

  // Reports
  {
    title: "Reports",
    type: "group",
    icon: <BsBriefcaseFill size={15} />,
    open_when: [
      "/unit-report",
      "/unit-reports",
      "/unit-wise-reports",
      "/merchants-reports",
      "/sales-reports",
      "/team-reports",
      "/combined-sales-reports",
      "/sales",
    ],
    items: [
      {
        title: "Unit Reports",
        route: "/unit-reports",
        permissions: ["unit-report.index"],
      },
      {
        title: "Sales Reports",
        route: "/sales-reports",
        permissions: ["sales-report.index"],
      },
      {
        title: "Merchant Summary",
        route: "/merchant-reports",
        permissions: ["merchant-report.index"],
      },
      {
        title: "Team Wise Report",
        route: "/team-reports",
        permissions: ["team-wise-report.index"],
      },
      {
        title: "Unit Wise Report",
        route: "/unit-wise-reports",
        permissions: ["unit-wise-report.index"],
      },
      {
        title: "Combined Sales Report",
        route: "/combined-sales-reports",
        permissions: ["combined-sales-report.index"],
      },
    ],
  },

  // Mapping
  {
    title: "Mapping",
    type: "group",
    icon: <BsDiagram3Fill size={15} />,
    open_when: ["/package-mapping", "/merchants-mapping"],
    items: [
      {
        title: "Package Mapping",
        route: "/package-mapping",
        permissions: ["package.index"],
      },
      {
        title: "Merchant Mapping",
        route: "/merchant-mapping",
        permissions: ["merchant-mapping.index"],
      },
    ],
  },

  // email config
  {
    title: "Emails",
    route: "/email-configs",
    type: "single",
    icon: <BsMailbox2 size={15} />,
    permissions: ["email-config.index"],
  },

  // Access Control
  {
    title: "Access Control",
    type: "group",
    icon: <BsPersonFillLock size={15} />,
    open_when: ["/users", "/teams", "/roles", "/permissions", "/IP"],
    items: [
      {
        title: "Users",
        route: "/users",
        permissions: ["user.index"],
      },
      {
        title: "Teams",
        route: "/teams",
        permissions: ["team.index"],
      },
      {
        title: "Roles",
        route: "/roles",
        permissions: ["role.index"],
      },
      {
        title: "Permissions",
        route: "/permissions",
        permissions: ["permission.index"],
      },
      {
        title: "IP",
        route: "/ip",
        permissions: ["ip.index"],
      },
    ],
  },
];

function SingleMenuItem({ item, onClose, isMinimized }) {
  return (
    <NavLink
      to={item.route}
      className={({ isActive }) =>
        `flex items-center gap-2 text-sm ${
          isMinimized ? "px-1.5 py-2 justify-center" : "px-4 py-3"
        } rounded-lg mb-1 transition-colors duration-200 relative group ${
          isActive
            ? "bg-white/10 text-white"
            : "text-gray-200 hover:bg-white/10 hover:text-white"
        }`
      }
      onClick={onClose}
      title={isMinimized ? item.title : ""}
    >
      {item?.icon}

      {!isMinimized && <span>{item.title}</span>}
    </NavLink>
  );
}

function GroupMenuItem({ item, index, onClose, isMinimized }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showFlyout, setShowFlyout] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const shouldOpen =
      item.open_when?.some((pattern) => location.pathname.includes(pattern)) ||
      item.items?.some((subItem) => location.pathname === subItem.route);
    setIsOpen(shouldOpen && !isMinimized);
  }, [location.pathname, item, isMinimized]);

  const groupActive =
    item.open_when?.some((pattern) => location.pathname.includes(pattern)) ||
    item.items?.some((subItem) => location.pathname === subItem.route);

  const updatePosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const left = Math.min(rect.right + 18, window.innerWidth - 8);
    const top = Math.max(8, Math.min(rect.top, window.innerHeight - 8));
    setCoords({ top, left });
  };

  useEffect(() => {
    if (!isMinimized || !showFlyout) return;
    updatePosition();
    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [isMinimized, showFlyout]);

  const openFlyout = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    updatePosition();
    setShowFlyout(true);
  };

  const closeFlyoutDelayed = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setShowFlyout(false), 120);
  };

  return (
    <div
      className={`relative ${
        groupActive ? "bg-white/10" : "hover:bg-white/10"
      } transition-all rounded-lg mb-1`}
    >
      {/* Header / Trigger */}
      <button
        ref={triggerRef}
        className={`group relative flex w-full items-center rounded-lg ${
          isMinimized ? "px-1.5 py-2 justify-center" : "px-4 py-3"
        } text-left text-sm ${
          groupActive ? "text-white" : "text-white"
        } transition hover:z-[2] focus:z-[3] `}
        type="button"
        onClick={() => !isMinimized && setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        title={isMinimized ? item.title : ""}
        onMouseEnter={isMinimized ? openFlyout : undefined}
        onMouseLeave={isMinimized ? closeFlyoutDelayed : undefined}
      >
        <div className="flex items-center gap-2">
          {item?.icon}
          {!isMinimized && <span>{item.title}</span>}
        </div>

        {!isMinimized && (
          <div className="flex items-center gap-2 ml-auto">
            <span
              className={`shrink-0 ${
                isOpen ? "rotate-0" : "rotate-[-180deg]"
              } transition-transform duration-200 ease-in-out`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </div>
        )}
      </button>

      {!isMinimized && (
        <div className={`${isOpen ? "block" : "hidden"} pt-2 pl-10`}>
          <ul className="flex flex-col space-y-1 border-l border-gray-600/50 pb-3 ml-1">
            {item.items?.map((subItem, subIndex) => (
              <li key={subIndex}>
                <NavLink
                  to={subItem.route}
                  className={({ isActive }) =>
                    `block pl-4 py-2 text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-white border-l-2 border-white pl-3"
                        : "text-gray-400 hover:text-white"
                    }`
                  }
                  onClick={onClose}
                >
                  {subItem.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isMinimized &&
        showFlyout &&
        createPortal(
          <div
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
            }}
            onMouseLeave={closeFlyoutDelayed}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 9999,
            }}
          >
            <div className="w-56 rounded-lg bg-sidebar-bg dark:bg-slate-900/20 backdrop-blur-sm border dark:border-slate-700/60 overflow-hidden">
              <div className="p-3 text-sm font-semibold uppercase text-white dark:text-slate-100 bg-white/10">
                {item.title}
              </div>
              <ul className="p-2 max-h-[70vh] overflow-auto flex flex-col gap-1">
                {item.items?.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <NavLink
                      to={subItem.route}
                      className={({ isActive }) =>
                        `block px-3 py-1.5 text-sm rounded-md transition-colors duration-150 ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "text-gray-200 hover:text-white hover:bg-white/10"
                        }`
                      }
                      onClick={() => {
                        setShowFlyout(false);
                        onClose?.();
                      }}
                    >
                      {subItem.title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function UserDropdown({ isMinimized, onClose }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    onClose?.();
  };

  if (isMinimized) {
    return (
      <Menu as="div" className="relative">
        <MenuButton className="flex items-center justify-center w-full p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200   ">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <BsPersonGear color="white" size={16} />
          </div>
        </MenuButton>

        <MenuItems
          transition
          anchor="top end"
          className="w-52 origin-bottom-right rounded-lg border dark:border-slate-700 bg-sidebar-bg dark:bg-slate-900/30  transition duration-100 ease-out [--anchor-gap:8px]  data-closed:scale-95 data-closed:opacity-0 overflow-hidden z-50 ml-2 backdrop-blur-sm"
        >
          {/* User Info */}
          <div className="px-3 py-3 bg-gray-700/30 border-b border-gray-600/50">
            <div className="flex items-center space-x-2">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                <BsPersonGear color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-white truncate">
                  {user?.name || "User"}
                </span>
                <p className="text-xs text-gray-400 truncate">
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
                className="flex items-center w-full rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors gap-2"
                onClick={onClose}
              >
                <BsPerson size={15} />
                Profile
              </Link>
            </MenuItem>

            {/* <MenuItem>
              <Link
                to="/setting"
                className="flex items-center w-full rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors gap-2"
                onClick={onClose}
              >
                <BsGear size={15} />
                Settings
              </Link>
            </MenuItem> */}

            <div className="border-t border-gray-600/50 my-1"></div>

            <MenuItem>
              <button
                onClick={handleLogout}
                className="flex items-center w-full rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors gap-2"
              >
                <BsBoxArrowRight />
                Logout
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    );
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center w-full p-2 rounded-lg  hover:bg-white/10 transition-colors duration-200   ">
        <div className="flex items-center space-x-3 flex-1">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <BsPersonGear color="white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <span className="text-sm font-semibold text-white truncate block">
              {user?.name || "User"}
            </span>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </MenuButton>

      <MenuItems
        transition
        anchor="top start"
        className="w-52 origin-bottom rounded-lg border border-gray-600/50 bg-[#2b3046] shadow-xl transition duration-100 ease-out [--anchor-gap:8px]  data-closed:scale-95 data-closed:opacity-0 overflow-hidden z-50"
      >
        <div className="p-2">
          <MenuItem>
            <Link
              to="/profile"
              className="flex items-center w-full rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors gap-2"
              onClick={onClose}
            >
              <BsPerson size={15} />
              Profile
            </Link>
          </MenuItem>

          {/* <MenuItem>
            <Link
              to="/setting"
              className="flex items-center w-full rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors gap-2"
              onClick={onClose}
            >
              <BsGear size={15} />
              Settings
            </Link>
          </MenuItem> */}

          <div className="border-t border-gray-600/50 my-1"></div>

          <MenuItem>
            <button
              onClick={handleLogout}
              className="flex items-center w-full rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors gap-2"
            >
              <BsBoxArrowRight />
              Logout
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}

const SideMenus = ({
  open,
  onClose,
  isMinimized,
  onToggleMinimize,
  showToggleButton = true,
}) => {
  const { user } = useSelector((state) => state.auth);
  const filteredMenuItems = allMenuItems
    .map((menuItem) => {
      if (menuItem.type === "single") {
        return checkPermission(user, menuItem.permissions) ? menuItem : null;
      } else if (menuItem.type === "group") {
        const filteredSubItems = menuItem.items?.filter((subItem) =>
          checkPermission(user, subItem.permissions)
        );

        if (filteredSubItems && filteredSubItems.length > 0) {
          return {
            ...menuItem,
            items: filteredSubItems,
          };
        }
        return null;
      }
      return menuItem;
    })
    .filter(Boolean);

  return (
    <aside
      className={` bg-[var(--color-sidebar-bg)] rounded-[18px] m-1 text-gray-200 fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out z-40 flex flex-col ${
        isMinimized ? "w-16" : "w-64"
      } ${
        open
          ? "translate-x-0"
          : "-translate-x-[calc(100%+4px)] lg:translate-x-0"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center ${
          isMinimized ? "justify-center" : "justify-between"
        } px-6 py-3 border-b border-gray-700/50`}
      >
        {!isMinimized && (
          <NavLink to="/" className="flex items-center gap-2" onClick={onClose}>
            <img
              src="/img/logo.png"
              alt="logo"
              width="200"
              height="50"
              className="object-contain"
            />
          </NavLink>
        )}

        {showToggleButton && (
          <button
            onClick={onToggleMinimize}
            className={`p-2 rounded-md bg-white/10 hover:bg-gray-600/50 text-gray-200 hover:text-white transition-colors duration-200 ${
              isMinimized ? "mx-auto" : ""
            }`}
            title={isMinimized ? "Open sidebar" : "Close sidebar"}
          >
            {isMinimized ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            )}
          </button>
        )}

        {!showToggleButton && (
          <button
            onClick={onClose}
            className="p-2 rounded-md bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 hover:text-white transition-colors duration-200"
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-grow p-4 overflow-y-auto scrollbar-modern">
        {!isMinimized && (
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </div>
        )}

        <div className={`${isMinimized ? "mt-2 space-y-2" : "mt-2 space-y-1"}`}>
          {filteredMenuItems.map((menuItem, index) => (
            <div key={index}>
              {menuItem.type === "single" ? (
                <SingleMenuItem
                  item={menuItem}
                  onClose={onClose}
                  isMinimized={isMinimized}
                />
              ) : (
                <GroupMenuItem
                  item={menuItem}
                  index={index}
                  onClose={onClose}
                  isMinimized={isMinimized}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-2 border-t border-gray-700/50">
        <UserDropdown isMinimized={isMinimized} onClose={onClose} />
      </div>
    </aside>
  );
};

export default SideMenus;
