import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTeamTab, setActiveTeamTab] = useState(0);
  const [expandedUnits, setExpandedUnits] = useState({});

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await apiAxios.get(ApiRequest.profile);
        setProfileData(response.data);
        if (response.data?.units?.length > 0) {
          setExpandedUnits({ [response.data.units[0].id]: true });
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const userData = profileData?.user || user;

  const isSuperAdmin = () => {
    if (!userData?.roles || userData.roles.length === 0) return false;
    const superAdminNames = [
      "superadmin",
      "super-admin",
      "super_admin",
      "super admin",
    ];
    if (typeof userData.roles[0] === "string") {
      return userData.roles.some((role) =>
        superAdminNames.includes(role.toLowerCase())
      );
    }
    return userData.roles.some((role) =>
      superAdminNames.includes((role.name || role).toLowerCase())
    );
  };

  const toggleUnit = (unitId) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // Full Access Card Component for SuperAdmin
  const FullAccessCard = ({ title, icon, color, description }) => (
    <div
      className={`relative overflow-hidden p-4 bg-gradient-to-br ${color} rounded-xl border-2 border-dashed border-current/30`}
    >
      <div className="relative flex items-start gap-3 flex-wrap">
        <div className="flex-shrink-0 size-10 rounded-lg bg-white/20 dark:bg-white/10 flex items-center justify-center backdrop-blur-sm">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-lg font-bold text-current">{title}</h4>
            <span className="px-1 py-0.5 text-md font-bold">∞</span>
          </div>
          <p className="text-sm opacity-80 m-0 dark:text-slate-200">
            {description}
          </p>
        </div>
      </div>
    </div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative size-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-slate-700"></div>
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-sm">
          <div className="size-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg
              className="size-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-900 dark:text-white font-medium mb-1">
            Failed to load profile
          </p>
          <p className="text-gray-500 dark:text-slate-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
          Manage your account information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Profile Card */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden sticky top-6">
            {/* Profile Header */}
            <div
              className={`h-20 ${
                isSuperAdmin()
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}
            ></div>

            <div className="px-5 pb-5">
              {/* Avatar */}
              <div className="-mt-10 mb-4">
                <div
                  className={`size-20 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-sm ${
                    isSuperAdmin()
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600"
                  }`}
                >
                  {isSuperAdmin() ? (
                    <svg
                      className="size-9 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.477l-3.763 1.105 1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {userData?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Name & Email */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {userData?.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                  {userData?.email}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {isSuperAdmin() ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <svg
                      className="size-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.477l-3.763 1.105 1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Super Admin
                  </span>
                ) : (
                  <>
                    {userData?.roles?.map((role, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 capitalize"
                      >
                        {typeof role === "string" ? role : role.name}
                      </span>
                    ))}
                    {userData?.status && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          userData.status === "active"
                            ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {userData.status}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {isSuperAdmin() ? "∞" : profileData?.units?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Units
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {isSuperAdmin() ? "∞" : profileData?.teams?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Teams
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {isSuperAdmin() ? "∞" : profileData?.brands?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-400">
                    Brands
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-5">
          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-medium text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <svg
                  className="size-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Basic Information
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
                    User ID
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm text-gray-900 dark:text-white">
                    #{userData?.id}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm text-gray-900 dark:text-white">
                    {userData?.name || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
                    Email
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm text-gray-900 dark:text-white">
                    {userData?.email || "N/A"}
                  </div>
                </div>
                {!isSuperAdmin() && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-400 mb-1.5">
                      Phone
                    </label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-sm text-gray-900 dark:text-white">
                      {userData?.phone || "Not provided"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========== SUPERADMIN SECTIONS (Original Design) ========== */}
          {isSuperAdmin() && (
            <>
              {/* Roles & Permissions Section */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/60 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 px-6 py-4 border-b border-gray-200 dark:border-slate-700/60">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2 mb-0">
                    <svg
                      className="size-5 text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Roles & Permissions
                  </h3>
                </div>
                <div className="px-6 py-5 space-y-5">
                  {/* Assigned Roles */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-3 block">
                      Assigned Roles
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg flex items-center gap-2">
                        <svg
                          className="size-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.477l-3.763 1.105 1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Super Administrator
                      </span>
                    </div>
                  </div>

                  {/* Full System Access */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider mb-3 block">
                      Permissions
                    </label>
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-500/30">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                          <svg
                            className="size-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-indigo-800 dark:text-indigo-200">
                            Full System Access
                          </h4>
                          <p className="text-sm text-indigo-700 dark:text-indigo-300/80 mt-1">
                            As a Super Administrator, you have unrestricted
                            access to all permissions and features in the
                            system.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizational Access Section */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/60 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800 px-6 py-4 border-b border-gray-200 dark:border-slate-700/60">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2 mb-0">
                    <svg
                      className="size-5 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Organizational Access
                  </h3>
                </div>
                <div className="px-6 py-5">
                  <div className="space-y-4">
                    {/* Full Access Header */}
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/40 mb-4">
                        <svg
                          className="size-10 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L10 6.477l-3.763 1.105 1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Super Administrator Access
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400 mt-2 max-w-md mx-auto mb-0">
                        You have complete unrestricted access to all
                        organizational resources
                      </p>
                    </div>

                    {/* Access Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <FullAccessCard
                        title="All Units"
                        description="Full access to all units"
                        color="from-indigo-100 to-purple-50 dark:from-indigo-500/20 dark:to-purple-500/10 text-indigo-700 dark:text-indigo-300"
                        icon={
                          <svg
                            className="size-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        }
                      />
                      <FullAccessCard
                        title="All Teams"
                        description="Full access to all teams"
                        color="from-cyan-100 to-cyan-50 dark:from-cyan-500/20 dark:to-cyan-500/10 text-cyan-700 dark:text-cyan-300"
                        icon={
                          <svg
                            className="size-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        }
                      />
                      <FullAccessCard
                        title="All Brands"
                        description="Full access to all brands"
                        color="from-violet-100 to-violet-50 dark:from-violet-500/20 dark:to-violet-500/10 text-violet-700 dark:text-violet-300"
                        icon={
                          <svg
                            className="size-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        }
                      />
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-slate-800 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 size-10 rounded-lg bg-indigo-100 dark:bg-purple-500/20 flex items-center justify-center">
                          <svg
                            className="size-5 text-indigo-600 dark:text-indigo-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            What does this mean?
                          </h4>
                          <ul className="mt-2 text-sm text-gray-600 dark:text-slate-400 space-y-1">
                            <li className="flex items-center gap-2 dark:text-slate-400">
                              <svg
                                className="size-4 text-purple-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              View and manage all units in the system
                            </li>
                            <li className="flex items-center gap-2 dark:text-slate-400">
                              <svg
                                className="size-4 text-purple-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Access and manage all teams
                            </li>
                            <li className="flex items-center gap-2 dark:text-slate-400">
                              <svg
                                className="size-4 text-purple-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Full control over all brands
                            </li>
                            <li className="flex items-center gap-2 dark:text-slate-400">
                              <svg
                                className="size-4 text-purple-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Manage user roles and permissions
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========== REGULAR USER SECTIONS ========== */}
          {!isSuperAdmin() && (
            <>
              {/* Teams Section */}
              {profileData?.teams?.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800">
                    <h3 className="font-medium text-xl text-gray-900 dark:text-white flex items-center gap-2">
                      <svg
                        className="size-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      My Teams
                      <span className="ml-auto text-sm font-normal text-gray-400 dark:text-slate-500">
                        {profileData.teams.length} teams
                      </span>
                    </h3>
                  </div>

                  {/* Team Tabs */}
                  <div className="flex overflow-x-auto border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 horizontal-scrollbar">
                    {profileData.teams.map((team, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTeamTab(index)}
                        className={`relative shrink-0 grow px-4 py-2.5 text-sm font-medium transition-colors max-w-[272px] ${
                          activeTeamTab === index
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
                        }`}
                      >
                        {team.title.length > 20
                          ? `${team.title.substring(0, 20)}...`
                          : team.title}
                        {activeTeamTab === index && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Active Team Content */}
                  <div className="p-5">
                    {(() => {
                      const team = profileData.teams[activeTeamTab];
                      return (
                        <div className="space-y-5">
                          {/* Team Info */}
                          <div className="flex items-start gap-3">
                            <div className="size-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                              <svg
                                className="size-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-2xl">
                                {team.title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
                                {team.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {team.unit && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                                    <svg
                                      className="size-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    {team.unit.title}
                                  </span>
                                )}
                                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded">
                                  {team.brands?.length || 0} brands
                                </span>
                                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded">
                                  {team.team_members?.length || 0} members
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Team Brands - WITH SCROLL */}
                          {team.brands?.length > 0 && (
                            <div>
                              <h5 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                Brands
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-modern">
                                {team.brands.map((brand, idx) => (
                                  <a
                                    key={idx}
                                    href={brand.domain}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group"
                                  >
                                    <div className="size-8 rounded-md bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                                        {brand.title?.charAt(0)}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-0">
                                        {brand.title}
                                      </p>
                                    </div>
                                    <svg
                                      className="size-3.5 text-gray-300 dark:text-slate-600 group-hover:text-violet-500 transition-colors"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Team Members - ALL MEMBERS (no +more) */}
                          {team.team_members?.length > 0 && (
                            <div>
                              <h5 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                Members
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {team.team_members.map((member, idx) => (
                                  <div
                                    key={idx}
                                    className={`flex items-center gap-2 ps-1.5 pe-2.5 py-1.5 rounded-full ${
                                      member.id === userData?.id
                                        ? "bg-blue-50 dark:bg-blue-500/10 ring-1 ring-blue-200 dark:ring-blue-500/30"
                                        : "bg-gray-100 dark:bg-slate-800"
                                    }`}
                                  >
                                    <div
                                      className={`size-6 rounded-full flex items-center justify-center text-xs font-medium text-white ${
                                        member.id === userData?.id
                                          ? "bg-blue-500"
                                          : "bg-gray-400 dark:bg-slate-600"
                                      }`}
                                    >
                                      {member.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span
                                      className={`text-xs font-medium ${
                                        member.id === userData?.id
                                          ? "text-blue-700 dark:text-blue-300"
                                          : "text-gray-700 dark:text-slate-300"
                                      }`}
                                    >
                                      {member.name}
                                    </span>
                                    {member.id === userData?.id && (
                                      <span className="text-[10px] font-bold text-blue-500">
                                        YOU
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* All Brands - Collapsible by Unit */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-slate-800">
                  <h3 className="font-medium text-xl text-gray-900 dark:text-white flex items-center gap-2">
                    <svg
                      className="size-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    All Brands
                    <span className="ml-auto text-sm font-normal text-gray-400 dark:text-slate-500">
                      {profileData?.brands?.length || 0} total
                    </span>
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                  {/* Brands grouped by Units */}
                  {profileData?.units?.map((unit) => {
                    const unitBrands =
                      profileData?.brands?.filter(
                        (b) =>
                          b.unit_id == unit.id ||
                          String(b.unit_id) === String(unit.id)
                      ) || [];
                    if (unitBrands.length === 0) return null;
                    const isExpanded = expandedUnits[unit.id];

                    return (
                      <div key={unit.id}>
                        <button
                          onClick={() => toggleUnit(unit.id)}
                          className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                              <svg
                                className="size-4 text-amber-600 dark:text-amber-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
                                />
                              </svg>
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {unit.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-slate-400">
                                {unitBrands.length} brands
                              </div>
                            </div>
                          </div>
                          <svg
                            className={`size-4 text-gray-400 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Brands Grid - Collapsible with Scroll */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded
                              ? "max-h-[400px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="px-5 pb-4 max-h-[350px] overflow-y-auto scrollbar-modern">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {unitBrands.map((brand, idx) => (
                                <a
                                  key={idx}
                                  href={brand.domain}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors group"
                                >
                                  <div className="size-8 rounded-md bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-white">
                                      {brand.title?.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-0">
                                      {brand.title}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500 truncate mb-0">
                                      {brand.domain
                                        ?.replace("https://", "")
                                        .replace("http://", "")
                                        .replace(/\/$/, "")}
                                    </p>
                                  </div>
                                  <svg
                                    className="size-3.5 text-gray-300 dark:text-slate-600 group-hover:text-violet-500 transition-colors flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Brands without Unit */}
                  {(() => {
                    const orphanBrands =
                      profileData?.brands?.filter(
                        (b) =>
                          !b.unit_id || b.unit_id === "" || b.unit_id === "0"
                      ) || [];
                    if (orphanBrands.length === 0) return null;
                    const isExpanded = expandedUnits["orphan"];

                    return (
                      <div key="orphan">
                        <button
                          onClick={() => toggleUnit("orphan")}
                          className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                              <svg
                                className="size-4 text-purple-600 dark:text-purple-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                            </div>
                            <div className="text-left">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                Other Brands
                              </div>
                              <div className="text-xs text-gray-500 dark:text-slate-400">
                                {orphanBrands.length} brands (not assigned to
                                any unit)
                              </div>
                            </div>
                          </div>
                          <svg
                            className={`size-4 text-gray-400 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Brands Grid - Collapsible with Scroll */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded
                              ? "max-h-[400px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="px-5 pb-4 max-h-[350px] overflow-y-auto scrollbar-modern">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {orphanBrands.map((brand, idx) => (
                                <a
                                  key={idx}
                                  href={brand.domain}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors group"
                                >
                                  <div className="size-8 rounded-md bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-white">
                                      {brand.title?.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-0">
                                      {brand.title}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-slate-500 truncate mb-0">
                                      {brand.domain
                                        ?.replace("https://", "")
                                        .replace("http://", "")
                                        .replace(/\/$/, "")}
                                    </p>
                                  </div>
                                  <svg
                                    className="size-3.5 text-gray-300 dark:text-slate-600 group-hover:text-violet-500 transition-colors flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
