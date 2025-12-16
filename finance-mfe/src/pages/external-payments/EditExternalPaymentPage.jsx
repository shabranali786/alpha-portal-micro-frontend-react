import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useSelectStyles } from "@crm/shared/hooks/useSelectStyles";
import { FiltersComponent } from "@crm/shared/components/AllComponents";
import toast from "react-hot-toast";
import { BsArrowLeft, BsPlus, BsTrash, BsUpload } from "react-icons/bs";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { usePermission } from "@crm/shared/utils/permissions";

const EditExternalPaymentPage = () => {
  const canEditExternalPayment = usePermission(["invoice.otherPayments.edit"]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!canEditExternalPayment) {
      toast.error("You don't have permission to edit external payments");
      navigate("/external-payments");
    }
  }, [canEditExternalPayment, navigate]);

  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploadingProof, setUploadingProof] = useState(false);

  const [teams, setTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loadingUserTeams, setLoadingUserTeams] = useState(false);

  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const selectStyles = useSelectStyles();

  const userData = useSelector((state) => state.auth.user);

  const isSuperAdmin = useMemo(() => {
    return userData?.roles?.includes("superadmin");
  }, [userData]);

  const hasAssignPermission = useMemo(() => {
    if (isSuperAdmin) return true;
    return userData?.permissions?.includes("user.index") || false;
  }, [userData, isSuperAdmin]);

  const hasUpdateMerchantPermission = useMemo(() => {
    if (isSuperAdmin) return true;
    return userData?.permissions?.includes("merchant.index") || false;
  }, [userData, isSuperAdmin]);

  const transactionStatusOptions = [
    { value: "unpaid", label: "Unpaid" },
    { value: "paid", label: "Paid" },
  ];

  const isPaid = formData?.transaction_status?.value === "paid";
  const merchantRequiresProof =
    formData?.merchant?.proof_required === true ||
    formData?.merchant?.proof_required === "1";

  // Handle filter changes from FiltersComponent
  const handleFilterChange = useCallback(
    (filterType, selectedOption) => {
      if (filterType === "user") {
        setFormData((prev) => ({ ...prev, assigned_user: selectedOption }));
        if (errors.assigned_user) {
          setErrors((prev) => ({ ...prev, assigned_user: "" }));
        }
      } else if (filterType === "merchant") {
        setFormData((prev) => ({ ...prev, merchant: selectedOption }));
        // Clear proof if new merchant doesn't require it
        if (
          !selectedOption?.proof_required &&
          selectedOption?.proof_required !== "1"
        ) {
          setFormData((prev) => ({ ...prev, proof_of_payment: "" }));
        }
        if (errors.merchant) {
          setErrors((prev) => ({ ...prev, merchant: "" }));
        }
      }
    },
    [errors.assigned_user, errors.merchant]
  );

  const fetchTeams = useCallback(async () => {
    try {
      const response = await apiAxios.get(
        `${ApiRequest.teams.list}?per_page=100`
      );
      const teamsData = response.data?.data || [];
      setTeams(
        teamsData.map((team) => ({
          value: team.id,
          label: team.title || team.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching teams:", error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load teams");
      }
    }
  }, []);

  const loadUserTeams = useCallback((selectedUser) => {
    if (!selectedUser || !selectedUser.teams) {
      setUserTeams([]);
      return;
    }

    const teamOptions = selectedUser.teams.map((team) => ({
      value: team.id,
      label: team.title || team.name,
    }));
    setUserTeams(teamOptions);
  }, []);

  const fetchUserTeams = useCallback(async (userId) => {
    if (!userId) {
      setUserTeams([]);
      return;
    }

    setLoadingUserTeams(true);
    try {
      const response = await apiAxios.get(ApiRequest.users.teams(userId));
      const teamsData = response.data?.data || [];
      const teamOptions = teamsData.map((team) => ({
        value: team.id,
        label: team.title || team.name,
      }));
      setUserTeams(teamOptions);
    } catch (error) {
      console.error("Error fetching user teams:", error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load user teams");
      }
      setUserTeams([]);
    } finally {
      setLoadingUserTeams(false);
    }
  }, []);

  const fetchInvoice = useCallback(async () => {
    try {
      const response = await apiAxios.get(ApiRequest.externalPayments.show(id));
      const invoice = response.data?.data || response.data;
      let dueDateFormatted = "";
      if (invoice.due_date) {
        if (invoice.due_date.includes(" ")) {
          dueDateFormatted = invoice.due_date.split(" ")[0];
        } else if (invoice.due_date.includes("T")) {
          dueDateFormatted = invoice.due_date.split("T")[0];
        } else {
          dueDateFormatted = invoice.due_date;
        }
      }

      // Parse paid_at
      let paidAtFormatted = "";
      if (invoice.paid_at) {
        if (invoice.paid_at.includes(" ")) {
          paidAtFormatted = invoice.paid_at.split(" ")[0];
        } else if (invoice.paid_at.includes("T")) {
          paidAtFormatted = invoice.paid_at.split("T")[0];
        } else {
          paidAtFormatted = invoice.paid_at;
        }
      }

      const mappedData = {
        invoice_number: invoice.invoice_no || "INV-XXXXXX",
        lead_id: invoice.lead_id || invoice.lead?.id || null,
        assigned_user: invoice.created_by
          ? {
              value: invoice.created_by.id,
              label: invoice.created_by.name || "Unknown Agent",
              email: invoice.created_by.email,
              teams: invoice.created_by.teams || [],
            }
          : null,

        // Team
        team: invoice.team
          ? {
              value: invoice.team.id,
              label: invoice.team.title || invoice.team.name || "Unknown Team",
            }
          : null,

        // Merchant
        merchant: invoice.merchant
          ? {
              value: invoice.merchant.id,
              label:
                invoice.merchant.title ||
                invoice.merchant.name ||
                "Unknown Merchant",
              proof_required:
                invoice.merchant.proof_required === "1" ||
                invoice.merchant.proof_required === true,
            }
          : null,

        // Merchant Details from invoice_external_detail
        merchant_details:
          invoice.invoice_external_detail?.merchant_details ||
          "No merchant details provided",

        // Transaction Status
        transaction_status: invoice.transaction_status
          ? {
              value: invoice.transaction_status,
              label: invoice.transaction_status === "paid" ? "Paid" : "Unpaid",
            }
          : { value: "unpaid", label: "Unpaid" },

        // Payment details from invoice_external_payment (when paid)
        user_comment: invoice.invoice_external_payment?.user_comment || "",
        proof_of_payment:
          invoice.invoice_external_payment?.proof_of_payment || "",
        paid_at: invoice.invoice_external_payment?.paid_at
          ? invoice.invoice_external_payment.paid_at.split("T")[0]
          : paidAtFormatted,

        // Lead Data with fallbacks
        lead_data: {
          name: invoice.lead?.name || "Unknown Customer",
          email: invoice.lead?.email || invoice.lead_email || "No email",
          phone: invoice.lead?.phone || "No phone",
          brand: invoice.brand?.title || "No Brand",
          city: invoice.lead?.city || "",
          region: invoice.lead?.region || "",
          country: invoice.lead?.country || "",
          ip: invoice.lead?.ip || "",
        },

        // Due Date
        due_date: dueDateFormatted,

        // Services from invoice_items with fallback
        services:
          invoice.invoice_items && invoice.invoice_items.length > 0
            ? invoice.invoice_items.map((item) => ({
                service_name: item.service || "Unnamed Service",
                quantity: parseInt(item.qty) || 1,
                price: parseFloat(item.price) || 0,
                amount: (
                  (parseInt(item.qty) || 1) * (parseFloat(item.price) || 0)
                ).toFixed(2),
              }))
            : [
                {
                  service_name: "Sample Service",
                  quantity: 1,
                  price: 0,
                  amount: "0.00",
                },
              ],

        // Totals (will be calculated)
        subtotal: invoice.transaction_amount || "0.00",
        total: invoice.transaction_amount || "0.00",
      };

      setFormData(mappedData);

      // Load user teams if assigned_user exists and has assign permission
      if (mappedData.assigned_user && hasAssignPermission) {
        fetchUserTeams(mappedData.assigned_user.value);
      }
    } catch (error) {
      console.error("Error fetching external payment:", error);
      toast.error("Failed to load external payment");
      navigate("/external-payments");
    }
  }, [id, navigate, hasAssignPermission, fetchUserTeams]);

  useEffect(() => {
    const loadData = async () => {
      setPageLoading(true);
      try {
        await Promise.all([fetchInvoice(), fetchTeams()]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [fetchInvoice, fetchTeams]);

  // Update user teams when assigned_user changes (after initial load)
  useEffect(() => {
    if (!pageLoading && formData?.assigned_user && hasAssignPermission) {
      fetchUserTeams(formData.assigned_user.value);
    }
  }, [
    formData?.assigned_user?.value,
    hasAssignPermission,
    pageLoading,
    fetchUserTeams,
  ]);

  useEffect(() => {
    if (!formData) return;

    const subtotal = formData.services.reduce(
      (sum, service) => sum + (parseFloat(service.amount) || 0),
      0
    );

    const nextSubtotal = subtotal.toFixed(2);
    const nextTotal = subtotal.toFixed(2);

    if (formData.subtotal !== nextSubtotal || formData.total !== nextTotal) {
      setFormData((prev) => ({
        ...prev,
        subtotal: nextSubtotal,
        total: nextTotal,
      }));
    }
  }, [formData?.services]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    newServices[index][field] = value;

    if (field === "quantity" || field === "price") {
      const qty = parseFloat(newServices[index].quantity) || 0;
      const price = parseFloat(newServices[index].price) || 0;
      newServices[index].amount = (qty * price).toFixed(2);
    }

    setFormData((prev) => ({ ...prev, services: newServices }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { service_name: "", quantity: 1, price: 0, amount: "0.00" },
      ],
    }));
  };

  const removeService = (index) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, services: newServices }));
    }
  };

  const handleProofUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only images (JPG, PNG) or PDF files");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setUploadingProof(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await apiAxios.post("/upload", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fileUrl = response.data?.url || response.data?.data?.url;
      handleChange("proof_of_payment", fileUrl);
      toast.success("Proof uploaded successfully");
    } catch (error) {
      console.error("Error uploading proof:", error);
      toast.error("Failed to upload proof of payment");
    } finally {
      setUploadingProof(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.team) {
      newErrors.team = "Team is required";
    }

    if (hasUpdateMerchantPermission && !formData.merchant) {
      newErrors.merchant = "Merchant is required";
    }

    if (
      !formData.merchant_details.trim() ||
      formData.merchant_details === "No merchant details provided"
    ) {
      newErrors.merchant_details = "Merchant details are required";
    }

    if (isPaid) {
      if (!formData.user_comment.trim()) {
        newErrors.user_comment = "Comment is required when status is paid";
      }
      if (!formData.paid_at) {
        newErrors.paid_at = "Paid date is required when status is paid";
      }
    }

    if (!formData.due_date) {
      newErrors.due_date = "Due date is required";
    }

    const hasValidService = formData.services.some(
      (service) =>
        service.service_name.trim() &&
        service.service_name !== "Sample Service" &&
        service.service_name !== "Unnamed Service" &&
        service.quantity > 0 &&
        service.price > 0
    );

    if (!hasValidService) {
      newErrors.services = "At least one valid service is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix all errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const items = formData.services
        .filter(
          (service) =>
            service.service_name.trim() &&
            service.service_name !== "Sample Service" &&
            service.service_name !== "Unnamed Service" &&
            service.quantity > 0 &&
            service.price > 0
        )
        .map((service) => ({
          service: service.service_name,
          price: parseFloat(service.price),
          qty: parseInt(service.quantity),
        }));

      const payload = {
        lead_id: formData.lead_id,
        due_date: formData.due_date,
        items,
        team_id: formData.team.value,
        merchant_details: formData.merchant_details,
        transaction_status: formData.transaction_status.value,
      };

      // Only include merchant_id if user has permission
      if (hasUpdateMerchantPermission && formData.merchant) {
        payload.merchant_id = formData.merchant.value;
      }

      // Only include paid-related fields if status is paid
      if (isPaid) {
        if (formData.user_comment.trim()) {
          payload.user_comment = formData.user_comment;
        }
        if (formData.paid_at) {
          payload.paid_at = formData.paid_at;
        }
        if (formData.proof_of_payment) {
          payload.proof_of_payment = formData.proof_of_payment;
        }
      }

      // Only include created_by
      if (hasAssignPermission && formData.assigned_user) {
        payload.created_by = formData.assigned_user.value;
      }

      await apiAxios.post(ApiRequest.externalPayments.update(id), payload);

      toast.success("External payment updated successfully!");
      navigate("/external-payments");
    } catch (error) {
      console.error("Error updating external payment:", error);

      if (error.response?.data?.errors) {
        const apiErrors = {};
        Object.entries(error.response.data.errors).forEach(
          ([key, messages]) => {
            apiErrors[key] = messages[0];
            toast.error(`${key}: ${messages[0]}`);
          }
        );
        setErrors(apiErrors);
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update external payment"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full size-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">
            Loading external payment...
          </p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-transparent border-b border-gray-200 dark:border-slate-700/60 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/external-payments")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-slate-800/70 dark:text-slate-200"
              >
                <BsArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">
                  Edit External Payment - {formData.invoice_number}
                </h1>
                <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                  Update external payment details with live preview
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/external-payments")}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-slate-200 dark:hover:bg-slate-800/70"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Updating..." : "Update External Payment"}
              </button>
            </div>
          </div>

          {/* Location Info Bar */}
          {(formData.lead_data.city ||
            formData.lead_data.region ||
            formData.lead_data.country ||
            formData.lead_data.ip) && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-slate-300">
              {formData.lead_data.city && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-500">
                    City
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-slate-100">
                    {formData.lead_data.city}
                  </p>
                </div>
              )}
              {formData.lead_data.region && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-500">
                    Region
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-slate-100">
                    {formData.lead_data.region}
                  </p>
                </div>
              )}
              {formData.lead_data.country && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-500">
                    Country
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-slate-100">
                    {formData.lead_data.country}
                  </p>
                </div>
              )}
              {formData.lead_data.ip && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-500">
                    IP
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-slate-100">
                    {formData.lead_data.ip}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Agent & Team Selection */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Agent & Team Details
              </h2>
              <div className="space-y-4">
                {hasAssignPermission && (
                  <div>
                    <FiltersComponent
                      selectedUser={formData.assigned_user}
                      onFilterChange={handleFilterChange}
                      showUsers={true}
                      isUserSearchable={true}
                      userLabel="Select Agent"
                      showUnits={false}
                      showBrands={false}
                      showMerchants={false}
                      showPaymentStatus={false}
                      showTeams={false}
                      showRoles={false}
                      showPermissions={false}
                      showLeads={false}
                      showLeadEmail={false}
                      showDateRange={false}
                      showPaymentDateRange={false}
                    />
                    <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                      Type name or email to search agents
                    </p>
                  </div>
                )}

                <div>
                  <label>
                    Select Team <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={
                      hasAssignPermission && formData.assigned_user
                        ? userTeams
                        : teams
                    }
                    value={formData.team}
                    onChange={(option) => handleChange("team", option)}
                    placeholder={
                      hasAssignPermission && !formData.assigned_user
                        ? "Please select an agent first"
                        : "Search and select team"
                    }
                    isLoading={loadingUserTeams}
                    isDisabled={hasAssignPermission && !formData.assigned_user}
                    isSearchable
                    styles={selectStyles}
                    menuPortalTarget={menuPortalTarget}
                    classNamePrefix="tm-select"
                  />
                  {errors.team && (
                    <p className="text-xs text-red-500 mt-1">{errors.team}</p>
                  )}
                  {hasAssignPermission && formData.assigned_user && (
                    <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                      Showing teams for selected agent
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information (Read-only) */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label>Customer Name</label>
                  <input
                    type="text"
                    className="form-control bg-gray-50 dark:bg-slate-800/60"
                    placeholder="Customer Name"
                    value={formData.lead_data.name}
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1 dark:text-slate-500">
                    Auto-filled from lead data
                  </p>
                </div>

                <div>
                  <label>Customer Email</label>
                  <input
                    type="text"
                    className="form-control bg-gray-50 dark:bg-slate-800/60"
                    placeholder="Customer Email"
                    value={formData.lead_data.email}
                    readOnly
                  />
                </div>

                <div>
                  <label>Customer Phone</label>
                  <input
                    type="text"
                    className="form-control bg-gray-50 dark:bg-slate-800/60"
                    placeholder="Customer Phone"
                    value={formData.lead_data.phone}
                    readOnly
                  />
                </div>

                <div>
                  <label>Customer Brand</label>
                  <input
                    type="text"
                    className="form-control bg-gray-50 dark:bg-slate-800/60"
                    placeholder="Customer Brand"
                    value={formData.lead_data.brand}
                    readOnly
                  />
                </div>

                {/* Merchant Selection - Only if user has permission */}
                {hasUpdateMerchantPermission && (
                  <div>
                    <FiltersComponent
                      selectedMerchant={formData.merchant}
                      onFilterChange={handleFilterChange}
                      showMerchants={true}
                      isMerchantSearchable={true}
                      merchantLabel={
                        <>
                          Select Merchant{" "}
                          <span className="text-red-500">*</span>
                        </>
                      }
                      showUnits={false}
                      showBrands={false}
                      showPaymentStatus={false}
                      showTeams={false}
                      showUsers={false}
                      showRoles={false}
                      showPermissions={false}
                      showLeads={false}
                      showLeadEmail={false}
                      showDateRange={false}
                      showPaymentDateRange={false}
                    />
                    {errors.merchant && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.merchant}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                      Select from external merchants (Bank wire, CashApp,
                      Crypto, etc.)
                    </p>
                  </div>
                )}

                {!hasUpdateMerchantPermission && (
                  <div>
                    <label>Merchant</label>
                    <input
                      type="text"
                      className="form-control bg-gray-50 dark:bg-slate-800/60"
                      value={formData.merchant?.label || "No Merchant Selected"}
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1 dark:text-slate-500">
                      You don't have permission to change merchant
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Merchant & Payment Details */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Merchant & Payment Details
              </h2>
              <div className="space-y-4">
                {/* Merchant Details */}
                <div>
                  <label>
                    Merchant Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`form-control transition-colors ${
                      errors.merchant_details
                        ? "border-red-500 dark:border-red-500/80"
                        : ""
                    }`}
                    placeholder="e.g., Payment via bank transfer to account ending in 1234"
                    value={
                      formData.merchant_details ===
                      "No merchant details provided"
                        ? ""
                        : formData.merchant_details
                    }
                    onChange={(e) =>
                      handleChange("merchant_details", e.target.value)
                    }
                    rows={3}
                  />
                  {errors.merchant_details && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.merchant_details}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                    Provide payment method and account details
                  </p>
                </div>

                {/* Transaction Status */}
                <div>
                  <label>
                    Transaction Status <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={transactionStatusOptions}
                    value={formData.transaction_status}
                    onChange={(option) =>
                      handleChange("transaction_status", option)
                    }
                    styles={selectStyles}
                    menuPortalTarget={menuPortalTarget}
                    classNamePrefix="tm-select"
                  />
                  <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                    Select payment status
                  </p>
                </div>

                {/* User Comment - Only show if status is paid */}
                {isPaid && (
                  <div>
                    <label>
                      User Comment <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`form-control transition-colors ${
                        errors.user_comment
                          ? "border-red-500 dark:border-red-500/80"
                          : ""
                      }`}
                      placeholder="e.g., Payment received via bank transfer"
                      value={formData.user_comment}
                      onChange={(e) =>
                        handleChange("user_comment", e.target.value)
                      }
                      rows={2}
                    />
                    {errors.user_comment && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.user_comment}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                      Required when status is paid
                    </p>
                  </div>
                )}

                {/* Paid At - Only show if status is paid */}
                {isPaid && (
                  <div>
                    <label>
                      Payment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control transition-colors ${
                        errors.paid_at
                          ? "border-red-500 dark:border-red-500/80"
                          : ""
                      }`}
                      value={formData.paid_at}
                      onChange={(e) => handleChange("paid_at", e.target.value)}
                    />
                    {errors.paid_at && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.paid_at}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                      Required when status is paid
                    </p>
                  </div>
                )}

                {/* Proof of Payment - Only show if status is paid */}
                {isPaid && (
                  <div>
                    <label>
                      Proof of Payment
                      {merchantRequiresProof && (
                        <span className="text-red-500"> *</span>
                      )}
                    </label>
                    <div className="space-y-2">
                      {/* File Upload */}
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="proof-upload"
                          className="flex-1 cursor-pointer"
                        >
                          <div
                            className={`form-control flex items-center justify-between transition-colors ${
                              errors.proof_of_payment
                                ? "border-red-500 dark:border-red-500/80"
                                : ""
                            }`}
                          >
                            <span className="text-gray-500 dark:text-slate-400">
                              {uploadingProof
                                ? "Uploading..."
                                : formData.proof_of_payment
                                ? "File uploaded"
                                : "Click to upload proof"}
                            </span>
                            <BsUpload className="text-gray-400" />
                          </div>
                        </label>
                        <input
                          id="proof-upload"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleProofUpload}
                          className="hidden"
                          disabled={uploadingProof}
                        />
                      </div>

                      {/* Or URL Input */}
                      <div className="text-center text-xs text-gray-500 dark:text-slate-400">
                        OR
                      </div>
                      <input
                        type="url"
                        className={`form-control transition-colors ${
                          errors.proof_of_payment
                            ? "border-red-500 dark:border-red-500/80"
                            : ""
                        }`}
                        placeholder="https://example.com/proof.pdf"
                        value={formData.proof_of_payment}
                        onChange={(e) =>
                          handleChange("proof_of_payment", e.target.value)
                        }
                        disabled={uploadingProof}
                      />
                      {errors.proof_of_payment && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.proof_of_payment}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                        {merchantRequiresProof
                          ? "Required for this merchant - Images or PDF, max 5MB"
                          : "Optional - Images or PDF, max 5MB"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Services
                </h2>
                <button
                  type="button"
                  onClick={addService}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 dark:text-blue-300 dark:hover:text-blue-200"
                >
                  <BsPlus size={18} />
                  ADD NEW
                </button>
              </div>

              {errors.services && (
                <p className="text-xs text-red-500 mb-3">{errors.services}</p>
              )}

              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 dark:border-slate-700/60 dark:bg-slate-900/60"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <label>Service {index + 1}</label>
                      {formData.services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
                        >
                          <BsTrash size={16} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Service Name"
                        value={
                          service.service_name === "Sample Service" ||
                          service.service_name === "Unnamed Service"
                            ? ""
                            : service.service_name
                        }
                        onChange={(e) =>
                          handleServiceChange(
                            index,
                            "service_name",
                            e.target.value
                          )
                        }
                      />

                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Quantity"
                          min="1"
                          value={service.quantity}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              "quantity",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Price"
                          step="0.01"
                          min="0"
                          value={service.price}
                          onChange={(e) =>
                            handleServiceChange(index, "price", e.target.value)
                          }
                        />
                        <input
                          type="text"
                          className="form-control bg-gray-50 dark:bg-slate-800/60 dark:text-slate-200"
                          placeholder="Amount"
                          value={service.amount}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Additional Details
              </h2>
              <div>
                <label>
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control transition-colors ${
                    errors.due_date
                      ? "border-red-500 dark:border-red-500/80"
                      : ""
                  }`}
                  value={formData.due_date}
                  onChange={(e) => handleChange("due_date", e.target.value)}
                />
                {errors.due_date && (
                  <p className="text-xs text-red-500 mt-1">{errors.due_date}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 dark:bg-slate-900/70 dark:border-slate-700/60">
              <div className="text-center border-b border-gray-200 pb-4 mb-6 dark:border-slate-700/60">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                  EXTERNAL PAYMENT
                </h2>
                <p className="text-sm text-gray-600 mt-2 dark:text-slate-400">
                  {formData.lead_data.brand || "Brand Name"}
                </p>
                <p className="text-xs text-gray-500 mt-1 dark:text-slate-500">
                  {formData.invoice_number}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2 dark:text-slate-400">
                    Bill To:
                  </h3>
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                    {formData.lead_data.name || "Customer Name"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {formData.lead_data.email || "customer@email.com"}
                  </p>
                  {formData.lead_data.phone &&
                    formData.lead_data.phone !== "No phone" && (
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {formData.lead_data.phone}
                      </p>
                    )}
                </div>

                <div className="text-right">
                  <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2 dark:text-slate-400">
                    Details:
                  </h3>
                  {hasAssignPermission && formData.assigned_user && (
                    <p className="text-sm text-gray-900 dark:text-slate-100">
                      <span className="font-medium">Agent:</span>{" "}
                      {formData.assigned_user?.label || "Not Selected"}
                    </p>
                  )}
                  <p className="text-sm text-gray-900 dark:text-slate-100">
                    <span className="font-medium">Team:</span>{" "}
                    {formData.team?.label || "Not Selected"}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-slate-100">
                    <span className="font-medium">Merchant:</span>{" "}
                    {formData.merchant?.label || "Not Selected"}
                  </p>
                  {formData.due_date && (
                    <p className="text-sm text-gray-900 mt-2 dark:text-slate-100">
                      <span className="font-medium">Due:</span>{" "}
                      {new Date(formData.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Merchant Details in Preview */}
              {formData.merchant_details &&
                formData.merchant_details !==
                  "No merchant details provided" && (
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg dark:bg-slate-800/60">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2 dark:text-slate-400">
                      Payment Details:
                    </h3>
                    <p className="text-sm text-gray-900 dark:text-slate-100">
                      {formData.merchant_details}
                    </p>
                  </div>
                )}

              {/* Payment Comment in Preview (if paid) */}
              {isPaid && formData.user_comment && (
                <div className="mb-6 p-3 bg-green-50 rounded-lg dark:bg-green-500/10">
                  <h3 className="text-xs font-semibold text-green-700 uppercase mb-2 dark:text-green-300">
                    Payment Comment:
                  </h3>
                  <p className="text-sm text-gray-900 dark:text-slate-100">
                    {formData.user_comment}
                  </p>
                  {formData.paid_at && (
                    <p className="text-xs text-gray-600 mt-1 dark:text-slate-400">
                      Paid on: {new Date(formData.paid_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              <div className="border-t border-b border-gray-200 py-4 mb-4 dark:border-slate-700/60">
                <table className="w-full text-sm text-gray-900 dark:text-slate-100">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700/60">
                      <th className="text-left py-2 font-semibold text-gray-700 dark:text-slate-300">
                        Service
                      </th>
                      <th className="text-center py-2 font-semibold text-gray-700 dark:text-slate-300">
                        Qty
                      </th>
                      <th className="text-right py-2 font-semibold text-gray-700 dark:text-slate-300">
                        Price
                      </th>
                      <th className="text-right py-2 font-semibold text-gray-700 dark:text-slate-300">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.services.map((service, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 dark:border-slate-800"
                      >
                        <td className="py-2 text-gray-900 dark:text-slate-100">
                          {service.service_name === "Sample Service" ||
                          service.service_name === "Unnamed Service" ||
                          !service.service_name
                            ? `Service ${index + 1}`
                            : service.service_name}
                        </td>
                        <td className="py-2 text-center text-gray-900 dark:text-slate-100">
                          {service.quantity}
                        </td>
                        <td className="py-2 text-right text-gray-900 dark:text-slate-100">
                          $ {parseFloat(service.price || 0).toFixed(2)}
                        </td>
                        <td className="py-2 text-right font-medium text-gray-900 dark:text-slate-100">
                          $ {parseFloat(service.amount || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 ml-auto w-64">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-slate-400">
                    Subtotal:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    $ {parseFloat(formData.subtotal || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 dark:border-slate-700/60">
                  <span className="text-gray-900 dark:text-slate-100">
                    Total:
                  </span>
                  <span className="text-gray-900 dark:text-slate-100">
                    $ {parseFloat(formData.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 text-center dark:border-slate-700/60">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    formData.transaction_status?.value === "paid"
                      ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-200"
                  }`}
                >
                  {formData.transaction_status?.label || "Unpaid"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditExternalPaymentPage;
