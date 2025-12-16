import { useState, useEffect, useRef } from "react";
import {
  BsSend,
  BsPaperclip,
  BsX,
  BsCheck2All,
  BsCheck2,
  BsArrowClockwise,
} from "react-icons/bs";

const generateDummyMessages = (lead) => {
  if (!lead) return [];

  return [
    {
      id: 1,
      from: lead.name,
      fromPhone: lead.phone,
      to: "You",
      toPhone: "+1 (555) 123-4567",
      message: "Hi! I'm interested in learning more about your services.",
      timestamp: "Nov 18, 2024 9:30 AM",
      isMe: false,
      status: "delivered",
    },
    {
      id: 2,
      from: "You",
      fromPhone: "+1 (555) 123-4567",
      to: lead.name,
      toPhone: lead.phone,
      message:
        "Hello! Thank you for reaching out. I'd be happy to help you with that. What specific information are you looking for?",
      timestamp: "Nov 18, 2024 9:35 AM",
      isMe: true,
      status: "read",
    },
    {
      id: 3,
      from: lead.name,
      fromPhone: lead.phone,
      to: "You",
      toPhone: "+1 (555) 123-4567",
      message:
        "I need details about your pricing plans and what features are included in each tier.",
      timestamp: "Nov 18, 2024 9:40 AM",
      isMe: false,
      status: "delivered",
    },
    {
      id: 4,
      from: "You",
      fromPhone: "+1 (555) 123-4567",
      to: lead.name,
      toPhone: lead.phone,
      message:
        "Of course! We have three main pricing tiers: Basic ($49/month), Pro ($99/month), and Enterprise (custom pricing). Each tier comes with different features and support levels.",
      timestamp: "Nov 18, 2024 9:42 AM",
      isMe: true,
      status: "read",
    },
    {
      id: 5,
      from: "You",
      fromPhone: "+1 (555) 123-4567",
      to: lead.name,
      toPhone: lead.phone,
      message:
        "I can send you a detailed comparison chart via email. Would that work for you?",
      timestamp: "Nov 18, 2024 9:42 AM",
      isMe: true,
      status: "read",
    },
    {
      id: 6,
      from: lead.name,
      fromPhone: lead.phone,
      to: "You",
      toPhone: "+1 (555) 123-4567",
      message: "Yes, that would be perfect! My email is " + lead.email,
      timestamp: "Nov 18, 2024 9:45 AM",
      isMe: false,
      status: "delivered",
    },
    {
      id: 7,
      from: "You",
      fromPhone: "+1 (555) 123-4567",
      to: lead.name,
      toPhone: lead.phone,
      message:
        "Great! I've just sent the pricing comparison to your email. Let me know if you have any questions after reviewing it.",
      timestamp: "Nov 18, 2024 9:50 AM",
      isMe: true,
      status: "read",
    },
    {
      id: 8,
      from: lead.name,
      fromPhone: lead.phone,
      to: "You",
      toPhone: "+1 (555) 123-4567",
      message: "Thank you! I'll check it out and get back to you soon.",
      timestamp: "Nov 18, 2024 10:00 AM",
      isMe: false,
      status: "delivered",
    },
    {
      id: 9,
      from: lead.name,
      fromPhone: lead.phone,
      to: "You",
      toPhone: "+1 (555) 123-4567",
      message:
        "Hi again! I've reviewed the pricing. The Pro plan looks good for us. Can we schedule a demo?",
      timestamp: "Nov 18, 2024 2:15 PM",
      isMe: false,
      status: "delivered",
    },
    {
      id: 10,
      from: "You",
      fromPhone: "+1 (555) 123-4567",
      to: lead.name,
      toPhone: lead.phone,
      message:
        "Absolutely! I'm excited to show you what we can do. Are you available for a call this Thursday at 3 PM?",
      timestamp: "Nov 18, 2024 2:20 PM",
      isMe: true,
      status: "read",
    },
    {
      id: 11,
      from: lead.name,
      fromPhone: lead.phone,
      to: "You",
      toPhone: "+1 (555) 123-4567",
      message: "Perfect! Thursday at 3 PM works for me. Looking forward to it!",
      timestamp: "Nov 18, 2024 2:25 PM",
      isMe: false,
      status: "delivered",
    },
  ];
};

export default function LeadSMS({ lead }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (lead) {
      setMessages(generateDummyMessages(lead));
    }
  }, [lead]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setMessages(generateDummyMessages(lead));
      setIsRefreshing(false);
    }, 500);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    const message = {
      id: messages.length + 1,
      from: "You",
      fromPhone: "+1 (555) 123-4567",
      to: lead.name,
      toPhone: lead.phone,
      message: newMessage,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      isMe: true,
      status: "sent",
      attachments: attachments,
    };

    setMessages([...messages, message]);
    setNewMessage("");
    setAttachments([]);
  };

  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const date = msg.timestamp.split(",")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (!lead) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full bg-gray-50 dark:bg-slate-900/50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh messages"
        >
          <BsArrowClockwise
            className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center mb-4">
              <div className="px-4 py-1 bg-gray-200 dark:bg-slate-700 rounded-full text-xs font-medium text-gray-600 dark:text-slate-400 shadow-sm">
                {date}
              </div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-4">
              {msgs.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      msg.isMe ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        msg.isMe
                          ? "bg-blue-500 dark:bg-blue-600 text-white rounded-br-sm"
                          : "bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-bl-sm"
                      }`}
                    >
                      {!msg.isMe && (
                        <div className="text-xs font-semibold mb-1 text-blue-600 dark:text-blue-400">
                          {msg.from}
                        </div>
                      )}
                      <span className="text-sm leading-relaxed whitespace-pre-wrap break-words block">
                        {msg.message}
                      </span>

                      {/* Message Attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.attachments.map((attachment, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                                msg.isMe
                                  ? "bg-blue-600 dark:bg-blue-700 text-white"
                                  : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                              }`}
                            >
                              <BsPaperclip className="h-3 w-3" />
                              <div>
                                <div className="font-medium">
                                  {attachment.name}
                                </div>
                                <div className={msg.isMe ? "text-blue-100" : "text-gray-500 dark:text-slate-400"}>
                                  {attachment.size}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Message Metadata */}
                    <div
                      className={`flex items-center gap-2 mt-1 px-2 text-xs text-gray-500 dark:text-slate-500 ${
                        msg.isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>
                        {msg.timestamp.split(",")[1]?.trim() || msg.timestamp}
                      </span>
                      {msg.isMe && (
                        <span>
                          {msg.status === "read" ? (
                            <BsCheck2All className="size-4 text-blue-500 dark:text-blue-400" />
                          ) : (
                            <BsCheck2 className="size-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="border-t border-gray-200 dark:border-slate-700/60 p-4 bg-white dark:bg-slate-900 shadow-lg">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((attachment, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 text-xs"
              >
                <BsPaperclip className="h-3 w-3 text-gray-500 dark:text-slate-400" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-slate-100">
                    {attachment.name}
                  </div>
                  <div className="text-gray-500 dark:text-slate-400">
                    {attachment.size}
                  </div>
                </div>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="ml-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full size-5 flex items-center justify-center transition-colors"
                >
                  <BsX className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Box */}
        <div className="flex items-end gap-3">
          <input
            type="file"
            id="sms-file-attachment"
            multiple
            onChange={handleFileAttachment}
            className="hidden"
          />
          <label
            htmlFor="sms-file-attachment"
            className="p-3 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shadow-sm"
          >
            <BsPaperclip className="size-5" />
          </label>

          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="w-full px-4 py-3 pr-12 text-sm border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all resize-none shadow-sm"
              placeholder="Type your message..."
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && attachments.length === 0}
            className="p-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <BsSend className="size-5" />
          </button>
        </div>

        {/* Hint Text */}
        <div className="mt-2 text-xs text-gray-500 dark:text-slate-500 text-center">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
}
