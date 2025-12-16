import { useState, useEffect } from "react";
import {
  BsPhone,
  BsTelephoneInbound,
  BsTelephoneOutbound,
  BsTelephoneX,
  BsClock,
  BsCalendar3,
  BsCheckCircle,
  BsArrowClockwise,
} from "react-icons/bs";

const generateDummyCalls = (lead) => {
  if (!lead) return [];

  return [
    {
      id: 1,
      type: "incoming",
      status: "completed",
      from: lead.name,
      fromPhone: lead.phone,
      to: "You",
      toPhone: "+1 (555) 123-4567",
      date: "Nov 18, 2024",
      time: "2:30 PM",
      duration: "12:45",
      notes:
        "Discussed product requirements and pricing details. Lead is interested in the premium package. Follow-up scheduled for next week.",
    },
    {
      id: 2,
      type: "outgoing",
      status: "completed",
      from: "You",
      fromPhone: "+1 (555) 123-4567",
      to: lead.name,
      toPhone: lead.phone,
      date: "Nov 17, 2024",
      time: "10:15 AM",
      duration: "8:20",
      notes:
        "Follow-up call regarding the proposal sent last week. Lead confirmed interest and asked for additional technical details.",
    },
    {
      id: 3,
      type: "incoming",
      status: "missed",
      from: lead.name,
      fromPhone: lead.phone,
      to: "You",
      toPhone: "+1 (555) 123-4567",
      date: "Nov 16, 2024",
      time: "4:45 PM",
      duration: "0:00",
      notes: "Missed call - Lead called to discuss urgent requirements.",
    },
    {
      id: 4,
      type: "outgoing",
      status: "completed",
      from: "You",
      fromPhone: "+1 (555) 123-4567",
      to: lead.name,
      toPhone: lead.phone,
      date: "Nov 15, 2024",
      time: "11:30 AM",
      duration: "15:32",
      notes:
        "Initial discovery call. Discussed business needs, timeline, and budget. Lead is very interested and wants to move forward quickly.",
    },
    {
      id: 5,
      type: "incoming",
      status: "completed",
      from: lead.name,
      fromPhone: lead.phone,
      to: "You",
      toPhone: "+1 (555) 123-4567",
      date: "Nov 14, 2024",
      time: "3:20 PM",
      duration: "6:15",
      notes: "Quick call to clarify questions about the service offerings.",
    },
    {
      id: 6,
      type: "outgoing",
      status: "missed",
      from: "You",
      fromPhone: "+1 (555) 123-4567",
      to: lead.name,
      toPhone: lead.phone,
      date: "Nov 13, 2024",
      time: "9:00 AM",
      duration: "0:00",
      notes: "Attempted follow-up call - No answer.",
    },
  ];
};

export default function LeadCall({ lead }) {
  const [calls, setCalls] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (lead) {
      setCalls(generateDummyCalls(lead));
    }
  }, [lead]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setCalls(generateDummyCalls(lead));
      setIsRefreshing(false);
    }, 500);
  };

  const getCallIcon = (type, status) => {
    if (status === "missed") {
      return <BsTelephoneX className="size-6 text-red-500" />;
    }
    if (type === "incoming") {
      return <BsTelephoneInbound className="size-6 text-green-500" />;
    }
    return <BsTelephoneOutbound className="size-6 text-blue-500" />;
  };

  const getCallBadgeColor = (type, status) => {
    if (status === "missed") {
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/40";
    }
    if (type === "incoming") {
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/40";
    }
    return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/40";
  };

  const getCallCardBg = (type, status) => {
    if (status === "missed") {
      return "border-red-200 dark:border-red-800/40";
    }
    if (type === "incoming") {
      return "border-green-200 dark:border-green-800/40";
    }
    return "border-blue-200 dark:border-blue-800/40";
  };

  if (!lead) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full bg-gray-50 dark:bg-slate-900/50">
      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          title="Refresh call history"
        >
          <BsArrowClockwise
            className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {calls.map((call) => (
            <div
              key={call.id}
              className={`bg-white dark:bg-slate-800 rounded-xl border-2 ${getCallCardBg(
                call.type,
                call.status
              )} shadow-sm hover:shadow-md transition-all duration-200`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`size-12 rounded-full flex items-center justify-center ${
                        call.status === "missed"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : call.type === "incoming"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-blue-100 dark:bg-blue-900/30"
                      }`}
                    >
                      {getCallIcon(call.type, call.status)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-slate-100">
                        {call.from}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
                        {call.fromPhone}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium ${getCallBadgeColor(
                      call.type,
                      call.status
                    )}`}
                  >
                    {call.status === "missed"
                      ? "Missed"
                      : call.type === "incoming"
                      ? "Incoming"
                      : "Outgoing"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                {/* Call Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* To */}
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <BsPhone className="size-4 text-gray-600 dark:text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 dark:text-slate-500 font-medium mb-1">
                        To
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                        {call.to}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-slate-400 truncate">
                        {call.toPhone}
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  {call.status !== "missed" && (
                    <div className="flex items-start gap-3">
                      <div className="size-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <BsClock className="size-4 text-gray-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-slate-500 font-medium mb-1">
                          Duration
                        </div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          {call.duration}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <BsCalendar3 className="size-4 text-gray-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-slate-500 font-medium mb-1">
                        Date
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                        {call.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                      <BsClock className="size-4 text-gray-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-slate-500 font-medium mb-1">
                        Time
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                        {call.time}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call Notes */}
                <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                  <div className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <BsCheckCircle className="h-3.5 w-3.5 text-gray-500 dark:text-slate-500" />
                    Call Notes
                  </div>
                  <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                    {call.notes}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {calls.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <BsPhone className="size-8 text-gray-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
              No Calls Found
            </h3>
            <p className="text-gray-500 dark:text-slate-400 max-w-xs">
              No call history available with this lead.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
