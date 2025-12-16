import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Disclosure, Dialog, Transition } from "@headlessui/react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
  BsChevronDown,
  BsCurrencyDollar,
  BsFillPeopleFill,
  BsGraphUpArrow,
  BsWallet2,
} from "react-icons/bs";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";

const getValue = (value, fallback = "N/A") => {
  if (value === undefined || value === null || value === "") return fallback;
  return value;
};

const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return `$ ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const getTransactionAmount = (record) =>
  Number(record?.transaction_amount ?? record?.amount ?? 0) || 0;

const buildInvoiceUrl = (baseLink, invoiceId) => {
  if (!baseLink || !invoiceId) return null;
  if (baseLink.endsWith("=")) return `${baseLink}${invoiceId}`;
  if (baseLink.includes("?invoice=")) return `${baseLink}${invoiceId}`;
  const separator = baseLink.includes("?") ? "&" : "?invoice=";
  return `${baseLink}${separator}${invoiceId}`;
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const buildDateParams = (filters = {}) => {
  const params = {};
  if (filters?.from) params.from_date = filters.from;
  if (filters?.to) params.to_date = filters.to;
  return params;
};

const parseDateValue = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

const formatDateInputValue = (value) => {
  const date = value instanceof Date ? value : parseDateValue(value);
  if (!date) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatReadableDate = (value) => {
  const date = parseDateValue(value);
  if (!date) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const UnitDetails = ({ data, filters = {} }) => {
  const unitId = data?.id || data?.unit_id;
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [teamUsers, setTeamUsers] = useState({});
  const [userInvoices, setUserInvoices] = useState({});
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [brandWebOrders, setBrandWebOrders] = useState({});
  const [brandsRequested, setBrandsRequested] = useState(false);
  const [brandsError, setBrandsError] = useState(null);

  useEffect(() => {
    setTeamUsers({});
    setUserInvoices({});
    setBrandWebOrders({});
    setBrands([]);
    setBrandsRequested(false);
    setBrandsLoading(false);
    setBrandsError(null);
  }, [unitId, filters?.from, filters?.to]);

  useEffect(() => {
    if (!unitId) return;

    setTeamsLoading(true);
    apiAxios
      .get(ApiRequest.unitReports.teams(unitId), {
        params: buildDateParams(filters),
      })
      .then((response) => {
        setTeams(response.data?.teams || []);
        setTeamsLoading(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Failed to load teams");
        setTeamsLoading(false);
      });
  }, [unitId, filters?.from, filters?.to]);

  const loadTeamUsers = useCallback(
    async (teamId) => {
      if (!unitId || !teamId) return;

      setTeamUsers((prev) => ({
        ...prev,
        [teamId]: { loading: true, data: [] },
      }));

      try {
        const response = await apiAxios.get(
          ApiRequest.unitReports.teamUsers(unitId, teamId),
          { params: buildDateParams(filters) }
        );
        setTeamUsers((prev) => ({
          ...prev,
          [teamId]: { loading: false, data: response.data?.users || [] },
        }));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load users");
        setTeamUsers((prev) => ({
          ...prev,
          [teamId]: { loading: false, data: [] },
        }));
      }
    },
    [unitId, filters]
  );

  const loadBrands = useCallback(async () => {
    if (!unitId || brandsLoading) return;

    setBrandsRequested(true);
    setBrandsLoading(true);
    setBrandsError(null);

    try {
      const response = await apiAxios.get(
        ApiRequest.unitReports.brands(unitId),
        { params: buildDateParams(filters) }
      );
      setBrands(response.data?.brands || []);
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to load brands";
      toast.error(message);
      setBrands([]);
      setBrandsError(message);
    } finally {
      setBrandsLoading(false);
    }
  }, [unitId, filters, brandsLoading]);

  const loadBrandWebOrders = useCallback(
    async (brandId) => {
      if (!unitId || !brandId) return;

      setBrandWebOrders((prev) => ({
        ...prev,
        [brandId]: { loading: true, data: [] },
      }));

      try {
        const response = await apiAxios.get(
          ApiRequest.unitReports.brandWebOrders(unitId, brandId),
          { params: buildDateParams(filters) }
        );
        setBrandWebOrders((prev) => ({
          ...prev,
          [brandId]: { loading: false, data: response.data?.web_orders || [] },
        }));
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load web orders"
        );
        setBrandWebOrders((prev) => ({
          ...prev,
          [brandId]: { loading: false, data: [] },
        }));
      }
    },
    [unitId, filters]
  );

  const loadUserInvoices = useCallback(
    async (teamId, userId) => {
      if (!unitId || !teamId || !userId) return;
      const key = `${teamId}-${userId}`;

      setUserInvoices((prev) => ({
        ...prev,
        [key]: { loading: true, data: [] },
      }));

      try {
        const response = await apiAxios.get(
          ApiRequest.unitReports.userInvoices(unitId, teamId, userId),
          { params: buildDateParams(filters) }
        );
        setUserInvoices((prev) => ({
          ...prev,
          [key]: { loading: false, data: response.data?.invoices || [] },
        }));
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load invoices"
        );
        setUserInvoices((prev) => ({
          ...prev,
          [key]: { loading: false, data: [] },
        }));
      }
    },
    [unitId, filters]
  );

  return (
    <div className="w-full space-y-6 bg-slate-50 px-4 md:px-6 py-4 text-left dark:border-slate-800 dark:bg-slate-800">
      <div>
        <div className="mb-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Teams
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Expand a team to view its users and their customer invoices.
          </p>
        </div>
        <div className="space-y-2">
          {teamsLoading ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              Loading teams&hellip;
            </div>
          ) : teams.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              No teams are currently available for this unit.
            </div>
          ) : (
            teams.map((team, idx) => {
              const teamId = team?.id || team?.team_id;
              const usersState = teamUsers[teamId];

              if (!teamId) {
                return (
                  <UnassignedTeamCard
                    key={`unassigned-${idx}`}
                    amount={team?.total_amount}
                    count={team?.total_count}
                  />
                );
              }

              return (
                <TeamAccordionItem
                  key={teamId}
                  team={team}
                  teamId={teamId}
                  usersState={usersState}
                  onFetchUsers={loadTeamUsers}
                  onFetchUserInvoices={loadUserInvoices}
                  userInvoices={userInvoices}
                />
              );
            })
          )}
        </div>
      </div>

      <div>
        <div className="mb-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Web Orders by Brand
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track direct site orders routed to this unit, grouped by brand.
          </p>
        </div>
        <WebOrdersAccordion
          brands={brands}
          brandsLoading={brandsLoading}
          brandsRequested={brandsRequested}
          brandsError={brandsError}
          onFetchBrands={loadBrands}
          brandWebOrders={brandWebOrders}
          onFetchWebOrders={loadBrandWebOrders}
          webOrdersTotal={Number(data?.lead_total) || 0}
        />
      </div>
    </div>
  );
};

const WebOrdersAccordion = ({
  brands,
  brandsLoading,
  brandsRequested,
  brandsError,
  onFetchBrands,
  brandWebOrders,
  onFetchWebOrders,
  webOrdersTotal,
}) => (
  <Disclosure
    as="div"
    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900"
  >
    {(disclosure) => (
      <WebOrdersAccordionContent
        disclosure={disclosure}
        brands={brands}
        brandsLoading={brandsLoading}
        brandsRequested={brandsRequested}
        brandsError={brandsError}
        onFetchBrands={onFetchBrands}
        brandWebOrders={brandWebOrders}
        onFetchWebOrders={onFetchWebOrders}
        webOrdersTotal={webOrdersTotal}
      />
    )}
  </Disclosure>
);

const WebOrdersAccordionContent = ({
  disclosure,
  brands,
  brandsLoading,
  brandsRequested,
  brandsError,
  onFetchBrands,
  brandWebOrders,
  onFetchWebOrders,
  webOrdersTotal,
}) => {
  const { open } = disclosure;
  const brandTotalsReady = brandsRequested && !brandsLoading && !brandsError;
  const brandAmount = brands.reduce(
    (sum, brand) => sum + Number(brand?.total_amount || 0),
    0
  );
  const fallbackAmount = Number(webOrdersTotal) || 0;
  const totalAmountValue = brandTotalsReady ? brandAmount : fallbackAmount;
  const brandAmountDisplay = formatCurrency(totalAmountValue);

  useEffect(() => {
    if (open && !brandsRequested) {
      onFetchBrands();
    }
  }, [open, brandsRequested, onFetchBrands]);

  const renderPanelContent = () => {
    if (brandsError) {
      return (
        <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700 dark:border-red-500/40 dark:bg-slate-900/70 dark:text-red-200">
          <p className="mb-4 font-semibold">Unable to load web orders.</p>
          <p className="mb-4 text-xs text-red-500 dark:text-red-300">
            {brandsError}
          </p>
          <button
            type="button"
            onClick={onFetchBrands}
            disabled={brandsLoading}
            className="inline-flex items-center rounded-full bg-red-600 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-400"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!brandsRequested || brandsLoading) {
      return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
          Loading brands&hellip;
        </div>
      );
    }

    if (brands.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
          Web orders will appear once brands start receiving payments.
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {brands.map((brandItem, idx) => {
          const brandId =
            brandItem?.brand_id || brandItem?.id || brandItem?.brand?.id;
          const ordersState = brandWebOrders[brandId];

          return (
            <BrandAccordionItem
              key={brandId || `brand-${idx}`}
              brand={brandItem}
              brandId={brandId}
              ordersState={ordersState}
              onFetchWebOrders={onFetchWebOrders}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Disclosure.Button className="flex w-full flex-col gap-4 px-5 py-4 text-left md:flex-row md:items-center md:justify-between">
        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Web Orders
        </p>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Total Amount
            </p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-0">
              {brandAmountDisplay}
            </p>
          </div>
          <BsChevronDown
            className={`size-5 shrink-0 text-slate-500 transition-transform duration-200 dark:text-slate-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </Disclosure.Button>
      <Disclosure.Panel className="border-t border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        {renderPanelContent()}
      </Disclosure.Panel>
    </>
  );
};

const TeamAccordionItem = ({
  team,
  teamId,
  usersState,
  onFetchUsers,
  onFetchUserInvoices,
  userInvoices,
}) => (
  <Disclosure
    as="div"
    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900"
  >
    {(disclosure) => (
      <TeamAccordionContent
        disclosure={disclosure}
        team={team}
        teamId={teamId}
        usersState={usersState}
        onFetchUsers={onFetchUsers}
        onFetchUserInvoices={onFetchUserInvoices}
        userInvoices={userInvoices}
      />
    )}
  </Disclosure>
);

const TeamAccordionContent = ({
  disclosure,
  team,
  teamId,
  usersState,
  onFetchUsers,
  onFetchUserInvoices,
  userInvoices,
}) => {
  const { open } = disclosure;
  const teamMeta = team?.team || team || {};

  useEffect(() => {
    if (open && !usersState) {
      onFetchUsers(teamId);
    }
  }, [open, usersState, onFetchUsers, teamId]);

  const users = usersState?.data || [];
  const usersLoading = usersState?.loading || (open && !usersState);

  return (
    <>
      <Disclosure.Button className="flex w-full flex-col gap-4 border-b border-slate-200 bg-slate-50 py-4 px-5 text-left transition-colors hover:bg-blue-50 dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:bg-slate-800/30 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 m-0">
              {getValue(teamMeta?.name || teamMeta?.title, "Team")}
            </h3>
            <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Team
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 m-0">
            Last activity{" "}
            {formatDate(teamMeta?.updated_at || teamMeta?.created_at)}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Total Amount
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0">
              {formatCurrency(team?.total_amount || 0)}
            </p>
          </div>
          <BsChevronDown
            className={`size-5 text-slate-500 transition-transform duration-200 dark:text-slate-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </Disclosure.Button>

      <Disclosure.Panel className="space-y-3 p-4">
        {usersLoading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            Loading users&hellip;
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            Users will appear here once the team books revenue.
          </div>
        ) : (
          users.map((user) => {
            const userId = user?.created_by?.id || user?.id || user?.user_id;
            if (!userId) return null;
            const userKey = `${teamId}-${userId}`;
            const invoiceState = userInvoices[userKey];

            return (
              <UserAccordionItem
                key={userKey}
                teamId={teamId}
                user={user}
                userId={userId}
                invoiceState={invoiceState}
                onFetchInvoices={onFetchUserInvoices}
              />
            );
          })
        )}
      </Disclosure.Panel>
    </>
  );
};

const UnassignedTeamCard = ({ amount, count }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Unassigned revenue
        </p>
        <p className="mb-0 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Customers not mapped to a team. Drill-down not available.
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Customers
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0">
            {count || 0}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Amount
          </p>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0">
            {formatCurrency(amount || 0)}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const BrandAccordionItem = ({
  brand,
  brandId,
  ordersState,
  onFetchWebOrders,
}) => (
  <Disclosure
    as="div"
    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900"
  >
    {(disclosure) => (
      <BrandAccordionContent
        disclosure={disclosure}
        brand={brand}
        brandId={brandId}
        ordersState={ordersState}
        onFetchWebOrders={onFetchWebOrders}
      />
    )}
  </Disclosure>
);

const BrandAccordionContent = ({
  disclosure,
  brand,
  brandId,
  ordersState,
  onFetchWebOrders,
}) => {
  const { open } = disclosure;
  const brandMeta = brand?.brand || brand || {};

  useEffect(() => {
    if (open && !ordersState) {
      onFetchWebOrders(brandId);
    }
  }, [open, ordersState, onFetchWebOrders, brandId]);

  const orders = ordersState?.data || [];
  const ordersLoading = ordersState?.loading || (open && !ordersState);

  return (
    <>
      <Disclosure.Button className="flex w-full flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 text-left transition-colors hover:bg-blue-50 dark:border-slate-700/60 dark:bg-slate-900 dark:hover:bg-slate-800/30 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 m-0">
              {getValue(brandMeta?.title, "Brand")}
            </h3>
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
              Brand
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 m-0">
            {getValue(brandMeta?.domain, "No domain linked")}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Orders
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0">
              {brand?.total_count || 0}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Amount
            </p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-300 mb-0">
              {formatCurrency(brand?.total_amount || 0)}
            </p>
          </div>
          <BsChevronDown
            className={`size-5 text-slate-500 transition-transform duration-200 dark:text-slate-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </Disclosure.Button>

      <Disclosure.Panel className="space-y-3 p-4">
        {ordersLoading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            Loading web orders&hellip;
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-white dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Brand
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Payment Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {orders.map((order, idx) => (
                  <tr
                    key={order?.record_id || idx}
                    className="bg-white dark:bg-slate-900"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0">
                          {getValue(order?.lead_name, "Customer")}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0">
                          {getValue(order?.lead_email)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0">
                          {getValue(order?.lead_phone)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {getValue(order?.brand?.title)}
                      <span className="block text-xs text-slate-500 dark:text-slate-400">
                        {getValue(order?.merchant?.title)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {getValue(order?.source || order?.sale_origin)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {formatDate(order?.paid_at || order?.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-blue-600 dark:text-blue-300">
                      {formatCurrency(getTransactionAmount(order))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            No web orders found for this brand within the selected dates.
          </div>
        )}
      </Disclosure.Panel>
    </>
  );
};

const UserAccordionItem = ({
  teamId,
  user,
  userId,
  invoiceState,
  onFetchInvoices,
}) => (
  <Disclosure
    as="div"
    className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700/60 dark:bg-slate-900/40"
  >
    {(disclosure) => (
      <UserAccordionContent
        disclosure={disclosure}
        teamId={teamId}
        user={user}
        userId={userId}
        invoiceState={invoiceState}
        onFetchInvoices={onFetchInvoices}
      />
    )}
  </Disclosure>
);

const UserAccordionContent = ({
  disclosure,
  teamId,
  user,
  userId,
  invoiceState,
  onFetchInvoices,
}) => {
  const { open } = disclosure;
  const userMeta = user?.created_by || user || {};
  const [leadInvoicesCache, setLeadInvoicesCache] = useState({});
  const [historyModal, setHistoryModal] = useState({
    open: false,
    record: null,
    leadId: null,
  });

  useEffect(() => {
    if (open && !invoiceState) {
      onFetchInvoices(teamId, userId);
    }
  }, [open, invoiceState, onFetchInvoices, teamId, userId]);

  const invoices = invoiceState?.data || [];
  const invoicesLoading = invoiceState?.loading || (open && !invoiceState);
  const currentHistory = historyModal.leadId
    ? leadInvoicesCache[historyModal.leadId]
    : null;
  const historyInvoices = currentHistory?.data || [];
  const historyLoading =
    currentHistory?.loading || (historyModal.open && !currentHistory);
  const historyTotal = currentHistory?.totalAmount || 0;

  const handleCloseHistory = useCallback(() => {
    setHistoryModal({ open: false, record: null, leadId: null });
  }, []);

  const handleViewAllInvoices = useCallback(
    async (invoice) => {
      const leadId = invoice?.lead_id || invoice?.record_id;
      if (!leadId) {
        toast.error("Missing lead reference for this invoice");
        return;
      }

      setHistoryModal({ open: true, record: invoice, leadId });

      if (leadInvoicesCache[leadId]) {
        return;
      }

      setLeadInvoicesCache((prev) => ({
        ...prev,
        [leadId]: { loading: true, data: [], totalAmount: 0 },
      }));

      try {
        const response = await apiAxios.get(
          ApiRequest.unitReports.leadInvoices(leadId)
        );
        setLeadInvoicesCache((prev) => ({
          ...prev,
          [leadId]: {
            loading: false,
            data: response.data?.invoices || [],
            totalAmount: Number(response.data?.total_amount) || 0,
          },
        }));
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load previous invoices"
        );
        setLeadInvoicesCache((prev) => ({
          ...prev,
          [leadId]: { loading: false, data: [], totalAmount: 0 },
        }));
      }
    },
    [leadInvoicesCache]
  );
  const handleOpenInvoiceLink = useCallback((url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener");
  }, []);

  return (
    <>
      <Disclosure.Button className="flex w-full flex-col gap-3 p-3 px-5 text-left transition-colors hover:bg-blue-50 bg-slate-50 dark:bg-slate-800/30 hover:dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0">
            {getValue(userMeta?.name || userMeta?.full_name, "User")}
          </p>
          <span className="inline-flex items-center rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            User
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Customers
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0">
              {user?.total_count || 0}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Amount
            </p>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300 m-0">
              {formatCurrency(user?.total_amount || 0)}
            </p>
          </div>
          <BsChevronDown
            className={`size-4 text-slate-500 transition-transform duration-200 dark:text-slate-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </Disclosure.Button>

      <Disclosure.Panel className="border-t border-slate-200 px-4 py-4 dark:border-slate-700/60">
        {invoicesLoading ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            Loading customers&hellip;
          </div>
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-white dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Brand
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Payment Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Invoices
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {invoices.map((invoice, idx) => (
                  <tr
                    key={invoice?.record_id || invoice?.invoice_id || idx}
                    className="bg-white dark:bg-slate-900"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-0">
                          {getValue(invoice?.lead_name, "Customer")}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0">
                          {getValue(invoice?.lead_email)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0">
                          {getValue(invoice?.lead_phone)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {getValue(invoice?.brand?.title)}
                      <span className="block text-sm text-slate-700 dark:text-slate-400">
                        {getValue(invoice?.merchant?.title)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {getValue(invoice?.source || invoice?.sale_origin)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                      {formatDate(
                        invoice?.paid_at ||
                          invoice?.payment_date ||
                          invoice?.created_at
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                      {formatCurrency(getTransactionAmount(invoice))}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                        onClick={() => handleViewAllInvoices(invoice)}
                      >
                        View All Invoices
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            Customers will appear here once this user books revenue.
          </div>
        )}
      </Disclosure.Panel>

      <Transition appear show={historyModal.open} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseHistory}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Invoice history
                      </Dialog.Title>
                      <Dialog.Description className="text-sm text-slate-500 dark:text-slate-400">
                        {getValue(historyModal.record?.lead_name, "Customer")} •{" "}
                        {getValue(historyModal.record?.lead_email)}
                      </Dialog.Description>
                      {historyModal.record?.lead_phone && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-0">
                          {historyModal.record.lead_phone}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-slate-300 px-4 py-1 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                      onClick={handleCloseHistory}
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-5">
                    {historyLoading ? (
                      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                        Loading invoice history&hellip;
                      </div>
                    ) : historyInvoices.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                          <thead className="bg-white dark:bg-slate-900">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Brand / Merchant
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Payment Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Status
                              </th>
                              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Amount
                              </th>
                              {/* <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                Invoice
                              </th> */}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {historyInvoices.map((history, idx) => {
                              const invoiceId =
                                history?.record_id ||
                                history?.invoice_id ||
                                history?.invoice_number ||
                                historyModal.record?.record_id;
                              const brandLink =
                                history?.invoice_link ||
                                historyModal.record?.brand?.invoice_link;
                              const invoiceUrl = buildInvoiceUrl(
                                brandLink,
                                invoiceId
                              );
                              // console.log("invoiceUrl", invoiceUrl);

                              return (
                                <tr key={`${invoiceId || idx}-${idx}`}>
                                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                                    <span className="block font-semibold text-slate-900 dark:text-slate-100">
                                      {getValue(history?.brand_title)}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {getValue(history?.merchant)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">
                                    {formatDate(history?.payment_date)}
                                  </td>
                                  <td className="px-4 py-3 text-sm capitalize text-slate-700 dark:text-slate-300">
                                    {getValue(history?.transaction_status)}
                                  </td>
                                  <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                                    {formatCurrency(history?.amount || 0)}
                                  </td>
                                  {/* <td className="px-4 py-3 text-right">
                                    <button
                                      type="button"
                                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                                        invoiceUrl
                                          ? "border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700/60 dark:text-blue-300 dark:hover:bg-blue-900/30"
                                          : "cursor-not-allowed border-slate-300 text-slate-400 dark:border-slate-700 dark:text-slate-500"
                                      }`}
                                      onClick={() =>
                                        handleOpenInvoiceLink(invoiceUrl)
                                      }
                                      disabled={!invoiceUrl}
                                    >
                                      View Invoice
                                    </button>
                                  </td> */}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                        No previous invoices found.
                      </div>
                    )}
                  </div>

                  <div className="mt-5 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Total collected: {formatCurrency(historyTotal)}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const UnitReport = () => {
  const [filters, setFilters] = useState({ from: "", to: "" });
  const [appliedFilters, setAppliedFilters] = useState({ from: "", to: "" });
  const [units, setUnits] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerWrapperRef = useRef(null);

  const dateRangeSelection = useMemo(() => {
    const fromDate = parseDateValue(filters.from);
    const toDate = parseDateValue(filters.to);
    const today = new Date();
    const startDate = fromDate || toDate || today;
    let endDate = toDate || fromDate || today;

    if (endDate < startDate) {
      endDate = startDate;
    }

    return [
      {
        startDate,
        endDate,
        key: "selection",
      },
    ];
  }, [filters.from, filters.to]);

  useEffect(() => {
    if (!showDatePicker) return undefined;

    const handleClickOutside = (event) => {
      if (
        datePickerWrapperRef.current &&
        !datePickerWrapperRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDatePicker]);

  useEffect(() => {
    setUnitsLoading(true);

    apiAxios
      .get(ApiRequest.unitReports.list, {
        params: buildDateParams(appliedFilters),
      })
      .then((response) => {
        const payload = response.data || {};
        setUnits(payload.units || []);
        setGrandTotal(Number(payload.grand_total) || 0);

        if (!filters.from && !filters.to && payload.date_range) {
          setFilters({
            from: payload.date_range.from || "",
            to: payload.date_range.to || "",
          });
        }
        setUnitsLoading(false);
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message || "Failed to load unit reports"
        );
        setUnitsLoading(false);
      });
  }, [appliedFilters]);

  const summary = useMemo(() => {
    return units.reduce(
      (acc, unit) => ({
        totalSales: acc.totalSales + (Number(unit?.total_amount) || 0),
        invoiceTotal: acc.invoiceTotal + (Number(unit?.invoice_total) || 0),
        leadTotal: acc.leadTotal + (Number(unit?.lead_total) || 0),
        units: acc.units + 1,
        orders: acc.orders + (Number(unit?.total_count) || 0),
      }),
      { totalSales: 0, invoiceTotal: 0, leadTotal: 0, units: 0, orders: 0 }
    );
  }, [units]);

  const filterChips = useMemo(() => {
    const chips = [];
    if (appliedFilters.from)
      chips.push({
        key: "from",
        label: `From ${formatDate(appliedFilters.from)}`,
      });
    if (appliedFilters.to)
      chips.push({ key: "to", label: `To ${formatDate(appliedFilters.to)}` });
    return chips;
  }, [appliedFilters]);

  const unitColumns = useMemo(
    () => [
      {
        name: "Unit",
        selector: (row) => row?.title || row?.name || "",
        sortable: true,
        grow: 2,
        cell: (row) => (
          <span className="font-medium text-slate-900 dark:text-slate-100">
            {getValue(row?.title || row?.name, "Unit")}
          </span>
        ),
      },
      {
        name: "Total Amount",
        selector: (row) => Number(row?.total_amount) || 0,
        sortable: true,
        right: true,
        cell: (row) => (
          <span className="font-semibold text-blue-600 dark:text-blue-300">
            {formatCurrency(row?.total_amount || 0)}
          </span>
        ),
      },
      {
        name: "Invoice Total",
        selector: (row) => Number(row?.invoice_total) || 0,
        sortable: true,
        right: true,
        cell: (row) => formatCurrency(row?.invoice_total || 0),
      },
      {
        name: "Web Total",
        selector: (row) => Number(row?.lead_total) || 0,
        sortable: true,
        right: true,
        cell: (row) => formatCurrency(row?.lead_total || 0),
      },
    ],
    []
  );

  const handleDateRangeChange = useCallback((item) => {
    const { startDate, endDate } = item.selection;
    setFilters((prev) => ({
      ...prev,
      from: formatDateInputValue(startDate),
      to: formatDateInputValue(endDate),
    }));
  }, []);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setShowDatePicker(false);
  };

  const handleResetFilters = () => {
    setFilters({ from: "", to: "" });
    setAppliedFilters({ from: "", to: "" });
    setShowDatePicker(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card bg-gradient-to-br from-blue-500 to-indigo-500 text-white sm:col-span-2 xl:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-100">
                {summary.units} active units
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-nowrap ">
                {formatCurrency(grandTotal)}
              </h2>
            </div>
            <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
              <BsCurrencyDollar className="size-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Units Covered
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {summary.units}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <BsFillPeopleFill className="size-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Web Orders Total
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(summary.leadTotal)}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <BsGraphUpArrow className="size-6 text-emerald-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Invoice Total
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(summary.invoiceTotal)}
              </p>
            </div>
            <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <BsWallet2 className="size-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Unit Sales Overview
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Filter by date
          </p>
        </div>

        <div className="relative mt-6 space-y-4" ref={datePickerWrapperRef}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Select Date Range
            </label>
            <input
              type="text"
              className="form-control cursor-pointer"
              placeholder="Choose start and end date"
              value={
                filters.from && filters.to
                  ? `${formatReadableDate(filters.from)} - ${formatReadableDate(
                      filters.to
                    )}`
                  : filters.from
                  ? `${formatReadableDate(filters.from)}`
                  : filters.to
                  ? `${formatReadableDate(filters.to)}`
                  : ""
              }
              readOnly
              onClick={() => setShowDatePicker(true)}
              onFocus={() => setShowDatePicker(true)}
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Applies to Unit Report listings after you click Apply.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-black"
              onClick={handleResetFilters}
            >
              Reset
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApplyFilters}
            >
              Apply
            </button>
          </div>

          {showDatePicker && (
            <div className="absolute left-0 right-0 top-full z-20 mt-4 overflow-auto rounded-lg border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900 max-w-fit">
              <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-100">
                  Select date range
                </p>
                <button
                  type="button"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={() => setShowDatePicker(false)}
                >
                  Close
                </button>
              </div>
              <DateRangePicker
                onChange={handleDateRangeChange}
                ranges={dateRangeSelection}
                moveRangeOnFirstSelection={false}
                showSelectionPreview
                rangeColors={["#2563eb"]}
                direction="horizontal"
                className="bg-white dark:bg-slate-900"
              />
            </div>
          )}
        </div>
      </div>

      {filterChips.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/50 dark:bg-blue-950/30">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Active Filters:
            </span>
            {filterChips.map((chip) => (
              <span
                key={chip.key}
                className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/40 dark:text-blue-100"
              >
                {chip.label}
              </span>
            ))}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm dark:border-slate-700/70 dark:bg-slate-900/70">
        <DataTable
          className="tm-data-table"
          columns={unitColumns}
          data={units}
          progressPending={unitsLoading}
          dense
          highlightOnHover
          pagination
          paginationRowsPerPageOptions={[5, 10, 20]}
          responsive
          expandableRows
          expandOnRowClicked
          expandableRowsComponent={({ data }) => (
            <>
              {console.log("Expanded unit data:", data)}
              <UnitDetails data={data} filters={appliedFilters} />
            </>
          )}
          noDataComponent={
            <div className="w-full py-10 text-center text-slate-500 dark:text-slate-400 dark:bg-slate-800">
              <p className="text-base font-semibold text-slate-600 dark:text-slate-200">
                No units found
              </p>
              <p className="text-sm">
                Adjust your search keywords or reset the filters above.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default UnitReport;
