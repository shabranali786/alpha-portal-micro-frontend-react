import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BsSearch, BsArrowRepeat } from "react-icons/bs";
import Select from "react-select";

import { useSelectStyles } from "../../hooks/useSelectStyles";
import DataTable from "react-data-table-component";

import toast from "react-hot-toast";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";
import FiltersComponent from "../../components/FiltersComponent";
import { usePaginatedData } from "../../hooks/usePaginatedData";

const mappingTypes = [
  {
    value: "sequence",
    label: "Sequence",
    description:
      "Attach nurture or follow-up flows to the merchants that power recurring billing.",
    accent: { badge: "bg-blue-500", text: "text-blue-600" },
  },
  {
    value: "invoice",
    label: "Invoice",
    description:
      "Map checkout-ready merchants used for one-time and invoiced billings.",
    accent: { badge: "bg-amber-500", text: "text-amber-600" },
  },
];

const merchantsCatalog = [
  {
    id: "merchant-cwp-payarc-a",
    name: "CWP-PAYARC-A",
    supportedTypes: ["sequence", "invoice"],
    stats: { unpaidInvoices: 0, sequenceBrands: 0, invoiceBrands: 0 },
  },
  {
    id: "merchant-tll-payarc-a",
    name: "TLL-PAYARC-A",
    supportedTypes: ["sequence", "invoice"],
    stats: { unpaidInvoices: 1349, sequenceBrands: 1, invoiceBrands: 14 },
  },
  {
    id: "merchant-tll-mav-nmi-a",
    name: "TLL-MAV-NMI-A",
    supportedTypes: ["sequence", "invoice"],
    stats: { unpaidInvoices: 8, sequenceBrands: 0, invoiceBrands: 0 },
  },
  {
    id: "merchant-ldk-cms-auth-y",
    name: "LDK-CMS-AUTH-Y",
    supportedTypes: ["sequence", "invoice"],
    stats: { unpaidInvoices: 0, sequenceBrands: 0, invoiceBrands: 0 },
  },
  {
    id: "merchant-tmfh-payarc-f",
    name: "TMFH-PAYARC-F",
    supportedTypes: ["sequence", "invoice"],
    stats: { unpaidInvoices: 12, sequenceBrands: 6, invoiceBrands: 22 },
  },
  {
    id: "merchant-tmfh-mav-nmi-y",
    name: "TMFH-MAV-NMI-Y",
    supportedTypes: ["sequence", "invoice"],
    stats: { unpaidInvoices: 4, sequenceBrands: 2, invoiceBrands: 7 },
  },
];

const unitsSeed = [
  {
    id: "unit-trademark",
    name: "Trademark",
    teams: [
      {
        id: "team-ali-raza-trademark-yasir",
        name: "Ali Raza - Trademark - Yasir",
        lead: "Ali Raza",
        brands: [
          {
            id: "brand-trademark-dynasty",
            name: "Trademark Dynasty",
            assignments: {
              sequence: ["merchant-tmfh-payarc-f"],
              invoice: ["merchant-tmfh-payarc-f"],
            },
          },
          {
            id: "brand-trademark-wisely",
            name: "Trademark Wisely",
            assignments: {
              sequence: ["merchant-tmfh-payarc-f"],
              invoice: ["merchant-tmfh-payarc-f"],
            },
          },
          {
            id: "brand-trademark-superior",
            name: "Trademark Superior",
            assignments: {
              sequence: ["merchant-tmfh-payarc-f"],
              invoice: ["merchant-tmfh-payarc-f"],
            },
          },
          {
            id: "brand-trademark-leader",
            name: "Trademark Leader",
            assignments: {
              sequence: ["merchant-tmfh-payarc-f"],
              invoice: ["merchant-tmfh-payarc-f"],
            },
          },
          {
            id: "brand-trademark-prestige",
            name: "Trademark Prestige",
            assignments: {
              sequence: ["merchant-tmfh-payarc-f"],
              invoice: ["merchant-tmfh-payarc-f"],
            },
          },
        ],
      },
      {
        id: "team-fakhar-trademark",
        name: "Fakhar Trademark Team",
        lead: "Fakhar",
        brands: [
          {
            id: "brand-trademark-den",
            name: "trademark den",
            assignments: {
              sequence: ["merchant-tmfh-payarc-f"],
              invoice: ["merchant-tll-mav-nmi-a"],
            },
          },
          {
            id: "brand-trademark-vigilant",
            name: "Trademark Vigilant",
            assignments: {
              sequence: ["merchant-tmfh-payarc-f"],
              invoice: ["merchant-tll-mav-nmi-a"],
            },
          },
        ],
      },
      {
        id: "team-humaira-tm",
        name: "Humaira TM Team",
        lead: "Humaira",
        brands: [
          {
            id: "brand-trademark-associates",
            name: "Trademark Associates",
            assignments: {
              sequence: ["merchant-tmfh-payarc-f"],
              invoice: ["merchant-tmfh-payarc-f"],
            },
          },
        ],
      },
    ],
  },
  {
    id: "unit-ebook",
    name: "Ebook",
    teams: [
      {
        id: "team-ebook-core",
        name: "Ayesha - Ebook",
        lead: "Ayesha Khan",
        brands: [
          {
            id: "brand-ebook-ignite",
            name: "Ebook Ignite",
            assignments: {
              sequence: ["merchant-tll-payarc-a"],
              invoice: ["merchant-tll-payarc-a"],
            },
          },
          {
            id: "brand-ebook-summit",
            name: "Ebook Summit",
            assignments: { sequence: [], invoice: ["merchant-tll-mav-nmi-a"] },
          },
        ],
      },
    ],
  },
  {
    id: "unit-oc",
    name: "OC",
    teams: [
      {
        id: "team-oc-ops",
        name: "OC Ops",
        lead: "Fulfilment Desk",
        brands: [
          {
            id: "brand-oc-logistics",
            name: "OC Logistics",
            assignments: { sequence: [], invoice: ["merchant-tll-mav-nmi-a"] },
          },
        ],
      },
    ],
  },
  {
    id: "unit-design",
    name: "Design",
    teams: [
      {
        id: "team-design-core",
        name: "Design Core",
        lead: "Sara Naveed",
        brands: [
          {
            id: "brand-design-lab",
            name: "Design Lab",
            assignments: {
              sequence: ["merchant-ldk-cms-auth-y"],
              invoice: ["merchant-ldk-cms-auth-y"],
            },
          },
        ],
      },
    ],
  },
];

const merchantMetricLabels = [
  { key: "unpaidInvoices", label: "Unpaid Invoices" },
  { key: "sequenceBrands", label: "Sequence Brands" },
  { key: "invoiceBrands", label: "Invoice Brands" },
];

const buildInvoicePreview = (merchantIds, merchantIndex) => {
  const rows = [];
  merchantIds.forEach((mid) => {
    const m = merchantIndex.get(mid);
    const count = Math.min(m?.stats?.unpaidInvoices || 0, 20);
    for (let i = 0; i < count; i++) {
      rows.push({
        id: `${m?.name}-${10000 + i}`,
        brand: "Trademark Dynasty",
        merchant: m?.name || mid,
        amount: ["$38", "$64", "$350", "$414", "$1050", "$2100", "$4275"][
          i % 7
        ],
      });
    }
  });
  return rows;
};

const MerchantMapping = () => {
  const [selectedUnit, setSelectedUnit] = useState(null);
  console.log("selected unit id", selectedUnit);
  const [units, setUnits] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(mappingTypes[0].value);

  const [brandAssignments, setBrandAssignments] = useState({});

  const [selectedBrandIds, setSelectedBrandIds] = useState(new Set());
  const [selectedMerchantIds, setSelectedMerchantIds] = useState(new Set());
  const [merchantSearch, setMerchantSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [merchantsCatalogFromAPI, setMerchantsCatalogFromAPI] = useState([]);
  const [merchantsLoading, setMerchantsLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [assignMode, setAssignMode] = useState("replace");
  const [confirmText, setConfirmText] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [notes, setNotes] = useState("");
  const [updateUnpaidInvoices, setUpdateUnpaidInvoices] = useState(false);
  const [brandMerchantMapping, setBrandMerchantMapping] = useState({});

  // ✅ FIX: Removed selectedType === "invoice" condition - now works for both types
  const {
    data: unpaidInvoices,
    loading: invoicesLoading,
    totalRows: invoicesTotalRows,
    currentPage: invoicesCurrentPage,
    perPage: invoicesPerPage,
    searchTerm: invoiceSearchTerm,
    setCurrentPage: setInvoicesCurrentPage,
    setPerPage: setInvoicesPerPage,
    handleSearch: handleInvoiceSearch,
    refresh: refreshInvoices,
    queryParams: currentInvoiceQueryParams,
    setQueryParams: setInvoiceQueryParams,
    rootData: invoicesRootData,
  } = usePaginatedData(confirmOpen ? ApiRequest.invoices.list : null);

  const isSingleSelect = selectedType === "sequence";

  const merchantIndex = useMemo(() => {
    const m = new Map();
    const catalogToUse =
      merchantsCatalogFromAPI.length > 0
        ? merchantsCatalogFromAPI
        : merchantsCatalog;
    catalogToUse.forEach((x) => m.set(x.id, x));
    return m;
  }, [merchantsCatalogFromAPI]);

  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const selectStyles = useSelectStyles();

  const modeOptions = [
    { value: "replace", label: "Replace Existing" },
    { value: "append", label: "Append to Existing" },
  ];

  const dtStyles = {
    headCells: {
      style: {
        fontSize: 12,
        textTransform: "uppercase",
        color: "#64748b",
        paddingBlock: "8px",
      },
    },
    rows: { style: { minHeight: "36px" } },
    cells: { style: { paddingTop: "8px", paddingBottom: "8px", fontSize: 13 } },
  };

  const syncMerchantsSelection = useCallback(
    (brandIds) => {
      if (brandIds.length === 1) {
        const key = `${brandIds[0]}::${selectedType}`;
        const assigned = brandAssignments[key] ?? [];
        setSelectedMerchantIds(
          new Set(isSingleSelect ? assigned.slice(0, 1) : assigned),
        );
      } else {
        setSelectedMerchantIds(new Set());
      }
    },
    [brandAssignments, selectedType, isSingleSelect],
  );

  useEffect(() => {
    if (!units.length || !units[0]?.teams) {
      setSelectedBrandIds(new Set());
      setSelectedMerchantIds(new Set());
      return;
    }
    const unitBrandIds = units[0].teams.flatMap((team) =>
      team.brands.map((b) => b.id),
    );
    const defaultSelection = unitBrandIds.length
      ? new Set([unitBrandIds[0]])
      : new Set();
    setSelectedBrandIds(defaultSelection);
    syncMerchantsSelection(Array.from(defaultSelection));
  }, [units, syncMerchantsSelection]);

  useEffect(() => {
    syncMerchantsSelection(Array.from(selectedBrandIds));
  }, [selectedBrandIds, selectedType, syncMerchantsSelection]);

  useEffect(() => {
    const fetchMerchants = async () => {
      setMerchantsLoading(true);
      try {
        const response = await apiAxios.get(
          `${ApiRequest.merchants.list}?per_page=100&page=1&with_counts=true`,
        );
        const merchantsData = response.data?.data || [];

        const mappedMerchants = merchantsData.map((merchant) => ({
          id: merchant.id,
          name: merchant.title,
          supportedTypes: ["sequence", "invoice"],
          stats: {
            unpaidInvoices: parseInt(merchant.unpaid_invoices_count) || 0,
            sequenceBrands: parseInt(merchant.sequence_count) || 0,
            invoiceBrands: parseInt(merchant.invoice_count) || 0,
          },
        }));

        setMerchantsCatalogFromAPI(mappedMerchants);
      } catch (error) {
        console.error("Error fetching merchants:", error);
        toast.error("Failed to load merchants");
      } finally {
        setMerchantsLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  useEffect(() => {
    if (!selectedUnit) {
      setUnits([]);
      return;
    }

    const fetchTeams = async () => {
      setTeamsLoading(true);
      try {
        const response = await apiAxios.get(
          `${ApiRequest.teams.list}?unit_id=${selectedUnit.value}&with_merchants=true`,
        );
        const teamsData = response.data?.data || [];

        const mappedTeams = teamsData.map((team) => ({
          id: team.id,
          name: team.title,
          brands: (team.team_brands || []).map((brandData) => ({
            id: brandData.id,
            name: brandData.title,
            assignments: {
              sequence: brandData.website_merchant
                ? [brandData.website_merchant.id]
                : [],
              invoice: (brandData.invoice_merchants || []).map((m) => m.id),
            },
          })),
        }));

        setUnits([
          {
            id: selectedUnit.value,
            name: selectedUnit.label,
            teams: mappedTeams,
          },
        ]);

        const newAssignments = {};
        mappedTeams.forEach((team) => {
          team.brands.forEach((brand) => {
            newAssignments[`${brand.id}::sequence`] =
              brand.assignments.sequence;
            newAssignments[`${brand.id}::invoice`] = brand.assignments.invoice;
          });
        });
        console.log("newAssignments", newAssignments);
        setBrandAssignments(newAssignments);
      } catch (error) {
        console.error("Error fetching teams:", error);
        toast.error("Failed to load teams");
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchTeams();
  }, [selectedUnit]);

  // ✅ FIX: Removed selectedType === "invoice" condition - now works for both types
  useEffect(() => {
    if (!confirmOpen) {
      setInvoiceQueryParams({});
      return;
    }

    const brandIds = Array.from(selectedBrandIds);
    if (!brandIds.length) {
      setInvoiceQueryParams({});
      return;
    }

    const brandIdsParam = brandIds.join(",");
    setInvoiceQueryParams({
      brand_id: brandIdsParam,
      payment_status: "unpaid",
      with_totals: "true",
    });
  }, [confirmOpen, selectedBrandIds, selectedType, setInvoiceQueryParams]);

  useEffect(() => {
    if (assignMode === "append") {
      setUpdateUnpaidInvoices(false);
    }
  }, [assignMode]);

  useEffect(() => {
    if (updateUnpaidInvoices) {
      const initialMapping = {};
      Array.from(selectedBrandIds).forEach((brandId) => {
        initialMapping[brandId] = null;
      });
      setBrandMerchantMapping(initialMapping);
    } else {
      setBrandMerchantMapping({});
    }
  }, [updateUnpaidInvoices, selectedBrandIds]);

  const filteredMerchants = useMemo(() => {
    const catalogToUse =
      merchantsCatalogFromAPI.length > 0
        ? merchantsCatalogFromAPI
        : merchantsCatalog;

    const typeFiltered = catalogToUse.filter((m) =>
      m.supportedTypes.includes(selectedType),
    );
    const term = merchantSearch.trim().toLowerCase();
    return term
      ? typeFiltered.filter((m) => m.name.toLowerCase().includes(term))
      : typeFiltered;
  }, [merchantSearch, selectedType, merchantsCatalogFromAPI]);

  const handleBrandToggle = (brandId) => {
    setSelectedBrandIds((prev) => {
      const next = new Set(prev);
      next.has(brandId) ? next.delete(brandId) : next.add(brandId);
      return next;
    });
  };

  const handleTeamSelectAll = (teamId) => {
    const team = units[0]?.teams?.find((t) => t.id === teamId);
    if (!team) return;
    setSelectedBrandIds(
      (prev) => new Set([...prev, ...team.brands.map((b) => b.id)]),
    );
  };

  const handleTeamUnselectAll = (teamId) => {
    const team = units[0]?.teams?.find((t) => t.id === teamId);
    if (!team) return;
    const ids = new Set(team.brands.map((b) => b.id));
    setSelectedBrandIds(
      (prev) => new Set([...prev].filter((id) => !ids.has(id))),
    );
  };

  const handleMerchantToggle = (merchantId, checked) => {
    if (isSingleSelect) {
      setSelectedMerchantIds(checked ? new Set([merchantId]) : new Set());
      return;
    }
    setSelectedMerchantIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(merchantId) : next.delete(merchantId);
      return next;
    });
  };

  const handleSelectAllMerchants = () => {
    if (isSingleSelect) return;
    if (!filteredMerchants.length) {
      toast.error("No merchants match the current filters.");
      return;
    }
    setSelectedMerchantIds(new Set(filteredMerchants.map((m) => m.id)));
  };

  const guardBeforeAssign = () => {
    const brandIds = Array.from(selectedBrandIds);
    const merchantIds = Array.from(selectedMerchantIds);
    if (!brandIds.length) {
      toast.error("Select at least one brand to continue.");
      return { ok: false };
    }
    if (!merchantIds.length) {
      toast.error("Select merchant(s) before assigning.");
      return { ok: false };
    }
    return { ok: true, brandIds, merchantIds };
  };

  const openConfirm = () => {
    const { ok } = guardBeforeAssign();
    if (!ok) return;
    setAssignMode("replace");
    setConfirmText("");
    setChangeReason("");
    setNotes("");
    setUpdateUnpaidInvoices(false);
    setBrandMerchantMapping({});
    setConfirmOpen(true);
  };

  const handleConfirmAssign = async () => {
    const { ok, brandIds, merchantIds } = guardBeforeAssign();
    if (!ok) return;

    if (confirmText !== "CONFIRM") {
      toast.error('Type "CONFIRM" to proceed.');
      return;
    }
    if (!changeReason.trim()) {
      toast.error("Please provide a brief reason for this change.");
      return;
    }

    if (
      updateUnpaidInvoices &&
      (selectedType !== "invoice" || assignMode !== "replace")
    ) {
      toast.error(
        "Update unpaid invoices only works with Invoice type and Replace mode.",
      );
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        brands: brandIds,
        merchants: merchantIds,
        type: selectedType,
      };

      if (selectedType === "invoice") {
        payload.mode = assignMode;
        if (assignMode === "replace" && updateUnpaidInvoices) {
          payload.update_unpaid_invoices = true;

          // Use brand-wise mapping from UI if available
          const hasValidMapping = Object.keys(brandMerchantMapping).some(
            (key) => brandMerchantMapping[key] !== null,
          );

          if (hasValidMapping) {
            payload.brand_merchant_mapping = brandMerchantMapping;
          } else if (brandIds.length > 1 || merchantIds.length > 1) {
            // Fallback to automatic mapping if no UI mapping provided
            const mapping = {};
            brandIds.forEach((brandId, index) => {
              if (selectedType === "sequence") {
                mapping[brandId] = merchantIds[0];
              } else {
                mapping[brandId] =
                  merchantIds[index % merchantIds.length] || merchantIds[0];
              }
            });
            payload.brand_merchant_mapping = mapping;
          }
        }
      }

      payload.reason = changeReason;
      if (notes.trim()) {
        payload.notes = notes;
      }

      const response = await apiAxios.post(
        ApiRequest.MerchantMapping.assign,
        payload,
      );

      setBrandAssignments((prev) => {
        const next = { ...prev };
        brandIds.forEach((brandId) => {
          const key = `${brandId}::${selectedType}`;
          if (assignMode === "replace") {
            next[key] = [...merchantIds];
          } else {
            const existing = new Set(next[key] || []);
            merchantIds.forEach((m) => existing.add(m));
            next[key] = Array.from(existing);
          }
          if (selectedType === "sequence") next[key] = next[key].slice(0, 1);
        });
        return next;
      });

      setConfirmOpen(false);
      toast.success(
        response.data?.message ||
          `Successfully ${
            assignMode === "replace" ? "replaced" : "appended"
          } merchants for ${brandIds.length} brand${
            brandIds.length === 1 ? "" : "s"
          }.`,
      );

      if (selectedUnit) {
        const teamsResponse = await apiAxios.get(
          `${ApiRequest.teams.list}?unit_id=${selectedUnit.value}&with_merchants=true`,
        );
        const teamsData = teamsResponse.data?.data || [];

        const mappedTeams = teamsData.map((team) => ({
          id: team.id,
          name: team.title,
          brands: (team.team_brands || []).map((brandData) => ({
            id: brandData.id,
            name: brandData.title,
            assignments: {
              sequence: brandData.website_merchant
                ? [brandData.website_merchant.id]
                : [],
              invoice: (brandData.invoice_merchants || []).map((m) => m.id),
            },
          })),
        }));

        setUnits([
          {
            id: selectedUnit.value,
            name: selectedUnit.label,
            teams: mappedTeams,
          },
        ]);
      }
    } catch (error) {
      console.error("Error assigning merchants:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to assign merchants. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderAssignmentsSummary = (brandId, type) => {
    const assignedIds = brandAssignments[`${brandId}::${type.value}`] ?? [];
    if (!assignedIds.length) return "Not assigned";
    return assignedIds
      .map((id) => merchantIndex.get(id)?.name ?? id)
      .join(", ");
  };

  const invoicePreview = useMemo(() => {
    return unpaidInvoices.map((invoice) => ({
      id: invoice.invoice_no || invoice.id,
      brand: invoice.brand?.title || "N/A",
      merchant: invoice.merchant?.title || "N/A",
      amount: `${invoice.merchant?.currency_symbol || "$"}${
        invoice.transaction_amount || "0"
      }`,
      lead: invoice.lead?.name || invoice.lead_email || "N/A",
      team: invoice.team?.title || "N/A",
    }));
  }, [unpaidInvoices]);

  const selectedMerchantOptions = useMemo(() => {
    return Array.from(selectedMerchantIds)
      .map((mId) => {
        const merchant = merchantIndex.get(mId);
        return merchant
          ? {
              value: merchant.id,
              label: merchant.name,
            }
          : null;
      })
      .filter(Boolean);
  }, [selectedMerchantIds, merchantIndex]);

  const applyToAllValue = useMemo(() => {
    const brandIds = Array.from(selectedBrandIds);
    if (brandIds.length === 0) return null;

    const firstBrandMerchant = brandMerchantMapping[brandIds[0]];
    if (!firstBrandMerchant) return null;

    const allSame = brandIds.every(
      (brandId) => brandMerchantMapping[brandId] === firstBrandMerchant,
    );

    if (allSame) {
      return (
        selectedMerchantOptions.find(
          (opt) => opt.value === firstBrandMerchant,
        ) || null
      );
    }

    return null;
  }, [selectedBrandIds, brandMerchantMapping, selectedMerchantOptions]);

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Assign Merchants to Brands
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Pick a unit, tick the brands you want to update, and choose the
              merchants for the selected flow type.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="btn bg-green-700 text-white hover:bg-green-800 shrink-0"
              onClick={openConfirm}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Assign Merchants"}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FiltersComponent
                selectedUnit={selectedUnit}
                onFilterChange={(key, value) => {
                  if (key === "unit") {
                    setSelectedUnit(value);
                  }
                }}
                showUnits={true}
                showBrands={false}
                showMerchants={false}
                showPaymentStatus={false}
                showTransactionType={false}
                showCreatedAt={false}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Select Type
              </label>
              <div className="flex flex-wrap gap-2">
                {mappingTypes.map((type) => {
                  const isActive = selectedType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSelectedType(type.value)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-100"
                          : "border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
                      }`}
                    >
                      {type.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {
                  mappingTypes.find((t) => t.value === selectedType)
                    ?.description
                }
              </p>
            </div>
          </div>

          {/* Main Layout: Brands (Left) + Merchants (Right) */}
          <div className="grid gap-6 lg:grid-cols-[1fr_300px] 4xl:grid-cols-[1fr_400px]">
            {/* Left: Teams + Brands */}
            <div className="space-y-4">
              {teamsLoading ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="size-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    Loading teams...
                  </div>
                </div>
              ) : !selectedUnit ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                  Please select a unit to view teams and brands.
                </div>
              ) : !units[0]?.teams?.length ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                  No teams available for the selected unit.
                </div>
              ) : (
                units[0].teams.map((team) => (
                  <div
                    key={team.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700/60 dark:bg-slate-900/60">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {team.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                          ID: {team.id}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTeamSelectAll(team.id)}
                          className="text-xs px-3 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-blue-300"
                        >
                          Select All
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTeamUnselectAll(team.id)}
                          className="text-xs px-3 py-1 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300"
                        >
                          Unselect All
                        </button>
                      </div>
                    </div>

                    <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 4xl:grid-cols-3 gap-2">
                      {!team.brands.length ? (
                        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                          No brands available for this team yet.
                        </div>
                      ) : (
                        team.brands.map((brand) => {
                          const isChecked = selectedBrandIds.has(brand.id);
                          return (
                            <label
                              key={brand.id}
                              className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 m-0 ${
                                isChecked
                                  ? "border-primary bg-primary/10 text-primary shadow-sm dark:border-primary dark:bg-primary/20"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-primary hover:bg-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary dark:hover:bg-slate-900/40"
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="mt-1 size-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-900"
                                checked={isChecked}
                                onChange={() => handleBrandToggle(brand.id)}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-semibold dark:text-slate-100">
                                  {brand.name}
                                </p>
                                <div className="space-y-1 text-xs">
                                  {mappingTypes.map((type) => (
                                    <p
                                      key={`${brand.id}-${type.value}`}
                                      className={`flex items-start gap-2 ${type.accent.text} dark:text-slate-300`}
                                    >
                                      <span
                                        className={`mt-1 inline-block size-2 rounded-full ${type.accent.badge}`}
                                      />
                                      <span className="font-semibold text-xs">
                                        {type.label}:
                                      </span>
                                      <span className="text-slate-600 dark:text-slate-300 text-xs">
                                        {renderAssignmentsSummary(
                                          brand.id,
                                          type,
                                        )}
                                      </span>
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right: Merchants List */}
            <div className="h-fit sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Merchants
                </h2>
                {!isSingleSelect && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm bg-green-700 text-white hover:bg-green-800"
                      onClick={handleSelectAllMerchants}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-black"
                      onClick={() => setSelectedMerchantIds(new Set())}
                    >
                      Unselect All
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="relative">
                  <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    className="form-control pl-10"
                    placeholder="Search merchants..."
                    value={merchantSearch}
                    onChange={(e) => setMerchantSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-modern -mr-[14px] pr-[7px]">
                {merchantsLoading ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="size-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      Loading merchants...
                    </div>
                  </div>
                ) : !filteredMerchants.length ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 text-center">
                    No merchants match the current filters.
                  </div>
                ) : (
                  filteredMerchants.map((merchant) => {
                    const isChecked = selectedMerchantIds.has(merchant.id);
                    return (
                      <label
                        key={merchant.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors duration-200 ${
                          isChecked
                            ? "border-primary bg-primary/10 shadow-sm dark:border-primary dark:bg-primary/20"
                            : "border-slate-200 bg-white hover:border-primary hover:bg-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary dark:hover:bg-slate-900/40"
                        }`}
                      >
                        <input
                          type={isSingleSelect ? "radio" : "checkbox"}
                          className="mt-1 size-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600 dark:bg-slate-900"
                          checked={isChecked}
                          onChange={(e) =>
                            handleMerchantToggle(merchant.id, e.target.checked)
                          }
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {merchant.name}
                          </p>
                          <div className="space-y-1 text-xs ">
                            <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <span className="inline-block size-2 rounded-full bg-slate-400" />
                              Unpaid Invoices: {merchant.stats.unpaidInvoices}
                            </p>
                            <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <span className="inline-block size-2 rounded-full bg-blue-500" />
                              Sequence Brands: {merchant.stats.sequenceBrands}
                            </p>
                            <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <span className="inline-block size-2 rounded-full bg-amber-500" />
                              Invoice Brands: {merchant.stats.invoiceBrands}
                            </p>
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <Transition show={confirmOpen}>
        <Dialog as="div" className="relative z-50" onClose={setConfirmOpen}>
          <TransitionChild
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
            <div className="flex min-h-full items-center justify-center p-3">
              <TransitionChild
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
              >
                <DialogPanel className="w-full max-w-7xl rounded-2xl bg-white shadow-xl dark:bg-slate-900 dark:text-slate-100">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Confirm Merchant Assignment
                    </h2>
                  </div>

                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full pl-3 pr-1 py-1 text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        Type:
                        <span className="rounded-full bg-white/70 px-2 py-[2px] text-[11px] dark:bg-primary">
                          {
                            mappingTypes.find((t) => t.value === selectedType)
                              ?.label
                          }
                        </span>
                      </span>

                      {/* Mode (react-select) - Only show for invoice type */}
                      {selectedType === "invoice" && (
                        <div className="flex items-center gap-2">
                          <label>Mode</label>
                          <div className="min-w-[220px]">
                            <Select
                              options={modeOptions}
                              value={modeOptions.find(
                                (o) => o.value === assignMode,
                              )}
                              onChange={(opt) =>
                                setAssignMode(opt?.value || "replace")
                              }
                              isSearchable={false}
                              menuPortalTarget={menuPortalTarget}
                              styles={selectStyles}
                              classNamePrefix="tm-select"
                            />
                          </div>
                        </div>
                      )}

                      <div className="ml-auto flex items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2 py-[2px] text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          Brands: {Array.from(selectedBrandIds).length}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-[2px] text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                          Merchants: {Array.from(selectedMerchantIds).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body - 2 Column Layout */}
                  <div className="p-6 grid gap-6 lg:grid-cols-2">
                    {/* Left Column: Assignment Details */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Assignment Details
                      </h3>

                      {/* Selected Brands */}
                      <div className="grid gap-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                            Selected Brands
                          </p>
                          <div className="flex gap-2 overflow-y-auto max-h-[100px] pb-1 flex-wrap scrollbar-modern">
                            {Array.from(selectedBrandIds).length ? (
                              Array.from(selectedBrandIds).map((brandId) => {
                                const brand = units[0]?.teams
                                  ?.flatMap((t) => t.brands)
                                  .find((b) => b.id === brandId);
                                return (
                                  <span
                                    key={brandId}
                                    className="whitespace-nowrap rounded-full px-2 py-[2px] text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                  >
                                    {brand?.name || brandId}
                                  </span>
                                );
                              })
                            ) : (
                              <label>None</label>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                            Selected Merchants
                          </p>
                          <div className="flex gap-2 overflow-y-auto max-h-[100px] pb-1 flex-wrap scrollbar-modern">
                            {Array.from(selectedMerchantIds).length ? (
                              Array.from(selectedMerchantIds).map((mId) => (
                                <span
                                  key={mId}
                                  className="whitespace-nowrap rounded-full px-2 py-[2px] text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                >
                                  {merchantIndex.get(mId)?.name || mId}
                                </span>
                              ))
                            ) : (
                              <label>None</label>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Checkbox for updating unpaid invoices - Only show for invoice type */}
                      {selectedType === "invoice" && (
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id="update-unpaid"
                            checked={updateUnpaidInvoices}
                            onChange={(e) =>
                              setUpdateUnpaidInvoices(e.target.checked)
                            }
                            disabled={assignMode === "append"}
                            className="size-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <label
                            htmlFor="update-unpaid"
                            className={`text-sm text-slate-700 dark:text-slate-300 cursor-pointer m-0 ${
                              assignMode === "append"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            Update unpaid invoices with new merchant assignments
                            {assignMode === "append" && (
                              <span className="block text-xs text-amber-600 dark:text-amber-400 mt-1">
                                Only available in Replace mode
                              </span>
                            )}
                          </label>
                        </div>
                      )}

                      {/* Merchant Assignment Section - Show when updateUnpaidInvoices is true */}
                      {updateUnpaidInvoices &&
                        selectedType === "invoice" &&
                        assignMode === "replace" && (
                          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              Merchant Assignment for Unpaid Invoices
                            </h4>

                            {/* Apply to All Brands */}
                            <div>
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Apply to All Brands
                              </label>
                              <Select
                                options={selectedMerchantOptions}
                                value={applyToAllValue}
                                onChange={(opt) => {
                                  if (opt) {
                                    const newMapping = {};
                                    Array.from(selectedBrandIds).forEach(
                                      (brandId) => {
                                        newMapping[brandId] = opt.value;
                                      },
                                    );
                                    setBrandMerchantMapping(newMapping);
                                  } else {
                                    setBrandMerchantMapping({});
                                  }
                                }}
                                isClearable
                                placeholder="Select merchant for all brands"
                                menuPortalTarget={menuPortalTarget}
                                styles={selectStyles}
                                classNamePrefix="tm-select"
                              />
                            </div>

                            {/* Individual Brand Mappings */}
                            <div className="space-y-3">
                              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Brand-wise Merchant Assignment
                              </label>
                              <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-modern pr-2">
                                {Array.from(selectedBrandIds).map((brandId) => {
                                  const brand = units[0]?.teams
                                    ?.flatMap((t) => t.brands)
                                    .find((b) => b.id === brandId);
                                  return (
                                    <div
                                      key={brandId}
                                      className="flex items-center gap-2"
                                    >
                                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[120px] truncate">
                                        {brand?.name || brandId}
                                      </span>
                                      <div className="flex-1">
                                        <Select
                                          options={selectedMerchantOptions}
                                          value={
                                            brandMerchantMapping[brandId]
                                              ? selectedMerchantOptions.find(
                                                  (opt) =>
                                                    opt.value ===
                                                    brandMerchantMapping[
                                                      brandId
                                                    ],
                                                ) || null
                                              : null
                                          }
                                          onChange={(opt) => {
                                            setBrandMerchantMapping((prev) => ({
                                              ...prev,
                                              [brandId]: opt ? opt.value : null,
                                            }));
                                          }}
                                          isClearable
                                          placeholder="Select merchant"
                                          menuPortalTarget={menuPortalTarget}
                                          styles={selectStyles}
                                          classNamePrefix="tm-select"
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Confirmation */}
                      <div>
                        <label>Type "CONFIRM" to proceed *</label>
                        <input
                          className="form-control text-sm"
                          placeholder="Enter CONFIRM"
                          value={confirmText}
                          onChange={(e) => setConfirmText(e.target.value)}
                        />
                      </div>

                      {/* Reason */}
                      <div>
                        <label>Reason for this change *</label>
                        <input
                          className="form-control text-sm"
                          placeholder="Brief explanation"
                          value={changeReason}
                          onChange={(e) => setChangeReason(e.target.value)}
                        />
                      </div>

                      {/* Notes */}
                      <div>
                        <label>Notes (optional)</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          placeholder="Additional notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Unpaid Invoices Preview
                        </h3>
                        <button
                          type="button"
                          onClick={refreshInvoices}
                          disabled={invoicesLoading}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 disabled:opacity-50"
                        >
                          <BsArrowRepeat
                            className={invoicesLoading ? "animate-spin" : ""}
                          />
                          Refresh
                        </button>
                      </div>

                      {/* Search Box */}
                      <div className="relative">
                        <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          className="form-control pl-10 text-sm"
                          placeholder="Search invoices..."
                          value={invoiceSearchTerm}
                          onChange={(e) => handleInvoiceSearch(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          Total Unpaid: $
                          {(
                            invoicesRootData?.totals?.unpaid_invoices_amount ||
                            0
                          ).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-xs text-slate-500">
                          Showing {invoicePreview.length} of{" "}
                          {invoicesTotalRows || 0}
                        </span>
                      </div>
                      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden max-h-[500px] overflow-y-auto">
                        {invoicesLoading ? (
                          <div className="w-full text-center py-8 dark:bg-slate-900">
                            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-300">
                              <div className="size-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                              Loading invoices...
                            </div>
                          </div>
                        ) : (
                          <DataTable
                            columns={[
                              {
                                name: "Invoice ID",
                                selector: (r) => r.id,
                                sortable: true,
                                width: "140px",
                              },
                              {
                                name: "Lead",
                                selector: (r) => r.lead,
                                sortable: true,
                              },
                              {
                                name: "Brand",
                                selector: (r) => r.brand,
                                sortable: true,
                              },
                              {
                                name: "Team",
                                selector: (r) => r.team,
                                sortable: true,
                              },
                              {
                                name: "Merchant",
                                selector: (r) => r.merchant,
                                sortable: true,
                              },
                              {
                                name: "Amount",
                                selector: (r) => r.amount,
                                right: true,
                                sortable: true,
                                width: "100px",
                              },
                            ]}
                            data={invoicePreview}
                            dense
                            highlightOnHover
                            responsive
                            fixedHeader
                            fixedHeaderScrollHeight="220px"
                            pagination
                            paginationServer
                            paginationTotalRows={invoicesTotalRows}
                            paginationDefaultPage={invoicesCurrentPage}
                            paginationPerPage={invoicesPerPage}
                            onChangePage={setInvoicesCurrentPage}
                            onChangeRowsPerPage={setInvoicesPerPage}
                            paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                            customStyles={dtStyles}
                            className="tm-data-table"
                            noDataComponent={
                              <div className="w-full text-center py-8 dark:bg-slate-900">
                                <div className="text-gray-500 dark:text-slate-300">
                                  No unpaid invoices found for selected brands.
                                </div>
                              </div>
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
                    <button
                      type="button"
                      className="btn btn-black"
                      onClick={() => setConfirmOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleConfirmAssign}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving…" : "Confirm Assignment"}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default MerchantMapping;
