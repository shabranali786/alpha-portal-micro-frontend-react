import React from "react";
import {
  BsArrowDownRight,
  BsArrowUpRight,
  BsCartCheck,
  BsClipboardCheck,
  BsCurrencyDollar,
  BsGraphUpArrow,
  BsLightningChargeFill,
  BsPeopleFill,
  BsPieChartFill,
  BsShieldCheck,
  BsShieldLock,
  BsSpeedometer2,
  BsWallet2,
} from "react-icons/bs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const revenueTrend = [
    { month: "Jan", revenue: 18500, refunds: 4200 },
    { month: "Feb", revenue: 21100, refunds: 6100 },
    { month: "Mar", revenue: 19800, refunds: 5500 },
    { month: "Apr", revenue: 26400, refunds: 8200 },
    { month: "May", revenue: 20900, refunds: 6100 },
    { month: "Jun", revenue: 18400, refunds: 4800 },
    { month: "Jul", revenue: 24800, refunds: 4200 },
    { month: "Aug", revenue: 22300, refunds: 9700 },
    { month: "Sep", revenue: 19700, refunds: 5200 },
    { month: "Oct", revenue: 23200, refunds: 5800 },
    { month: "Nov", revenue: 24400, refunds: 6500 },
    { month: "Dec", revenue: 26200, refunds: 7100 },
  ];

  const transactionStatus = [
    { name: "Unpaid", value: 8414, color: "#fbbf24" },
    { name: "Paid", value: 12272, color: "#10b981" },
  ];

  const transactionFeed = [
    {
      name: "John Doe",
      method: "PayPal Payment",
      amount: "+$250",
      type: "credit",
      badge: "PP",
    },
    {
      name: "Alice Johnson",
      method: "Credit Card Payment",
      amount: "+$1,200",
      type: "credit",
      badge: "CC",
    },
    {
      name: "Daniel Carter",
      method: "Wallet Payment",
      amount: "-$350",
      type: "debit",
      badge: "WL",
    },
    {
      name: "Emma Wilson",
      method: "Bank Transfer",
      amount: "+$720",
      type: "credit",
      badge: "BT",
    },
    {
      name: "Liam Johnson",
      method: "Cash on Delivery",
      amount: "-$450",
      type: "debit",
      badge: "CD",
    },
    {
      name: "Sophia Martinez",
      method: "PayPal Payment",
      amount: "-$680",
      type: "debit",
      badge: "PP",
    },
  ];

  const topCustomers = [
    {
      name: "Alice Johnson",
      tier: " Customer",
      orders: 45,
      amount: "$12,500",
    },
    {
      name: "Daniel Carter",
      tier: " Customer",
      orders: 32,
      amount: "$8,200",
    },
    {
      name: "Emma Wilson",
      tier: " Customer",
      orders: 28,
      amount: "$9,750",
    },
    {
      name: "Liam Johnson",
      tier: " Customer",
      orders: 20,
      amount: "$5,400",
    },
    {
      name: "Olivia Brown",
      tier: " Customer",
      orders: 15,
      amount: "$3,900",
    },
  ];

  const countrySales = [
    {
      country: "United States",
      flag: "US",
      share: 65,
      color: "from-violet-500 to-purple-500",
    },
    {
      country: "India",
      flag: "IN",
      share: 45,
      color: "from-amber-400 to-yellow-500",
    },
    {
      country: "Canada",
      flag: "CA",
      share: 74,
      color: "from-rose-400 to-red-500",
    },
    {
      country: "Australia",
      flag: "AU",
      share: 56,
      color: "from-indigo-400 to-blue-500",
    },
    {
      country: "Germany",
      flag: "DE",
      share: 48,
      color: "from-slate-400 to-slate-600",
    },
    {
      country: "France",
      flag: "FR",
      share: 80,
      color: "from-emerald-400 to-teal-500",
    },
    {
      country: "United Kingdom",
      flag: "UK",
      share: 54,
      color: "from-pink-400 to-rose-500",
    },
  ];

  const geographicData = [
    { country: "US", leads: 200627, percentage: 45.2 },
    { country: "PK", leads: 139919, percentage: 37.6 },
    { country: "-", leads: 123355, percentage: 18.0 },
    { country: "IRU", leads: 1564, percentage: 3.3 },
    { country: "BG", leads: 1027, percentage: 1.9 },
    { country: "IN", leads: 985, percentage: 1.8 },
    { country: "IT", leads: 796, percentage: 1.2 },
    { country: "KH", leads: 704, percentage: 1.0 },
    { country: "AU", leads: 622, percentage: 0.8 },
    { country: "NL", leads: 521, percentage: 0.6 },
  ];

  const topBrands = [
    { name: "TrueNorth Apparel", revenue: "$324,320", transactions: 980 },
    { name: "Blue Ash Electronics", revenue: "$318,655", transactions: 954 },
    { name: "Atlantic Prime Foods", revenue: "$298,100", transactions: 894 },
    { name: "Pendry Fitness Co.", revenue: "$283,990", transactions: 861 },
    { name: "Velaris Health", revenue: "$267,548", transactions: 771 },
    { name: "Praxis Media Lab", revenue: "$214,978", transactions: 658 },
    { name: "Kepler Outdoor", revenue: "$198,404", transactions: 629 },
    { name: "Luma Home Goods", revenue: "$179,662", transactions: 542 },
    { name: "Northwind Supplements", revenue: "$166,221", transactions: 504 },
    { name: "Horizon Digital", revenue: "$152,084", transactions: 476 },
  ];

  const topTeams = [
    { name: "Unit Ops - Northeast", revenue: "$1,245,000", transactions: 3890 },
    { name: "Merchant Success", revenue: "$998,345", transactions: 3022 },
    { name: "Inside Sales Tier A", revenue: "$712,902", transactions: 1985 },
    { name: "Unit Ops - EU", revenue: "$644,110", transactions: 1728 },
    { name: "Field Sales West", revenue: "$588,006", transactions: 1644 },
    { name: "Unit Ops - LATAM", revenue: "$531,778", transactions: 1518 },
    { name: "Strategic Partners", revenue: "$494,228", transactions: 1194 },
    { name: "Digital Acquisition", revenue: "$428,110", transactions: 987 },
    { name: "Channel Enablement", revenue: "$384,772", transactions: 865 },
    { name: "Beta Launch Team", revenue: "$312,441", transactions: 712 },
  ];

  const recentMappings = [
    {
      brand: "TrueNorth Apparel",
      merchant: "Lake View Ops #118",
      paymentType: "ACH",
      status: "Live",
      updated: "Nov 12, 2025",
    },
    {
      brand: "Atlantic Prime Foods",
      merchant: "Beacon Stack 07",
      paymentType: "Card",
      status: "Synced",
      updated: "Nov 12, 2025",
    },
    {
      brand: "Velaris Health",
      merchant: "Atlas Gateway 04",
      paymentType: "ACH",
      status: "QA",
      updated: "Nov 11, 2025",
    },
    {
      brand: "Praxis Media Lab",
      merchant: "Unit-014 Premier",
      paymentType: "Card",
      status: "Review",
      updated: "Nov 11, 2025",
    },
    {
      brand: "Kepler Outdoor",
      merchant: "Live Ops Suite 21",
      paymentType: "Wire",
      status: "Live",
      updated: "Nov 11, 2025",
    },
    {
      brand: "Luma Home Goods",
      merchant: "Delta Row 223",
      paymentType: "ACH",
      status: "Pending",
      updated: "Nov 10, 2025",
    },
    {
      brand: "Northwind Supplements",
      merchant: "Switch Ops 09",
      paymentType: "Card",
      status: "Synced",
      updated: "Nov 10, 2025",
    },
    {
      brand: "Avalon Skincare",
      merchant: "Helix Pod 18",
      paymentType: "Wire",
      status: "QA",
      updated: "Nov 09, 2025",
    },
    {
      brand: "Pendry Fitness Co.",
      merchant: "Runway Node 05",
      paymentType: "Card",
      status: "Review",
      updated: "Nov 09, 2025",
    },
    {
      brand: "Horizon Digital",
      merchant: "Mesh Cluster 77",
      paymentType: "ACH",
      status: "Live",
      updated: "Nov 08, 2025",
    },
    {
      brand: "Blue Ash Electronics",
      merchant: "Canyon Ops 33",
      paymentType: "Wire",
      status: "Risk",
      updated: "Nov 08, 2025",
    },
    {
      brand: "Aurora Finance Lab",
      merchant: "Nova Stack 12",
      paymentType: "Card",
      status: "Synced",
      updated: "Nov 07, 2025",
    },
  ];

  const recentSales = [
    {
      order: "#INV-91890",
      amount: "$32,480",
      status: "Settled",
      date: "Nov 14, 2025",
    },
    {
      order: "#INV-91844",
      amount: "$18,920",
      status: "Processing",
      date: "Nov 14, 2025",
    },
    {
      order: "#INV-91822",
      amount: "$14,280",
      status: "Settled",
      date: "Nov 13, 2025",
    },
    {
      order: "#INV-91811",
      amount: "$9,420",
      status: "In Review",
      date: "Nov 13, 2025",
    },
    {
      order: "#INV-91774",
      amount: "$27,650",
      status: "Settled",
      date: "Nov 13, 2025",
    },
    {
      order: "#INV-91765",
      amount: "$4,830",
      status: "Chargeback",
      date: "Nov 12, 2025",
    },
    {
      order: "#INV-91721",
      amount: "$6,330",
      status: "Refunded",
      date: "Nov 12, 2025",
    },
    {
      order: "#INV-91718",
      amount: "$18,240",
      status: "Settled",
      date: "Nov 12, 2025",
    },
    {
      order: "#INV-91688",
      amount: "$21,910",
      status: "Processing",
      date: "Nov 11, 2025",
    },
    {
      order: "#INV-91654",
      amount: "$8,610",
      status: "Settled",
      date: "Nov 11, 2025",
    },
  ];

  const riskSnapshot = {
    alerts: 184,
    resolved: 173,
    investigations: 9,
    chargebackRate: "1.38%",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
      case "Settled":
      case "Live":
      case "Synced":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
      case "Pending":
      case "Processing":
      case "Review":
      case "In Review":
      case "Pending Review":
      case "QA":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
      case "Failed":
      case "Chargeback":
      case "New":
      case "Risk":
      case "At Risk":
        return "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300";
      case "Refunded":
      case "Hold":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="space-y-6 main-branch">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg dark:border-indigo-500/30">
        <div className="relative rounded-2xl bg-white/95 p-6 backdrop-blur dark:bg-slate-900/95">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 size-40 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-3xl" />
          <div className="absolute left-0 bottom-0 -mb-10 -ml-10 size-40 rounded-full bg-gradient-to-tr from-pink-400/20 to-purple-400/20 blur-3xl" />

          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <BsSpeedometer2 size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                  SuperAdmin Dashboard
                </h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 mb-0">
                  Live snapshot of merchant health, unit ops, and settlement
                  rhythm.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 dark:bg-emerald-500/10">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  Synced 4 min ago
                </span>
              </div>

              <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-500 hover:to-purple-500">
                <span className="flex items-center gap-2">
                  <BsLightningChargeFill size={14} />
                  Refresh
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="card p-5 transition hover:-translate-y-0.5">
          <div className="flex flex-wrap gap-3 items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                TOTAL REVENUE
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                $6,405,126.85
              </p>
            </div>
            <div className="flex shrink-0 size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <BsCurrencyDollar size={22} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="card p-5 transition hover:-translate-y-0.5">
          <div className="flex flex-wrap gap-3 items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                MONTHLY REVENUE
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                $124,818.00
              </p>
              <p className="text-xs font-medium mb-0 text-red-500">
                ↓ 71.2% from last month
              </p>
            </div>
            <div className="flex shrink-0 size-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <BsCurrencyDollar size={22} className="text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="card p-5 transition hover:-translate-y-0.5 testing2">
          <div className="flex flex-wrap gap-3 items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                TOTAL TRANSACTIONS
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                20,686
              </p>
              <p className="text-xs font-medium mb-0 text-emerald-500">
                ● 59.32% success rate
              </p>
            </div>
            <div className="flex shrink-0 size-10 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-500/10">
              <BsClipboardCheck size={22} className="text-cyan-500" />
            </div>
          </div>
        </div>

        {/* Total Leads */}
        <div className="card p-5 transition hover:-translate-y-0.5">
          <div className="flex flex-wrap gap-3 items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                TOTAL LEADS
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                68,624
              </p>
              <p className="text-xs font-medium mb-0 text-emerald-500">
                ↗ 5.2% conversion rate
              </p>
            </div>
            <div className="flex shrink-0 size-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10">
              <BsPeopleFill size={22} className="text-purple-500" />
            </div>
          </div>
        </div>

        {/* Active Merchants */}
        <div className="card p-5 transition hover:-translate-y-0.5">
          <div className="flex flex-wrap gap-3 items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                ACTIVE MERCHANTS
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0">
                19{" "}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  / 33 total
                </span>
              </p>
            </div>
            <div className="flex shrink-0 size-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-500/10">
              <BsCartCheck size={22} className="text-orange-500" />
            </div>
          </div>
        </div>

        {/* Active Brands */}
        <div className="card p-5 transition hover:-translate-y-0.5">
          <div className="flex flex-wrap gap-3 items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                ACTIVE BRANDS
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0">
                120{" "}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  / 120 total
                </span>
              </p>
              {/* <p className="text-xs text-slate-500 dark:text-slate-400">
                of 120 total
              </p> */}
            </div>
            <div className="flex shrink-0 size-10 items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-500/10">
              <BsGraphUpArrow size={22} className="text-pink-500" />
            </div>
          </div>
        </div>

        {/* Active Teams */}
        <div className="card p-5 transition hover:-translate-y-0.5">
          <div className="flex flex-wrap gap-3 items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                ACTIVE TEAMS
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0">
                27{" "}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  / 27 total
                </span>
              </p>
            </div>
            <div className="flex shrink-0 size-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
              <BsPieChartFill size={22} className="text-indigo-500" />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="card p-5 transition hover:-translate-y-0.5">
          <div className="flex flex-wrap gap-3 items-start justify-between">
            <div className="flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                ACTIVE USERS
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0">
                144{" "}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  / 145 total
                </span>
              </p>
            </div>
            <div className="flex shrink-0 size-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-500/10">
              <BsPeopleFill size={22} className="text-teal-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-2 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-0">
                Revenue statistics
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total revenue vs refunds
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                <span className="size-2 rounded-full bg-violet-500" />
                Revenue
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                <span className="size-2 rounded-full bg-teal-400" />
                Refunds
              </span>
            </div>
          </div>
          <div className=" h-[calc(calc(100%-50.25px)-calc(var(--spacing)*4))]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrend}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="refundGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: "#e2e8f0",
                    backgroundColor: "white",
                  }}
                  labelStyle={{ color: "#0f172a", fontWeight: 600 }}
                  formatter={(value) => [
                    `$${value.toLocaleString()}`,
                    "Amount",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fill="url(#revGradient)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="refunds"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  fill="url(#refundGradient)"
                  name="Refunds"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
              Transactions
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Monthly
            </span>
          </div>
          <div className="space-y-4">
            {transactionFeed.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {entry.badge}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white mb-0">
                      {entry.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0">
                      {entry.method}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    entry.type === "credit"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }`}
                >
                  {entry.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-100 mb-4">
            Top customers
          </p>
          <div className="space-y-4">
            {topCustomers.map((customer) => (
              <div
                key={customer.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {customer.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white mb-0">
                      {customer.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-0">
                      {customer.tier} • {customer.orders} orders
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {customer.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-100 mb-4">
            Sales by country
          </p>
          <div className="space-y-3">
            {countrySales.map((country) => (
              <div key={country.country}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {country.flag}
                    </span>
                    {country.country}
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {country.share}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${country.color}`}
                    style={{ width: `${country.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Transaction Status
            </p>
          </div>
          <div className=" h-[calc(calc(100%-22.75px)-calc(var(--spacing)*4))] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transactionStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {transactionStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => (
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {value} ({entry.payload.value.toLocaleString()})
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Top Performing Brands
            </p>
          </div>
          <div className="max-h-80 overflow-auto scrollbar-modern md:-mr-2">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-slate-900/70">
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">Brand</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                  <th className="pb-3 font-medium text-right">Transactions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topBrands.map((brand) => (
                  <tr
                    key={brand.name}
                    className="text-slate-700 dark:text-slate-300"
                  >
                    <td className="py-3 font-medium">{brand.name}</td>
                    <td className="py-3 text-right">{brand.revenue}</td>
                    <td className="py-3 text-right">{brand.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Top Performing Teams
            </p>
          </div>
          <div className="max-h-80 overflow-auto scrollbar-modern md:-mr-2">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-slate-900/70">
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">Team</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                  <th className="pb-3 font-medium text-right">Transactions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topTeams.map((team) => (
                  <tr
                    key={team.name}
                    className="text-slate-700 dark:text-slate-300"
                  >
                    <td className="py-3 font-medium">{team.name}</td>
                    <td className="py-3 text-right">{team.revenue}</td>
                    <td className="py-3 text-right">{team.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Recent Merchant Mappings
            </p>
          </div>
          <div className="max-h-96 overflow-auto scrollbar-modern md:-mr-2">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-slate-900/70">
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">Brand</th>
                  <th className="pb-3 font-medium">Merchant</th>
                  <th className="pb-3 font-medium">Payment Type</th>
                  <th className="pb-3 font-medium text-center">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentMappings.slice(0, 10).map((row) => (
                  <tr
                    key={`${row.brand}-${row.merchant}`}
                    className="text-slate-700 dark:text-slate-300"
                  >
                    <td className="py-3 font-medium">{row.brand}</td>
                    <td className="py-3 text-xs">{row.merchant}</td>
                    <td className="py-3">{row.paymentType}</td>
                    <td className="py-3 text-center">{row.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Recent Sales Activity
            </p>
          </div>
          <div className="max-h-96 overflow-auto scrollbar-modern md:-mr-2">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-slate-900/70">
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-3 font-medium">Invoice #</th>
                  <th className="pb-3 font-medium text-right">Amount</th>
                  <th className="pb-3 font-medium text-center">Status</th>
                  <th className="pb-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentSales.map((sale) => (
                  <tr
                    key={sale.order}
                    className="text-slate-700 dark:text-slate-300"
                  >
                    <td className="py-3 font-medium">{sale.order}</td>
                    <td className="py-3 text-right">{sale.amount}</td>
                    <td className="py-3 text-center">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                          sale.status
                        )}`}
                      >
                        {sale.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-xs">{sale.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Risk & Compliance Metrics
          </p>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="text-4xl font-bold text-slate-900 dark:text-white">
              {riskSnapshot.alerts}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Pending Payments
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="text-4xl font-bold text-emerald-500">
              {riskSnapshot.chargebackRate}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Chargeback Rate
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="text-4xl font-bold text-slate-900 dark:text-white">
              {riskSnapshot.investigations}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              High Amount Payments
            </p>
          </div>
        </div>
      </div>

      {/* <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        {footerSummary.map((item) => (
          <div key={item.label} className="card p-5 text-center">
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {item.value}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {item.label}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {item.context}
            </p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Dashboard;
