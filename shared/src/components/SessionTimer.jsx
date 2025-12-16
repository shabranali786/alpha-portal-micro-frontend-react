import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { BsClock, BsExclamationTriangle, BsShieldCheck } from "react-icons/bs";

const SessionTimer = () => {
  const { expiresAt } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0, total: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    if (!expiresAt) return null;

    const now = Date.now();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) return { h: 0, m: 0, s: 0, total: 0 };

    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
      total: Math.floor(diff / 1000),
    };
  }, [expiresAt]);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const t = calculateTimeLeft();
      if (!t) return;

      setTimeLeft(t);

      if (t.total <= 0) {
        dispatch(logout());
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt, calculateTimeLeft, dispatch]);

  if (!expiresAt) return null;

  const pad = (n) => String(n).padStart(2, "0");

  const isDanger = timeLeft.total <= 300; // 5 min
  const isWarning = timeLeft.total <= 900; // 15 min

  const getConfig = () => {
    if (isDanger) {
      return {
        bg: "bg-red-50 dark:bg-red-500/10",
        border: "border-red-200 dark:border-red-500/30",
        text: "text-red-600 dark:text-red-400",
        icon: BsExclamationTriangle,
        iconColor: "text-red-500",
        pulse: true,
        label: "⚠️ Session Expiring Soon",
      };
    }
    if (isWarning) {
      return {
        bg: "bg-amber-50 dark:bg-amber-500/10",
        border: "border-amber-200 dark:border-amber-500/30",
        text: "text-amber-600 dark:text-amber-400",
        icon: BsClock,
        iconColor: "text-amber-500",
        pulse: false,
        label: "⏰ Session Warning",
      };
    }
    return {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-500/30",
      text: "text-emerald-600 dark:text-emerald-400",
      icon: BsShieldCheck,
      iconColor: "text-emerald-500",
      pulse: false,
      label: "✓ Session Active",
    };
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`
          relative flex h-full items-center gap-1.5 px-2 py-1 rounded-md border cursor-pointer
          ${config.bg} ${config.border}
        
        `}
      >
        {/* Pulse for danger */}
        {config.pulse && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}

        {/* Icon */}
        <div className={config.iconColor}>
          <Icon size={14} className={config.pulse ? "animate-pulse" : ""} />
        </div>

        {/* Time Display */}
        <div className={`text-xs font-bold ${config.text} tabular-nums`}>
          {timeLeft.h > 0 ? (
            <>
              {timeLeft.h}h {pad(timeLeft.m)}m
            </>
          ) : (
            <>
              {pad(timeLeft.m)}m {pad(timeLeft.s)}s
            </>
          )}
        </div>
      </div>

      {/* Tooltip on Hover */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="bg-gray-900 dark:bg-gray-800 text-white rounded-xl shadow-2xl border border-gray-700 p-4 min-w-[220px]">
            {/* Status Badge */}
            <div className="text-center mb-3">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  isDanger
                    ? "bg-red-500/20 text-red-300"
                    : isWarning
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}
              >
                {config.label}
              </div>
            </div>

            {/* Remaining Time */}
            <div className="text-center mb-3">
              <div className="text-xs text-gray-400 mb-1">
                Session Expires In
              </div>
              <div className="text-2xl font-bold tabular-nums">
                {timeLeft.h > 0 && <span>{pad(timeLeft.h)}:</span>}
                <span>{pad(timeLeft.m)}:</span>
                <span>{pad(timeLeft.s)}</span>
              </div>
            </div>

            {/* Expiry Time */}
            <div className="border-t border-gray-700 pt-3 text-center">
              <div className="text-xs text-gray-400">Expires At</div>
              <div className="text-xs font-medium text-gray-300 mt-1">
                {new Date(expiresAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                {new Date(expiresAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Arrow */}
            <div className="absolute -top-2 right-4 size-4 bg-gray-900 dark:bg-gray-800 border-l border-t border-gray-700 transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionTimer;
