import { Fragment, lazy, Suspense, useState } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { BsX, BsEnvelope, BsPhone, BsChatDots } from "react-icons/bs";
const EmailHistory = lazy(() => import("./EmailHistory"));
const LeadCall = lazy(() => import("./LeadCall"));
const LeadSMS = lazy(() => import("./LeadSMS"));
// import EmailHistory from "./EmailHistory";
// import LeadCall from "./LeadCall";
// import LeadSMS from "./LeadSMS";

export default function Communication({ open, onClose, lead }) {
  const [activeTab, setActiveTab] = useState("email");

  if (!lead) return null;

  const tabs = [
    {
      id: "email",
      name: "Email",
      icon: BsEnvelope,
      component: EmailHistory,
    },
    // {
    //   id: "sms",
    //   name: "SMS",
    //   icon: BsChatDots,
    //   component: LeadSMS,
    // },
    // {
    //   id: "call",
    //   name: "Call",
    //   icon: BsPhone,
    //   component: LeadCall,
    // },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="flex h-full items-center justify-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full h-full transform transition-all overflow-hidden border border-gray-200 bg-white dark:border-slate-700/60 dark:bg-slate-900 shadow-xl flex flex-col">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60 bg-white dark:bg-slate-900">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-semibold shadow-md">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
                          {lead.name}
                        </h2>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-slate-400">
                          <span className="flex items-center gap-2">
                            <svg
                              className="size-4 text-gray-500 dark:text-slate-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="truncate max-w-xs">
                              {lead.email}
                            </span>
                          </span>
                          {lead.phone && (
                            <span className="flex items-center gap-2">
                              <svg
                                className="size-4 text-gray-500 dark:text-slate-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              <span>{lead.phone}</span>
                            </span>
                          )}
                          {lead.country && (
                            <span className="flex items-center gap-2">
                              <svg
                                className="size-4 text-gray-500 dark:text-slate-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>{lead.country}</span>
                            </span>
                          )}
                          {lead.city && (
                            <span className="flex items-center gap-2">
                              <svg
                                className="size-4 text-gray-500 dark:text-slate-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span>{lead.city}</span>
                            </span>
                          )}
                          {lead.brand && (
                            <span className="flex items-center gap-2">
                              <svg
                                className="size-4 text-gray-500 dark:text-slate-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              <span>{lead.brand.title || lead.brand}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                    >
                      <BsX className="size-6" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-700/60 -mb-4">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                            activeTab === tab.id
                              ? "text-primary border-primary dark:text-blue-400 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                              : "text-gray-600 dark:text-slate-400 border-transparent hover:text-gray-900 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <Icon className="size-4" />
                          <span>{tab.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  <Suspense
                    fallback={
                      <div className="min-h-dvh flex place-content-center p-5">
                        Loading...
                      </div>
                    }
                  >
                    {ActiveComponent && <ActiveComponent lead={lead} />}
                  </Suspense>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
