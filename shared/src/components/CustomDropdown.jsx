import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const useDropdown = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleDropdownToggle = (rowId, event, options = {}) => {
    if (openDropdown === rowId) {
      setOpenDropdown(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownWidth = options.width || 176;
    const dropdownHeight = options.height || 160;
    const offset = options.offset || 5;

    let left = rect.left;
    let top = rect.bottom + offset;

    if (left + dropdownWidth > window.innerWidth) {
      left = rect.right - dropdownWidth;
    }

    if (top + dropdownHeight > window.innerHeight) {
      top = rect.top - dropdownHeight - offset;
    }

    left = Math.max(8, Math.min(left, window.innerWidth - dropdownWidth - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - dropdownHeight - 8));

    setDropdownPosition({ top, left });
    setOpenDropdown(rowId);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (openDropdown) setOpenDropdown(null);
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [openDropdown]);

  return {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
    setOpenDropdown,
  };
};

export function CustomDropdown({
  isOpen,
  onClose,
  position,
  children,
  className = "",
  width = "w-44",
  maxHeight = "max-h-80",
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      }}
      className={`${width} rounded-lg border border-gray-200 bg-white py-2 shadow-lg transition-colors duration-200 dark:border-slate-700/60 dark:bg-slate-900/90 dark:shadow-black/40 ${maxHeight} overflow-auto ${className}`}
    >
      {children}
    </div>,
    document.body
  );
}

export function DropdownItem({
  onClick,
  children,
  className = "",
  danger = false,
  disabled = false,
  icon,
  label,
}) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors duration-150 ${
        danger
          ? "text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-500/15 dark:hover:text-red-200"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:text-slate-100"
      } ${
        disabled
          ? "opacity-50 cursor-not-allowed hover:bg-transparent"
          : "cursor-pointer"
      } ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label && <span>{label}</span>}
      {children}
    </button>
  );
}

export function DropdownTrigger({
  onClick,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-sm border border-gray-200 bg-gray-100 px-3 py-1 text-lg leading-normal transition-colors hover:bg-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 ${className}`}
      title="Actions"
      aria-label="Actions"
      {...props}
    >
      {children || "⋮"}
    </button>
  );
}

export function DropdownDivider({ className = "" }) {
  return (
    <div
      className={`my-1 border-t border-gray-200 dark:border-slate-700/60 ${className}`}
    />
  );
}

export function DropdownHeader({ children, className = "" }) {
  return (
    <div
      className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400 ${className}`}
    >
      {children}
    </div>
  );
}

export function Dropdown({
  trigger,
  children,
  isOpen,
  onClose,
  position,
  ...dropdownProps
}) {
  return (
    <div className="relative">
      {trigger}
      <CustomDropdown
        isOpen={isOpen}
        onClose={onClose}
        position={position}
        {...dropdownProps}
      >
        {children}
      </CustomDropdown>
    </div>
  );
}

export default CustomDropdown;
