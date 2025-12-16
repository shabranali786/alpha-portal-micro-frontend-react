import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Select from "react-select";

import { useSelectStyles } from "@crm/shared/hooks/useSelectStyles";
import DataTable from "react-data-table-component";

import toast from "react-hot-toast";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";

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

const MerchantMappingBackup = () => {
  const [units] = useState(unitsSeed);
  const [selectedUnitId, setSelectedUnitId] = useState(unitsSeed[0]?.id ?? "");
  const [selectedType, setSelectedType] = useState(mappingTypes[0].value);

  const [brandAssignments, setBrandAssignments] = useState(() => {
    const initial = {};
    units.forEach((u) =>
      u.teams.forEach((t) =>
        t.brands.forEach((b) =>
          mappingTypes.forEach((type) => {
            initial[`${b.id}::${type.value}`] =
              b.assignments?.[type.value] ?? [];
          })
        )
      )
    );
    return initial;
  });

  const [selectedBrandIds, setSelectedBrandIds] = useState(new Set());
  const [selectedMerchantIds, setSelectedMerchantIds] = useState(new Set());
  const [merchantSearch, setMerchantSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [merchantsOpen, setMerchantsOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [assignMode, setAssignMode] = useState("replace");
  const [confirmText, setConfirmText] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [notes, setNotes] = useState("");

  const isSingleSelect = selectedType === "sequence";

  const selectedUnit = useMemo(
    () => units.find((u) => u.id === selectedUnitId),
    [units, selectedUnitId]
  );

  const merchantIndex = useMemo(() => {
    const m = new Map();
    merchantsCatalog.forEach((x) => m.set(x.id, x));
    return m;
  }, []);

  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const selectStyles = useSelectStyles();

  const modeOptions = [
    { value: "replace", label: "Replace Existing" },
    { value: "append", label: "Append to Existing" },
  ];

  const dtStyles = {
    headCells: {
      style: { fontSize: 12, textTransform: "uppercase", color: "#64748b" },
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
          new Set(isSingleSelect ? assigned.slice(0, 1) : assigned)
        );
      } else {
        setSelectedMerchantIds(new Set());
      }
    },
    [brandAssignments, selectedType, isSingleSelect]
  );

  useEffect(() => {
    if (!selectedUnit) {
      setSelectedBrandIds(new Set());
      setSelectedMerchantIds(new Set());
      return;
    }
    const unitBrandIds = selectedUnit.teams.flatMap((team) =>
      team.brands.map((b) => b.id)
    );
    const defaultSelection = unitBrandIds.length
      ? new Set([unitBrandIds[0]])
      : new Set();
    setSelectedBrandIds(defaultSelection);
    syncMerchantsSelection(Array.from(defaultSelection));
  }, [selectedUnit, syncMerchantsSelection]);

  useEffect(() => {
    syncMerchantsSelection(Array.from(selectedBrandIds));
  }, [selectedBrandIds, selectedType, syncMerchantsSelection]);

  const filteredMerchants = useMemo(() => {
    const typeFiltered = merchantsCatalog.filter((m) =>
      m.supportedTypes.includes(selectedType)
    );
    const term = merchantSearch.trim().toLowerCase();
    return term
      ? typeFiltered.filter((m) => m.name.toLowerCase().includes(term))
      : typeFiltered;
  }, [merchantSearch, selectedType]);

  const handleBrandToggle = (brandId) => {
    setSelectedBrandIds((prev) => {
      const next = new Set(prev);
      next.has(brandId) ? next.delete(brandId) : next.add(brandId);
      return next;
    });
  };

  const handleTeamSelectAll = (teamId) => {
    const team = selectedUnit?.teams.find((t) => t.id === teamId);
    if (!team) return;
    setSelectedBrandIds(
      (prev) => new Set([...prev, ...team.brands.map((b) => b.id)])
    );
  };

  const handleTeamUnselectAll = (teamId) => {
    const team = selectedUnit?.teams.find((t) => t.id === teamId);
    if (!team) return;
    const ids = new Set(team.brands.map((b) => b.id));
    setSelectedBrandIds(
      (prev) => new Set([...prev].filter((id) => !ids.has(id)))
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
    setConfirmOpen(true);
  };

  const handleConfirmAssign = () => {
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

    setIsSaving(true);
    setTimeout(() => {
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
      setIsSaving(false);
      setConfirmOpen(false);
      setMerchantsOpen(false);
      toast.success(
        `${assignMode === "replace" ? "Replaced" : "Appended"} ${
          merchantIds.length
        } merchant${merchantIds.length === 1 ? "" : "s"} for ${
          brandIds.length
        } brand${brandIds.length === 1 ? "" : "s"}.`
      );
    }, 400);
  };

  const renderAssignmentsSummary = (brandId, type) => {
    const assignedIds = brandAssignments[`${brandId}::${type.value}`] ?? [];
    if (!assignedIds.length) return "Not assigned";
    return assignedIds
      .map((id) => merchantIndex.get(id)?.name ?? id)
      .join(", ");
  };

  const invoicePreview = useMemo(() => {
    return selectedType === "invoice"
      ? buildInvoicePreview(Array.from(selectedMerchantIds), merchantIndex)
      : [];
  }, [selectedMerchantIds, selectedType, merchantIndex]);

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
              className="btn btn-primary shrink-0"
              onClick={() => setMerchantsOpen(true)}
            >
              Open Merchants Panel
            </button>
            {/* <button
              type="button"
              className="btn btn-primary shrink-0"
              onClick={openConfirm}
              disabled={isSaving}
            >
              {isSaving ? "SavingGǪ" : "Assign Merchants"}
            </button> */}
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Select Unit
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(e.target.value)}
                className="form-control"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
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

          {/* Teams + Brands */}
          <div className="space-y-4">
            {!selectedUnit?.teams.length ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                No teams available for the selected unit.
              </div>
            ) : (
              selectedUnit.teams.map((team) => (
                <div
                  key={team.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700/60 dark:bg-slate-900/60">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {team.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Lead: {team.lead}
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

                  <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 gap-4">
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
                            className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 ${
                              isChecked
                                ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-500 dark:bg-blue-900/40 dark:text-blue-100"
                                : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-900/40"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="mt-1 size-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900"
                              checked={isChecked}
                              onChange={() => handleBrandToggle(brand.id)}
                            />
                            <div className="flex-1">
                              <p className="text-sm font-semibold dark:text-slate-100">
                                {brand.name}
                              </p>
                              <div className="mt-2 space-y-1 text-xs">
                                {mappingTypes.map((type) => (
                                  <p
                                    key={`${brand.id}-${type.value}`}
                                    className={`flex items-start gap-2 ${type.accent.text} dark:text-slate-300`}
                                  >
                                    <span
                                      className={`mt-1 inline-block size-2 rounded-full ${type.accent.badge}`}
                                    />
                                    <span className="font-semibold">
                                      {type.label}:
                                    </span>
                                    <span className="text-slate-600 dark:text-slate-300">
                                      {renderAssignmentsSummary(brand.id, type)}
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
        </div>
      </div>

      {/* Merchants Offcanvas */}
      <Transition show={merchantsOpen}>
        <Dialog as="div" className="relative z-50" onClose={setMerchantsOpen}>
          <TransitionChild
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-xl">
                    <div className="flex h-full flex-col overflow-hidden border border-transparent bg-white shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                      <div className="border-b px-4 py-4 sm:px-6 border-slate-200 dark:border-slate-700/60">
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            Merchants
                          </h2>
                          <button
                            type="button"
                            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                            onClick={() => setMerchantsOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <svg
                              className="size-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                        <div className="flex items-center gap-4 mt-4">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              className="form-control pl-10"
                              placeholder="Search merchants by name"
                              value={merchantSearch}
                              onChange={(e) =>
                                setMerchantSearch(e.target.value)
                              }
                            />
                            <BsSearch className="pointer-events-none absolute left-3 top-2/4 size-4 -translate-y-2/4 text-slate-400" />
                          </div>

                          <div className="flex gap-2">
                            {/* Select All only for invoice (multi-select) */}
                            {selectedType === "invoice" && (
                              <button
                                type="button"
                                className="btn bg-green-700 text-white hover:bg-green-800"
                                onClick={handleSelectAllMerchants}
                              >
                                Select All
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => setSelectedMerchantIds(new Set())}
                            >
                              Unselect All
                            </button>
                          </div>
                        </div>

                        <div className="mt-5 space-y-3 overflow-y-auto pr-1">
                          {!filteredMerchants.length ? (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 text-center">
                              No merchants match the current filters.
                            </div>
                          ) : (
                            filteredMerchants.map((merchant) => {
                              const isChecked = selectedMerchantIds.has(
                                merchant.id
                              );
                              const inputType = isSingleSelect
                                ? "radio"
                                : "checkbox";
                              return (
                                <label
                                  key={merchant.id}
                                  className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition-colors duration-200 ${
                                    isChecked
                                      ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-500 dark:bg-blue-900/40 dark:text-blue-100"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-900/40"
                                  }`}
                                >
                                  <input
                                    type={inputType}
                                    name="merchant-single-select"
                                    className="mt-1 size-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900"
                                    checked={isChecked}
                                    onChange={(e) =>
                                      handleMerchantToggle(
                                        merchant.id,
                                        e.target.checked
                                      )
                                    }
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                      {merchant.name}
                                    </p>
                                    <div className="grid gap-2 sm:grid-cols-3">
                                      {merchantMetricLabels.map((metric) => (
                                        <div key={metric.key}>
                                          <p className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                            {metric.label}
                                          </p>
                                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {merchant.stats[metric.key]}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </label>
                              );
                            })
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-200 px-4 py-4 sm:px-6 dark:border-slate-700/60">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Selected: {selectedMerchantIds.size} merchant
                            {selectedMerchantIds.size === 1 ? "" : "s"}
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="btn btn-black"
                              onClick={() => setMerchantsOpen(false)}
                            >
                              Close
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={openConfirm}
                              disabled={isSaving}
                            >
                              Apply to Selected Brands
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Confirm Modal (react-select + react-data-table + colored chips) */}
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
                <DialogPanel className="w-full max-w-3xl rounded-2xl bg-white shadow-xl dark:bg-slate-900 dark:text-slate-100">
                  {/* Header */}
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800">
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

                      {/* Mode (react-select) */}
                      <div className="flex items-center gap-2">
                        <label>Mode</label>
                        <div className="min-w-[220px]">
                          <Select
                            options={modeOptions}
                            value={modeOptions.find(
                              (o) => o.value === assignMode
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

                  {/* Body */}
                  <div className="p-3 space-y-3">
                    {/* Colored chips (soft gray) */}
                    <div className="grid gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                          Selected Brands
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {Array.from(selectedBrandIds).length ? (
                            Array.from(selectedBrandIds).map((b) => (
                              <span
                                key={b}
                                className="whitespace-nowrap rounded-full px-2 py-[2px] text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                              >
                                {b}
                              </span>
                            ))
                          ) : (
                            <label>None</label>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                          Selected Merchants
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {Array.from(selectedMerchantIds).length ? (
                            Array.from(selectedMerchantIds).map((mId) => (
                              <span
                                key={mId}
                                className="whitespace-nowrap rounded-full px-2 py-[2px] text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                              >
                                {merchantsCatalog.find((m) => m.id === mId)
                                  ?.name || mId}
                              </span>
                            ))
                          ) : (
                            <label>None</label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Inputs row */}
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <label>Type "CONFIRM" to proceed *</label>
                        <input
                          className="form-control text-sm"
                          placeholder="Enter CONFIRM"
                          value={confirmText}
                          onChange={(e) => setConfirmText(e.target.value)}
                        />
                      </div>

                      <div>
                        <label>Reason for this change *</label>
                        <input
                          className="form-control text-sm"
                          placeholder="Brief explanation"
                          value={changeReason}
                          onChange={(e) => setChangeReason(e.target.value)}
                        />
                      </div>
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

                    {/* Preview */}
                    {selectedType === "invoice" ? (
                      <details className="rounded-xl border border-slate-200 dark:border-slate-700">
                        <summary className="cursor-pointer select-none rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold dark:bg-slate-900/50">
                          Unpaid Invoices Preview
                          <span className="ml-2 text-xs font-normal text-slate-500">
                            ({invoicePreview.length} rows)
                          </span>
                        </summary>
                        <div className="card p-0 max-h-70 overflow-auto">
                          <DataTable
                            columns={[
                              {
                                name: "Invoice ID",
                                selector: (r) => r.id,
                                sortable: true,
                              },
                              {
                                name: "Brand",
                                selector: (r) => r.brand,
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
                              },
                            ]}
                            data={invoicePreview}
                            dense
                            highlightOnHover
                            responsive
                            fixedHeader
                            fixedHeaderScrollHeight="220px"
                            pagination={invoicePreview.length > 10}
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
                            customStyles={dtStyles}
                            className="tm-data-table"
                            noDataComponent={
                              <div className="w-full text-center py-8 dark:bg-slate-900 dark:bg-slate-800">
                                <div className="text-gray-500 dark:text-slate-300">
                                  No unpaid invoices in preview.
                                </div>
                              </div>
                            }
                          />
                        </div>
                      </details>
                    ) : (
                      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/50">
                        <span className="font-semibold">Summary</span>
                        <span className="text-slate-600 dark:text-slate-300">
                          {Array.from(selectedMerchantIds).length} merchant(s)
                          will be{" "}
                          {assignMode === "replace" ? "replaced" : "appended"}{" "}
                          across {Array.from(selectedBrandIds).length} brand(s)
                        </span>
                      </div>
                    )}
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
                      {isSaving ? "SavingGǪ" : "Confirm Assignment"}
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

export default MerchantMappingBackup;
