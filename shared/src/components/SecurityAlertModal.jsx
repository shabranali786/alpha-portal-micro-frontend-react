import { Fragment } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  BsShieldFillExclamation,
  BsGlobeAmericas,
  BsBrowserChrome,
  BsTerminalFill,
  BsCopy,
} from "react-icons/bs";
import {
  MdSecurity,
  MdOutlineSupportAgent,
  MdLockOutline,
  MdRefresh,
} from "react-icons/md";
import { RiRadarFill, RiErrorWarningFill } from "react-icons/ri";

export default function SecurityAlertModal({ open, onClose, data }) {
  if (!data) return null;

  // Format location string
  const formatLocation = () => {
    if (!data.location) return "Unknown Region";
    const parts = [];
    if (data.location.city) parts.push(data.location.city);
    if (data.location.region) parts.push(data.location.region);
    if (data.location.country) parts.push(data.location.country);
    return parts.length > 0 ? parts.join(", ") : "Unknown Region";
  };

  const sessionData = {
    ip: data.ip || "Unknown IP",
    refId: `SEC-${Date.now().toString().slice(-8)}`,
    timestamp: new Date().toISOString(),
    location: formatLocation(),
    timezone: data.location?.timezone || "Unknown",
    org: data.location?.org || "Unknown Organization",
    message:
      data.message || "Access Denied. Your IP address is not authorized.",
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-[9999]" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="transform transition-all w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col md:flex-row">
                {/* Left Side - Red Alert Banner */}
                <div className="md:w-2/5 relative bg-gradient-to-br from-red-600 to-rose-700 p-8 text-white overflow-hidden flex flex-col justify-between">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                    }}
                  ></div>

                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-6">
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                      Critical Security Event
                    </div>

                    <div className="relative z-10">
                      <BsShieldFillExclamation className="size-20 mb-6 drop-shadow-2xl text-white/90" />
                      <h1 className="text-3xl font-bold mb-2 tracking-tight">
                        Access Restricted
                      </h1>
                      <p className="text-red-100/90 leading-relaxed text-sm">
                        {sessionData.message}
                      </p>
                    </div>
                  </div>

                  <div className="mt-12 relative z-10">
                    <div className="flex items-center justify-between text-xs font-mono text-red-200 border-t border-white/20 pt-4">
                      <span>Error Code:</span>
                      <span className="bg-black/20 px-2 py-0.5 rounded text-white">
                        403_FORBIDDEN
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Details */}
                <div className="md:w-3/5 p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <MdSecurity className="text-slate-400" />
                      Security Diagnostics
                    </h2>
                    {/* <span className="text-xs text-slate-500 font-mono">
                      ID: {sessionData.refId}
                    </span> */}
                  </div>

                  {/* Technical Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400 uppercase">
                          Client IP
                        </span>
                        <BsTerminalFill className="text-slate-300 dark:text-slate-600" />
                      </div>
                      <div className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {sessionData.ip}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400 uppercase">
                          Risk Score
                        </span>
                        <RiRadarFill className="text-red-500 animate-pulse" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className="w-[90%] h-full bg-red-500 rounded-full"></div>
                        </div>
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">
                          CRITICAL
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400 uppercase">
                          Location
                        </span>
                        <BsGlobeAmericas className="text-slate-300 dark:text-slate-600" />
                      </div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {sessionData.location}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400 uppercase">
                          Timezone
                        </span>
                        <MdLockOutline className="text-slate-300 dark:text-slate-600" />
                      </div>
                      <div className="text-sm font-mono text-slate-600 dark:text-slate-400 truncate text-[11px]">
                        {sessionData.timezone}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 col-span-1 sm:col-span-2">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400 uppercase">
                          Organization
                        </span>
                        <BsBrowserChrome className="text-slate-300 dark:text-slate-600" />
                      </div>
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                        {sessionData.org}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-200 text-xs mb-4">
                      <RiErrorWarningFill className="size-5 flex-shrink-0" />
                      <p className="text-inherit">
                        If you believe this is a mistake, please provide the{" "}
                        <strong>Reference ID</strong> below to support.
                      </p>
                    </div>

                    {/* <div
                      className="flex items-center gap-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-600 dark:text-slate-400 mb-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => copyToClipboard(sessionData.refId)}
                    >
                      <span className="flex-1 select-all">
                        Ref: {sessionData.refId}
                      </span>
                      <BsCopy className="hover:text-slate-900 dark:hover:text-white" />
                    </div> */}

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <MdRefresh className="size-4" />
                        Try Again
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href = `mailto:security@domain.com?subject=Unblock Request [${sessionData.refId}]`)
                        }
                        className="btn btn-primary"
                      >
                        <MdOutlineSupportAgent className="size-5" />
                        Contact Support
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
