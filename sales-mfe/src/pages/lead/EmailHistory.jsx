import { useState, useEffect, useCallback } from "react";
import {
  BsX,
  BsInbox,
  BsSend,
  BsTrash,
  BsPaperclip,
  BsReply,
  BsSearch,
  BsPencilSquare,
  BsArrowClockwise,
  BsEnvelope,
} from "react-icons/bs";
import toast from "react-hot-toast";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "ckeditor5/ckeditor5.css";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";
import { Link } from "react-router-dom";

export default function EmailHistory({ lead }) {
  console.log("Rendering EmailHistory for lead:", lead?.brand?.id);
  const [selectedThread, setSelectedThread] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [conversationLoading, setConversationLoading] = useState(false);

  // Email configs
  const [emailConfigs, setEmailConfigs] = useState([]);
  const [selectedEmailConfig, setSelectedEmailConfig] = useState(null);
  const [loadingConfigs, setLoadingConfigs] = useState(false);

  // Compose/Reply state
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isNewMail, setIsNewMail] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeCc, setComposeCc] = useState("");
  const [composeBcc, setComposeBcc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [composeAttachments, setComposeAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [isToLocked, setIsToLocked] = useState(true);

  const {
    data: threads,
    loading: threadsLoading,
    totalRows,
    currentPage,
    perPage,
    searchTerm,
    setCurrentPage,
    handleSearch,
    refresh,
  } = usePaginatedData(ApiRequest.leadEmails.timeline(lead?.id));

  useEffect(() => {
    if (showComposeModal) {
      const timer = setTimeout(() => {
        setIsAnimatingIn(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimatingIn(false);
    }
  }, [showComposeModal]);

  useEffect(() => {
    if (lead?.id) {
      fetchEmailConfigs();
    }
  }, [lead?.id]);

  const fetchEmailConfigs = async () => {
    setLoadingConfigs(true);
    try {
      const url = lead?.brand?.id
        ? ApiRequest.emailConfigs.listByBrand(lead.brand.id)
        : ApiRequest.emailConfigs.list;
      const response = await apiAxios.get(url);
      const configs = response.data.data || [];
      console.log("configs reponse", configs);
      setEmailConfigs(configs);

      if (configs.length > 0) {
        setSelectedEmailConfig(configs[0].id);
      }
    } catch (error) {
      console.error("Error fetching email configs:", error);
      toast.error("Failed to load email configurations");
    } finally {
      setLoadingConfigs(false);
    }
  };

  const fetchConversation = useCallback(
    async (threadId) => {
      if (!lead?.id || !threadId) return;

      setConversationLoading(true);
      try {
        const encodedThreadId = encodeURIComponent(threadId);
        const response = await apiAxios.get(
          ApiRequest.leadEmails.conversation(lead.id, encodedThreadId)
        );
        const data = response.data;
        setConversation(data.data || []);
      } catch (error) {
        console.error("Error fetching conversation:", error);
        toast.error("Failed to load conversation");
        setConversation([]);
      } finally {
        setConversationLoading(false);
      }
    },
    [lead?.id]
  );

  const resetComposeForm = () => {
    setComposeTo("");
    setComposeCc("");
    setComposeBcc("");
    setComposeSubject("");
    setComposeMessage("");
    setComposeAttachments([]);
    setShowCc(false);
    setShowBcc(false);
    setIsToLocked(true);
  };

  const handleSelectThread = (thread) => {
    setSelectedThread(thread);
    setShowComposeModal(false);
    setIsClosing(false);
    setIsAnimatingIn(false);
    fetchConversation(thread.thread_id);
  };

  const handleNewMail = () => {
    resetComposeForm();
    setIsNewMail(true);
    setComposeTo(lead?.email || "");
    setComposeSubject("");
    setIsClosing(false);
    setShowComposeModal(true);
  };

  const handleReply = () => {
    resetComposeForm();
    setIsNewMail(false);
    if (selectedThread) {
      setComposeTo(selectedThread.latest_email?.from_email || "");
      setComposeSubject(`Re: ${selectedThread.subject}`);
    }
    setIsClosing(false);
    setShowComposeModal(true);
  };

  const handleCloseCompose = () => {
    setIsClosing(true);
    setIsAnimatingIn(false);
    setTimeout(() => {
      setShowComposeModal(false);
      setIsClosing(false);
    }, 300);
  };

  const getEmailThreadData = () => {
    if (!isNewMail && selectedThread && conversation.length > 0) {
      const latestEmail = conversation[0];
      let refs = [];

      if (latestEmail.references) {
        try {
          refs = Array.isArray(latestEmail.references)
            ? latestEmail.references
            : JSON.parse(latestEmail.references);
        } catch (e) {
          refs = [];
        }
      }

      if (latestEmail.message_id && !refs.includes(latestEmail.message_id)) {
        refs.push(latestEmail.message_id);
      }

      return {
        in_reply_to: latestEmail.message_id || null,
        references: refs,
      };
    }
    return { in_reply_to: null, references: [] };
  };

  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const newAttachments = files.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      type: file.type,
      file: file,
    }));

    setComposeAttachments((prev) => [...prev, ...newAttachments]);

    e.target.value = "";
  };

  const removeAttachment = (index) => {
    setComposeAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendEmail = async () => {
    if (!composeTo.trim()) {
      toast.error("Please enter recipient email");
      return;
    }

    if (!composeSubject.trim()) {
      toast.error("Please enter a subject");
      return;
    }

    if (!composeMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!selectedEmailConfig) {
      toast.error("Please select an email configuration");
      return;
    }

    setSending(true);

    try {
      const { in_reply_to, references } = getEmailThreadData();

      // ✅ Create FormData properly
      const formData = new FormData();

      // Basic fields
      formData.append("email_config_id", selectedEmailConfig);
      formData.append("to_email", composeTo);
      formData.append("subject", composeSubject);
      formData.append("body", composeMessage);

      // CC emails
      if (composeCc && composeCc.trim()) {
        const ccEmails = composeCc
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e);
        ccEmails.forEach((email) => {
          formData.append("cc_emails[]", email);
        });
      }

      // BCC emails
      if (composeBcc && composeBcc.trim()) {
        const bccEmails = composeBcc
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e);
        bccEmails.forEach((email) => {
          formData.append("bcc_emails[]", email);
        });
      }

      // Reply threading
      if (!isNewMail && in_reply_to) {
        formData.append("in_reply_to", in_reply_to);

        if (references && references.length > 0) {
          references.forEach((ref) => {
            formData.append("references[]", ref);
          });
        }
      }

      if (composeAttachments.length > 0) {
        composeAttachments.forEach((attachment) => {
          if (attachment.file && attachment.file instanceof File) {
            formData.append("attachments[]", attachment.file);
          }
        });
      }

      await apiAxios.post(ApiRequest.leadEmails.send(lead.id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data) => data,
      });

      toast.success(
        isNewMail ? "Email sent successfully!" : "Reply sent successfully!"
      );

      resetComposeForm();
      handleCloseCompose();

      if (!isNewMail && selectedThread) {
        fetchConversation(selectedThread.thread_id);
      }
      refresh();
    } catch (error) {
      console.error("Error sending email:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to send email");
      }
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const formatFullDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!lead) return null;

  return (
    <div className="flex-1 flex overflow-hidden h-full relative">
      {/* Left Column - Email/Thread List */}
      <div className="w-96 border-r border-gray-200 dark:border-slate-700/60 flex flex-col bg-white dark:bg-slate-900">
        {/* Header with User Info & New Mail Button */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700/60 bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              {lead.name?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                {lead.name || "Lead"}
              </div>
              <div className="text-xs text-gray-500 dark:text-slate-500 truncate">
                {lead.email}
              </div>
            </div>
            <button
              onClick={handleNewMail}
              className="p-2 bg-primary hover:bg-primary/90 text-white rounded-full shadow-sm transition-colors"
              title="New Mail"
            >
              <BsPencilSquare className="size-4" />
            </button>
          </div>

          {/* Search & Refresh */}
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 form-control"
              />
            </div>
            <button
              onClick={refresh}
              disabled={threadsLoading}
              className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              <BsArrowClockwise
                className={`size-4 ${threadsLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
          {threadsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full size-8 border-b-2 border-primary"></div>
            </div>
          ) : threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <BsInbox className="size-12 text-gray-300 dark:text-slate-600 mb-3" />
              <p className="text-gray-500 dark:text-slate-400 text-sm">
                {searchTerm ? "No emails match your search" : "No emails found"}
              </p>
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.thread_id}
                onClick={() => handleSelectThread(thread)}
                className={`p-4 border-b border-gray-100 dark:border-slate-700/40 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                  selectedThread?.thread_id === thread.thread_id
                    ? "bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-l-blue-500"
                    : "hover:bg-gray-50/70 dark:hover:bg-slate-800/60"
                } ${
                  thread.unread_count > 0
                    ? "bg-blue-25/30 dark:bg-blue-900/10"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-sm ${
                      thread.latest_email?.direction === "outgoing"
                        ? "bg-primary"
                        : "bg-gray-500"
                    }`}
                  >
                    {thread.latest_email?.from_name?.charAt(0) ||
                      thread.latest_email?.from_email?.charAt(0) ||
                      "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium truncate ${
                            thread.unread_count > 0
                              ? "text-gray-900 dark:text-slate-100 font-bold"
                              : "text-gray-700 dark:text-slate-300"
                          }`}
                        >
                          {thread.latest_email?.from_name ||
                            thread.latest_email?.from_email ||
                            "Unknown"}
                        </span>
                        {thread.unread_count > 0 && (
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        )}
                        {thread.email_count > 1 && (
                          <span className="text-xs text-gray-500 dark:text-slate-500">
                            ({thread.email_count})
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-slate-500 flex-shrink-0">
                        {formatDate(thread.last_activity)}
                      </span>
                    </div>
                    <div
                      className={`text-sm mb-1 truncate ${
                        thread.unread_count > 0
                          ? "font-semibold text-gray-900 dark:text-slate-100"
                          : "text-gray-700 dark:text-slate-300"
                      }`}
                    >
                      {thread.subject || "(No Subject)"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-slate-500 truncate">
                      {thread.latest_email?.body_preview || ""}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {thread.has_incoming && (
                        <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded">
                          Received
                        </span>
                      )}
                      {thread.has_outgoing && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                          Sent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination info */}
        {totalRows > 0 && (
          <div className="p-3 border-t border-gray-200 dark:border-slate-700/60 bg-gray-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
              <span>
                Showing {threads.length} of {totalRows} threads
              </span>
              {totalRows > perPage && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1 || threadsLoading}
                    className="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <span className="px-2">Page {currentPage}</span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={threads.length < perPage || threadsLoading}
                    className="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Conversation View */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {selectedThread ? (
          <>
            <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4 flex items-center gap-2 bg-white dark:bg-slate-900/80 backdrop-blur-sm">
              <button
                onClick={handleReply}
                className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
              >
                <BsReply className="size-4" />
                <span className="text-sm">Reply</span>
              </button>
              <button className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors shadow-sm flex items-center gap-2 ml-auto">
                <BsTrash className="size-4" />
                <span className="text-sm">Delete</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {conversationLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full size-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                      {selectedThread.subject || "(No Subject)"}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-slate-400">
                      <span>{selectedThread.email_count} messages</span>
                      <span>•</span>
                      <span>
                        {selectedThread.participants?.length || 0} participants
                      </span>
                    </div>
                    {selectedThread.participants &&
                      selectedThread.participants.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedThread.participants.map((p, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-600 dark:text-slate-400"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>

                  <div className="space-y-6">
                    {conversation.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                        No messages in this conversation
                      </div>
                    ) : (
                      conversation.map((email) => (
                        <div
                          key={email.id}
                          className={`p-5 rounded-xl border shadow-sm transition-all ${
                            email.direction === "outgoing"
                              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 ml-6"
                              : "bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-600/60 mr-6"
                          }`}
                        >
                          <div className="flex items-start gap-4 mb-4">
                            <div
                              className={`size-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-sm ${
                                email.direction === "outgoing"
                                  ? "bg-primary"
                                  : "bg-gray-500"
                              }`}
                            >
                              {email.from_name?.charAt(0) ||
                                email.from_email?.charAt(0) ||
                                "?"}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div>
                                  <div className="text-sm font-semibold text-gray-900 dark:text-slate-200">
                                    {email.from_name || email.from_email}
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-slate-400">
                                    <span className="font-medium">From:</span>{" "}
                                    {email.from_email}
                                  </div>
                                  {email.to_emails &&
                                    email.to_emails.length > 0 && (
                                      <div className="text-xs text-gray-600 dark:text-slate-400">
                                        <span className="font-medium">To:</span>{" "}
                                        {email.to_emails.join(", ")}
                                      </div>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-slate-500">
                                  {formatFullDateTime(
                                    email.sent_at || email.received_at
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {email.subject &&
                            email.subject !== selectedThread.subject && (
                              <div className="mb-3 text-sm font-medium text-gray-700 dark:text-slate-300">
                                Subject: {email.subject}
                              </div>
                            )}

                          <div
                            className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: email.body_preview || "(No content)",
                            }}
                          />

                          {/* Attachments Display */}
                          {email.attachments &&
                            email.attachments.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                                <div className="text-xs font-medium text-gray-500 dark:text-slate-400 mb-2">
                                  Attachments ({email.attachments.length})
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {email.attachments.map((att, idx) => (
                                    <a
                                      key={idx}
                                      href={att.url}
                                      download
                                      rel="noopener noreferrer"
                                      className="flex items-baseline gap-2 px-3 py-2 bg-black text-white dark:bg-slate-700 rounded-lg text-xs  transition-colors dark:text-slate-200"
                                    >
                                      <BsPaperclip className="size-3" />
                                      <div>
                                        <span>{att.name}</span>
                                        <span className="text-xs block">
                                          {att.size}
                                        </span>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                          <div className="mt-3 flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                email.direction === "outgoing"
                                  ? "bg-blue-200 text-blue-800 dark:bg-blue-800/40 dark:text-blue-200"
                                  : "bg-green-200 text-green-800 dark:bg-green-800/40 dark:text-green-200"
                              }`}
                            >
                              {email.direction === "outgoing"
                                ? "Sent"
                                : "Received"}
                            </span>
                            {email.is_read === false && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-200">
                                Unread
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="size-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <BsEnvelope className="size-8 text-gray-500 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
              No Email Selected
            </h3>
            <p className="text-gray-500 dark:text-slate-400 max-w-xs">
              Select an email from the list to view its content and reply.
            </p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <>
          <div
            className={`absolute inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
              isAnimatingIn && !isClosing ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleCloseCompose}
          />

          <div
            className={`absolute bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl border-t border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ease-out ${
              isAnimatingIn && !isClosing ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ height: "95%" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white">
                  {isNewMail ? (
                    <BsPencilSquare className="size-5" />
                  ) : (
                    <BsReply className="size-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    {isNewMail ? "New Email" : "Reply"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-500">
                    {isNewMail
                      ? `To: ${lead?.name || lead?.email}`
                      : `Re: ${selectedThread?.subject || ""}`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseCompose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <BsX className="size-6 text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6"
              style={{ height: "calc(100% - 140px)" }}
            >
              <div className="space-y-4">
                {/* Email Config Selection */}
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 w-16">
                    From:
                  </label>
                  {emailConfigs.length > 0 ? (
                    <select
                      value={selectedEmailConfig || ""}
                      onChange={(e) => setSelectedEmailConfig(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-100"
                    >
                      <option value="">Select email account...</option>
                      {emailConfigs.map((config) => (
                        <option key={config.id} value={config.id}>
                          {config.email_address ||
                            config.name ||
                            `Config #${config.id}`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex-1 px-3 py-2 text-sm border border-yellow-300 dark:border-yellow-600 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 ">
                      <p className="flex items-center gap-2 mb-0 text-yellow-800 dark:text-yellow-200">
                        <span>⚠️ No email configurations found.</span>
                        <Link
                          to="/email-configs"
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                          rel="noopener noreferrer"
                        >
                          Set up email account
                        </Link>
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 w-16">
                    To:
                  </label>
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                      readOnly={isToLocked}
                      className={`w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-100 ${
                        isToLocked
                          ? "bg-gray-100 dark:bg-slate-800 cursor-not-allowed"
                          : "bg-white dark:bg-slate-800"
                      }`}
                      placeholder="recipient@email.com"
                    />
                    {isToLocked && (
                      <button
                        type="button"
                        onClick={() => setIsToLocked(false)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                      >
                        Use Another Email
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCc(!showCc)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                      showCc
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    Cc
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBcc(!showBcc)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                      showBcc
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    Bcc
                  </button>
                </div>

                {showCc && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300 w-16">
                      Cc:
                    </label>
                    <input
                      type="text"
                      value={composeCc}
                      onChange={(e) => setComposeCc(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-100"
                      placeholder="cc1@email.com, cc2@email.com"
                    />
                  </div>
                )}

                {showBcc && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300 w-16">
                      Bcc:
                    </label>
                    <input
                      type="text"
                      value={composeBcc}
                      onChange={(e) => setComposeBcc(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-100"
                      placeholder="bcc1@email.com, bcc2@email.com"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 w-16">
                    Subject:
                  </label>
                  <input
                    type="text"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-slate-100"
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden">
                    <CKEditor
                      editor={ClassicEditor}
                      data={composeMessage}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setComposeMessage(data);
                      }}
                      config={{
                        placeholder: "Type your message here...",
                        toolbar: {
                          items: [
                            "heading",
                            "|",
                            "bold",
                            "italic",
                            "link",
                            "bulletedList",
                            "numberedList",
                            "|",
                            "blockQuote",
                            "insertTable",
                            "|",
                            "undo",
                            "redo",
                            "|",
                            "fontFamily",
                            "fontSize",
                          ],
                        },
                        fontFamily: {
                          options: [
                            "default",
                            "Arial, sans-serif",
                            "Courier New, monospace",
                            "Georgia, serif",
                            "Times New Roman, serif",
                            "Verdana, sans-serif",
                          ],
                          supportAllValues: true,
                        },
                        fontSize: {
                          options: [9, 11, 13, "default", 17, 19, 21, 24],
                          supportAllValues: true,
                        },
                        table: {
                          contentToolbar: [
                            "tableColumn",
                            "tableRow",
                            "mergeTableCells",
                          ],
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Attachments Preview */}
                {composeAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {composeAttachments.map((attachment, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-slate-600 text-xs"
                      >
                        <BsPaperclip className="size-3 text-gray-500" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-slate-100 max-w-32 truncate">
                            {attachment.name}
                          </div>
                          <div className="text-gray-500 dark:text-slate-500">
                            {attachment.size}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="ml-1 text-red-500 hover:text-red-700 rounded-full size-5 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <BsX className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="compose-file-attachment"
                  multiple
                  onChange={handleFileAttachment}
                  className="hidden"
                  accept="*/*"
                />
                <label
                  htmlFor="compose-file-attachment"
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <BsPaperclip className="size-4" />
                  Attach
                </label>
                {composeAttachments.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-slate-500">
                    {composeAttachments.length} file(s) selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCloseCompose}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={sending || !selectedEmailConfig}
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full size-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <BsSend className="size-4" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
