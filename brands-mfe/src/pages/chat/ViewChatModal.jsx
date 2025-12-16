import { Fragment, useState } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import {
  BsChatDots,
  BsCalendar,
  BsLink45Deg,
  BsCode,
  BsCopy,
  BsCheck,
  BsTag,
} from "react-icons/bs";
import toast from "react-hot-toast";

export default function ViewChatModal({ open, onClose, chat }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!chat) return null;

  const handleCopy = (text, field) => {
    const decodedText = text.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    navigator.clipboard.writeText(decodedText);
    setCopiedField(field);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
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
              <DialogPanel className="transform transition-all w-full max-w-3xl overflow-hidden rounded-2xl border border-transparent bg-white shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100">
                <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Chat Widget Details
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                    Complete information about this chat widget
                  </p>
                </div>

                <div className="px-6 py-5 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                  {/* Title */}
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                    <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
                      <BsChatDots className="size-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300 font-medium mb-1">
                        Chat Title
                      </p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {chat.title}
                      </p>
                    </div>
                  </div>

                  {/* Chat URL */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                      <BsLink45Deg />
                      Chat URL
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <code className="flex-1 text-sm text-slate-700 dark:text-slate-300 break-all">
                        {chat.chat_url}
                      </code>
                      <button
                        onClick={() => handleCopy(chat.chat_url, "url")}
                        className="flex-shrink-0 p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        title="Copy URL"
                      >
                        {copiedField === "url" ? (
                          <BsCheck className="text-green-500 size-5" />
                        ) : (
                          <BsCopy className="text-slate-500 dark:text-slate-400 size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Chat Script */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                      <BsCode />
                      Chat Script
                    </label>
                    <div className="relative">
                      <pre className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
                        <code className="text-xs text-slate-700 dark:text-slate-300">
                          {chat.chat_script
                            ?.replace(/&lt;/g, "<")
                            .replace(/&gt;/g, ">")}
                        </code>
                      </pre>
                      <button
                        onClick={() => handleCopy(chat.chat_script, "script")}
                        className="absolute top-3 right-3 p-2 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        title="Copy script"
                      >
                        {copiedField === "script" ? (
                          <BsCheck className="text-green-500 size-5" />
                        ) : (
                          <BsCopy className="text-slate-500 dark:text-slate-400 size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Associated Brands */}
                  {chat.brands && chat.brands.length > 0 && (
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                        <BsTag />
                        Associated Brands ({chat.brands.length})
                      </label>
                      <div className="space-y-2">
                        {chat.brands.map((brand) => (
                          <div
                            key={brand.id}
                            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                          >
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                              {brand.title}
                            </div>
                            {brand.domain && (
                              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                {brand.domain}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700/60">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                        <BsCalendar />
                        Created At
                      </label>
                      <p className="text-sm text-gray-900 dark:text-slate-100">
                        {formatDate(chat.created_at)}
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wide mb-2">
                        <BsCalendar />
                        Last Updated
                      </label>
                      <p className="text-sm text-gray-900 dark:text-slate-100">
                        {formatDate(chat.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4 flex justify-end">
                  <button
                    type="button"
                    className="btn btn-black"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
