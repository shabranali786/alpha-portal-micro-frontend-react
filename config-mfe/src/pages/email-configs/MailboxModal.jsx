import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  BsX,
  BsInbox,
  BsPaperclip,
  BsSearch,
  BsArrowClockwise,
  BsEnvelope,
  BsGear,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import toast from "react-hot-toast";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";
import { format } from "date-fns";

// Format date helper
const formatEmailDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isThisYear = date.getFullYear() === now.getFullYear();

    if (isToday) {
      return format(date, "h:mm a");
    } else if (isThisYear) {
      return format(date, "MMM d");
    } else {
      return format(date, "MMM d, yyyy");
    }
  } catch {
    return dateString;
  }
};

// Format full date for email detail
const formatFullDate = (dateString) => {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return dateString;
  }
};

// Parse attachments from API
const parseAttachments = (attachments) => {
  if (!attachments) return [];
  if (typeof attachments === "string") {
    try {
      return JSON.parse(attachments);
    } catch {
      return [];
    }
  }
  return Array.isArray(attachments) ? attachments : [];
};

export default function MailboxModal({ open, onClose, config }) {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailDetail, setEmailDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);
  const perPage = 20;

  // Reset state when modal opens
  useEffect(() => {
    if (open && config) {
      setCurrentPage(1);
      setSelectedEmail(null);
      setEmailDetail(null);
      setSearchTerm("");
      fetchEmails(1);
    }
  }, [open, config]);

  // Fetch emails when page changes
  useEffect(() => {
    if (open && config && currentPage > 1) {
      fetchEmails(currentPage);
    }
  }, [currentPage]);

  const fetchEmails = async (page = 1) => {
    if (!config?.id) return;
    setLoading(true);
    try {
      const response = await apiAxios.get(
        ApiRequest.emailConfigs.mailbox(config.id),
        {
          params: {
            page,
            per_page: perPage,
            sort_by: "received_at",
            sort_order: "desc",
            search: searchTerm || undefined,
          },
        }
      );

      const emailsData = response.data?.data || [];
      console.log("emailsData", emailsData);
      // Filter only incoming emails (inbox)
      //   const inboxEmails = emailsData.filter((email) => !email.is_sent);
      //   console.log("inboxEmails", inboxEmails);
      setEmails(emailsData);
      setTotalPages(response.data?.meta?.last_page || 1);
      setTotalEmails(response.data?.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching emails:", error);
      toast.error("Failed to fetch emails");
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmailDetail = async (emailId) => {
    if (!config?.id || !emailId) return;
    setLoadingDetail(true);
    try {
      const response = await apiAxios.get(
        ApiRequest.emailConfigs.emailDetail(config.id, emailId)
      );
      setEmailDetail(response.data?.data || null);
    } catch (error) {
      console.error("Error fetching email detail:", error);
      toast.error("Failed to load email");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    fetchEmailDetail(email.id);

    // Frontend-only: Mark as read in local state
    if (!email.is_read) {
      setEmails((prevEmails) =>
        prevEmails.map((e) => (e.id === email.id ? { ...e, is_read: true } : e))
      );
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      setSelectedEmail(null);
      setEmailDetail(null);
      fetchEmails(1);
    }
  };

  const handleRefresh = () => {
    setSelectedEmail(null);
    setEmailDetail(null);
    fetchEmails(currentPage);
  };

  // Counts
  const unreadCount = emails.filter((e) => !e.is_read).length;

  const getProviderBadge = (provider) => {
    const providers = {
      smtp: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        label: "SMTP",
      },
      "imap+smtp": {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-300",
        label: "IMAP+SMTP",
      },
      mailgun: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-300",
        label: "Mailgun",
      },
    };
    const prov = providers[provider] || providers.smtp;
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${prov.bg} ${prov.text}`}
      >
        {prov.label}
      </span>
    );
  };

  if (!config) return null;

  const displayEmail = emailDetail || selectedEmail;

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
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60 bg-white dark:bg-slate-900 flex-shrink-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Email Icon */}
                      <div className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold shadow-md">
                        <BsEnvelope className="size-6" />
                      </div>

                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
                            {config.name || "Email Mailbox"}
                          </h2>
                          <span className="text-xl font-bold text-gray-800 dark:text-slate-100 hidden">
                            config mail id #{config.id}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              config.active
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                            }`}
                          >
                            {config.active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-slate-400">
                          <span className="flex items-center gap-2">
                            <BsEnvelope className="size-4 text-gray-500 dark:text-slate-500" />
                            <span className="truncate max-w-xs">
                              {config.email_address}
                            </span>
                          </span>

                          <span className="flex items-center gap-2">
                            <BsGear className="size-4 text-gray-500 dark:text-slate-500" />
                            {getProviderBadge(config.provider)}
                          </span>

                          {config.brand && (
                            <span className="flex items-center gap-2">
                              <span className="text-gray-400 dark:text-slate-500">
                                Brand:
                              </span>
                              <span>{config.brand?.title || "N/A"}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <BsX className="size-6" />
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Sidebar */}
                  <div className="w-52 border-r border-gray-200 dark:border-slate-700/60 flex flex-col bg-white dark:bg-slate-900/50 flex-shrink-0">
                    <div className="p-4 flex-1">
                      <div className="text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider mb-3 px-1">
                        Folder
                      </div>
                      <div className="space-y-1">
                        {/* Inbox - Active by default */}
                        <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 shadow-sm">
                          <BsInbox className="size-4 flex-shrink-0" />
                          <span className="flex-1 text-left font-medium">
                            Inbox
                          </span>
                          {unreadCount > 0 && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full min-w-[20px] text-center">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-slate-700/60">
                      <div className="text-xs text-gray-500 dark:text-slate-500 text-center">
                        Read-only Mailbox
                      </div>
                    </div>
                  </div>

                  {/* Email List */}
                  <div className="w-96 border-r border-gray-200 dark:border-slate-700/60 flex flex-col bg-white dark:bg-slate-900 flex-shrink-0">
                    {/* Search & Refresh */}
                    <div className="p-4 border-b border-gray-200 dark:border-slate-700/60 flex-shrink-0">
                      <div className="relative flex gap-2">
                        <div className="relative flex-1">
                          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search emails..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            className="w-full pl-10 form-control"
                          />
                        </div>
                        <button
                          onClick={handleRefresh}
                          disabled={loading}
                          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                          title="Refresh"
                        >
                          <BsArrowClockwise
                            className={`size-4 ${
                              loading ? "animate-spin" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Email List */}
                    <div className="flex-1 overflow-y-auto scrollbar-modern">
                      {loading ? (
                        <div className="flex items-center justify-center py-12">
                          <svg
                            className="animate-spin size-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                        </div>
                      ) : emails.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                          <BsInbox className="size-12 text-gray-300 dark:text-slate-600 mb-3" />
                          <p className="text-gray-500 dark:text-slate-400">
                            No emails in inbox
                          </p>
                          <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">
                            {searchTerm
                              ? "Try different search terms"
                              : "Emails will appear here"}
                          </p>
                        </div>
                      ) : (
                        emails.map((email) => (
                          <div
                            key={email.id}
                            onClick={() => handleSelectEmail(email)}
                            className={`p-4 border-b border-gray-100 dark:border-slate-700/40 cursor-pointer transition-all duration-200 ${
                              selectedEmail?.id === email.id
                                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                                : "hover:bg-gray-50 dark:hover:bg-slate-800/60 border-l-4 border-l-transparent"
                            } ${
                              !email.is_read
                                ? "bg-blue-50/30 dark:bg-blue-900/10"
                                : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div className="size-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-sm bg-gray-500 dark:bg-slate-600">
                                {(
                                  email.from_name?.[0] ||
                                  email.from_email?.[0] ||
                                  "?"
                                ).toUpperCase()}
                              </div>

                              <div className="flex-1 min-w-0">
                                {/* Sender & Date */}
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span
                                      className={`text-sm truncate ${
                                        !email.is_read
                                          ? "font-bold text-gray-900 dark:text-slate-100"
                                          : "font-medium text-gray-700 dark:text-slate-300"
                                      }`}
                                    >
                                      {email.from_name ||
                                        email.from_email ||
                                        "Unknown"}
                                    </span>
                                    {!email.is_read && (
                                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                                    )}
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-slate-500 flex-shrink-0 ml-2">
                                    {formatEmailDate(email.received_at)}
                                  </span>
                                </div>

                                {/* Subject */}
                                <div
                                  className={`text-sm mb-1 truncate ${
                                    !email.is_read
                                      ? "font-semibold text-gray-900 dark:text-slate-100"
                                      : "text-gray-700 dark:text-slate-300"
                                  }`}
                                >
                                  {email.subject || "(No Subject)"}
                                </div>

                                {/* Preview */}
                                <div className="text-xs text-gray-500 dark:text-slate-500 truncate">
                                  {email.body_plain?.substring(0, 80) ||
                                    email.body
                                      ?.substring(0, 80)
                                      ?.replace(/<[^>]*>/g, "") ||
                                    "No preview available"}
                                </div>

                                {/* Lead badge */}
                                {email.lead && (
                                  <div className="mt-2">
                                    <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded">
                                      Lead: {email.lead.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="p-3 border-t border-gray-200 dark:border-slate-700/60 flex items-center justify-between flex-shrink-0">
                        <span className="text-xs text-gray-500 dark:text-slate-400">
                          Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1 || loading}
                            className="p-1.5 rounded border border-gray-300 dark:border-slate-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <BsChevronLeft className="size-4 dark:text-slate-400" />
                          </button>
                          <button
                            onClick={() =>
                              setCurrentPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={currentPage === totalPages || loading}
                            className="p-1.5 rounded border border-gray-300 dark:border-slate-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <BsChevronRight className="size-4  dark:text-slate-400" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Email Content */}
                  <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
                    {displayEmail ? (
                      <div className="flex-1 overflow-y-auto p-6 scrollbar-modern">
                        {loadingDetail ? (
                          <div className="flex items-center justify-center py-12">
                            <svg
                              className="animate-spin size-8 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {/* Subject */}
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                                {displayEmail.subject || "(No Subject)"}
                              </h3>

                              {/* Lead Info */}
                              {displayEmail.lead && (
                                <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800/40">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                                      Associated Lead:
                                    </span>
                                    <span className="text-sm text-purple-900 dark:text-purple-100">
                                      {displayEmail.lead.name}
                                    </span>
                                    <span className="text-xs text-purple-600 dark:text-purple-400">
                                      ({displayEmail.lead.email})
                                    </span>
                                    {displayEmail.lead.phone && (
                                      <span className="text-xs text-purple-600 dark:text-purple-400">
                                        • {displayEmail.lead.phone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Sender Info */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600">
                              <div className="size-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md flex-shrink-0 bg-primary">
                                {(
                                  displayEmail.from_name?.[0] ||
                                  displayEmail.from_email?.[0] ||
                                  "?"
                                ).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <div className="text-base font-semibold text-gray-900 dark:text-slate-100">
                                      {displayEmail.from_name ||
                                        displayEmail.from_email}
                                    </div>
                                    {displayEmail.from_name && (
                                      <div className="text-sm text-gray-500 dark:text-slate-400 truncate">
                                        {displayEmail.from_email}
                                      </div>
                                    )}
                                    <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                                      <span className="font-medium">To: </span>
                                      {config.email_address}
                                    </div>
                                    {displayEmail.cc_emails && (
                                      <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                                        <span className="font-medium">
                                          Cc:{" "}
                                        </span>
                                        {displayEmail.cc_emails}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-slate-500 whitespace-nowrap">
                                    {formatFullDate(displayEmail.received_at)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Attachments */}
                            {parseAttachments(displayEmail.attachments).length >
                              0 && (
                              <div>
                                <div className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                  <BsPaperclip className="size-4" />
                                  Attachments (
                                  {
                                    parseAttachments(displayEmail.attachments)
                                      .length
                                  }
                                  )
                                </div>
                                <div className="flex flex-wrap gap-3">
                                  {parseAttachments(
                                    displayEmail.attachments
                                  ).map((att, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-slate-600 hover:shadow-md transition-all"
                                    >
                                      <BsPaperclip className="size-5 text-blue-500 dark:text-blue-400" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                          {att.name ||
                                            att.filename ||
                                            `Attachment ${idx + 1}`}
                                        </div>
                                        {att.size && (
                                          <div className="text-xs text-gray-500 dark:text-slate-500">
                                            {att.size}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Email Body */}
                            <div className="max-w-none">
                              {displayEmail.body_html ? (
                                <div
                                  className="text-gray-700  email-content bg-white p-4 rounded-lg border border-gray-200 dark:border-slate-700 d-inline-block w-full"
                                  dangerouslySetInnerHTML={{
                                    __html: displayEmail.body_html,
                                  }}
                                />
                              ) : (
                                <div className="text-gray-700  whitespace-pre-wrap leading-relaxed">
                                  {displayEmail.body_plain ||
                                    displayEmail.body ||
                                    "No content"}
                                </div>
                              )}
                            </div>

                            {/* Metadata */}
                            {/* <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
                              <div className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                Email Details
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600 dark:text-slate-400">
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-slate-300">
                                    Message ID:
                                  </span>
                                  <div className="truncate mt-0.5 font-mono text-gray-500 dark:text-slate-500">
                                    {displayEmail.message_id || "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-slate-300">
                                    Source:
                                  </span>
                                  <div className="mt-0.5">
                                    {displayEmail.source || "N/A"}
                                  </div>
                                </div>
                                {displayEmail.thread_key && (
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-slate-300">
                                      Thread Key:
                                    </span>
                                    <div className="truncate mt-0.5 font-mono text-gray-500 dark:text-slate-500">
                                      {displayEmail.thread_key}
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-slate-300">
                                    Direction:
                                  </span>
                                  <div className="mt-0.5 capitalize">
                                    {displayEmail.direction || "Incoming"}
                                  </div>
                                </div>
                              </div>
                            </div> */}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="size-20 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                          <BsInbox className="size-10 text-gray-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                          Inbox
                        </h3>
                        <p className="text-gray-500 dark:text-slate-400 max-w-xs">
                          Select an email from the list to read
                        </p>
                      </div>
                    )}
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
