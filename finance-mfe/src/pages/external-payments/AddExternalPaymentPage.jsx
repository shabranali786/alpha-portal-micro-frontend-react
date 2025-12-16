import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useSelectStyles } from "@crm/shared/hooks/useSelectStyles";
import { FiltersComponent } from "@crm/shared/components/AllComponents";
import toast from "react-hot-toast";
import { BsArrowLeft, BsPlus, BsTrash, BsUpload } from "react-icons/bs";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { usePermission } from "@crm/shared/utils/permissions";

const AddExternalPaymentPage = () => {
  const canCreateExternalPayment = usePermission([
    "invoice.otherPayments.create",
  ]);
  const navigate = useNavigate();
  const location = useLocation();
  const leadFromLocation = location.state?.leadData;

  useEffect(() => {
    if (!canCreateExternalPayment) {
      toast.error("You don't have permission to create external payments");
      navigate("/external-payments");
    }
  }, [canCreateExternalPayment, navigate]);
  const hasPrefilledLead = useRef(false);

  const userData = useSelector((state) => state.auth.user);

  const isSuperAdmin = useMemo(() => {
    return userData?.roles?.includes("superadmin");
  }, [userData]);

  const hasAssignPermission = useMemo(() => {
    if (isSuperAdmin) return true;
    return userData?.permissions?.includes("user.index") || false;
  }, [userData, isSuperAdmin]);

  const [formData, setFormData] = useState({
    selected_lead: null,
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_brand: "",
    customer_address: "",
    customer_city: "",
    customer_region: "",
    customer_country: "",
    customer_ip: "",
    assigned_user: null,
    team: null,
    merchant: null,
    merchant_details: "",
    transaction_status: { value: "unpaid", label: "Unpaid" },
    user_comment: "",
    proof_of_payment: "",
    paid_at: "",
    services: [{ service_name: "", quantity: 1, price: 0, amount: 0 }],
    subtotal: 0,
    total: 0,
    due_date: "",
    logo_option: { value: "brand_logo", label: "Show Brand Logo" },
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [uploadingProof, setUploadingProof] = useState(false);

  const [teams, setTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loadingUserTeams, setLoadingUserTeams] = useState(false);

  const selectStyles = useSelectStyles();
  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;

  const transactionStatusOptions = [
    { value: "unpaid", label: "Unpaid" },
    { value: "paid", label: "Paid" },
  ];

  const logoOptions = [
    { value: "brand_logo", label: "Show Brand Logo" },
    { value: "company_logo", label: "Show Company Logo" },
    { value: "no_logo", label: "No Logo" },
  ];

  const isPaid = formData.transaction_status?.value === "paid";

  const merchantRequiresProof = formData.merchant?.proof_required === true;

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
        if (!selectedOption?.proof_required) {
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
      const teamOptions = teamsData.map((team) => ({
        value: team.id,
        label: team.title || team.name,
      }));
      setTeams(teamOptions);
    } catch (error) {
      console.error("Error fetching teams:", error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load teams");
      }
    }
  }, []);

  const fetchLeads = useCallback(async (emailSearch = "") => {
    // console.log({ "search email": emailSearch });
    try {
      const response = await apiAxios.get(
        `${ApiRequest.leads.list}?per_page=20&email=${emailSearch}`
      );

      const leadsData = response.data?.data || [];
      const leadOptions = leadsData.map((lead) => ({
        value: lead.id,
        label: `${lead.email} - ${lead.name}`,
        email: lead.email,
        phone: lead.phone,
        name: lead.name,
        brand: lead.brand,
        city: lead.city,
        region: lead.region,
        country: lead.country,
        ip: lead.ip,
        transaction_amount: lead.transaction_amount,
      }));
      setLeads(leadOptions);
    } catch (error) {
      console.error("Error fetching leads:", error);
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load leads");
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

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      try {
        await fetchTeams();
      } catch (error) {
        console.error("Error loading data:", error);
        if (error.response?.status === 403 || error.response?.status === 401) {
          toast.error(
            "You don't have permission to access some resources. Please contact admin."
          );
        }
      } finally {
        setDataLoading(false);
      }
    };

    loadData();

    return () => {
      if (window.leadSearchTimeout) {
        clearTimeout(window.leadSearchTimeout);
      }
    };
  }, [fetchTeams]);

  useEffect(() => {
    const subtotal = formData.services.reduce(
      (sum, service) => sum + (parseFloat(service.amount) || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      subtotal: subtotal.toFixed(2),
      total: subtotal.toFixed(2),
    }));
  }, [formData.services]);

  useEffect(() => {
    if (hasAssignPermission && formData.assigned_user) {
      setFormData((prev) => ({ ...prev, team: null }));
      loadUserTeams(formData.assigned_user);
    } else {
      setUserTeams([]);
    }
  }, [formData.assigned_user, hasAssignPermission, loadUserTeams]);

  useEffect(() => {
    if (leadFromLocation && !hasPrefilledLead.current) {
      const amount = Number(leadFromLocation.transaction_amount) || 0;
      const serviceName = leadFromLocation.brand?.title || "Service";

      const addressParts = [
        leadFromLocation.city,
        leadFromLocation.region,
        leadFromLocation.country,
      ].filter(Boolean);

      setFormData((prev) => ({
        ...prev,
        selected_lead: {
          value: leadFromLocation.id,
          label: leadFromLocation.email,
          email: leadFromLocation.email,
          phone: leadFromLocation.phone,
          brand: leadFromLocation.brand?.title,
        },
        customer_name: leadFromLocation.name,
        customer_email: leadFromLocation.email,
        customer_phone: leadFromLocation.phone,
        customer_brand: leadFromLocation.brand?.title,
        customer_address: addressParts.join(", "),
        customer_city: leadFromLocation.city,
        customer_region: leadFromLocation.region,
        customer_country: leadFromLocation.country,
        customer_ip: leadFromLocation.ip,
        services: [
          {
            service_name: serviceName,
            quantity: 1,
            price: amount,
            amount: amount.toFixed(2),
          },
        ],
        notes: leadFromLocation.notes || "",
      }));

      hasPrefilledLead.current = true;
    }
  }, [leadFromLocation]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLeadSelect = (selectedLead) => {
    if (!selectedLead) {
      setFormData((prev) => ({
        ...prev,
        selected_lead: null,
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_brand: "",
        customer_address: "",
        customer_city: "",
        customer_region: "",
        customer_country: "",
        customer_ip: "",
      }));
      return;
    }

    const addressParts = [
      selectedLead.city,
      selectedLead.region,
      selectedLead.country,
    ].filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      selected_lead: selectedLead,
      customer_name: selectedLead.name,
      customer_email: selectedLead.email,
      customer_phone: selectedLead.phone,
      customer_brand: selectedLead.brand?.title || selectedLead.brand,
      customer_address: addressParts.join(", "),
      customer_city: selectedLead.city,
      customer_region: selectedLead.region,
      customer_country: selectedLead.country,
      customer_ip: selectedLead.ip,
    }));
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
        { service_name: "", quantity: 1, price: 0, amount: 0 },
      ],
    }));
  };

  const removeService = (index) => {
    if (formData.services.length > 1) {
      setFormData((prev) => ({
        ...prev,
        services: prev.services.filter((_, i) => i !== index),
      }));
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

    if (!formData.selected_lead) {
      newErrors.selected_lead = "Please select a lead";
    }

    if (!formData.customer_name.trim()) {
      newErrors.customer_name = "Customer name is required";
    }

    if (!formData.team) {
      newErrors.team = "Team is required";
    }

    if (!formData.merchant) {
      newErrors.merchant = "Merchant is required";
    }

    if (!formData.merchant_details.trim()) {
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
        service.service_name.trim() && service.quantity > 0 && service.price > 0
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
            service.quantity > 0 &&
            service.price > 0
        )
        .map((service) => ({
          service: service.service_name,
          price: parseFloat(service.price),
          qty: parseInt(service.quantity),
        }));

      const payload = {
        lead_id: formData.selected_lead.value,
        due_date: formData.due_date,
        items,
        team_id: formData.team.value,
        merchant_id: formData.merchant.value,
        merchant_details: formData.merchant_details,
        transaction_status: formData.transaction_status.value,
      };

      if (isPaid && formData.user_comment.trim()) {
        payload.user_comment = formData.user_comment;
      }

      if (isPaid && formData.paid_at) {
        payload.paid_at = formData.paid_at;
      }

      if (isPaid && formData.proof_of_payment) {
        payload.proof_of_payment = formData.proof_of_payment;
      }

      if (hasAssignPermission && formData.assigned_user) {
        payload.created_by = formData.assigned_user.value;
      }

      // console.log("📤 External Payment Payload:", payload);

      await apiAxios.post(ApiRequest.externalPayments.create, payload);

      toast.success("External Payment created successfully!");
      navigate("/external-payments");
    } catch (error) {
      console.error("Error creating external payment:", error);

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
          error.response?.data?.message || "Failed to create external payment"
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className="text-2xl font-bold">Add External Payment</h1>
                <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                  Create a new external payment with live preview
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
                {loading ? "Creating..." : "Create External Payment"}
              </button>
            </div>
          </div>

          {/* Location Info Bar */}
          {(formData.customer_city ||
            formData.customer_region ||
            formData.customer_country ||
            formData.customer_ip) && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-slate-300">
              {formData.customer_city && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-500">
                    City
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-slate-100">
                    {formData.customer_city}
                  </p>
                </div>
              )}
              {formData.customer_region && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-500">
                    Region
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-slate-100">
                    {formData.customer_region}
                  </p>
                </div>
              )}
              {formData.customer_country && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-500">
                    Country
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-slate-100">
                    {formData.customer_country}
                  </p>
                </div>
              )}
              {formData.customer_ip && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-500">
                    IP
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-slate-100">
                    {formData.customer_ip}
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
            {/* Lead Search */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Search Customer via Email
              </h2>
              <Select
                options={leads}
                value={formData.selected_lead}
                onChange={handleLeadSelect}
                onInputChange={(inputValue, { action }) => {
                  if (action === "input-change" && inputValue.length >= 3) {
                    clearTimeout(window.leadSearchTimeout);
                    window.leadSearchTimeout = setTimeout(() => {
                      fetchLeads(inputValue);
                    }, 500);
                  }
                }}
                isClearable
                isLoading={dataLoading}
                placeholder="Type email to search (min 3 characters)"
                noOptionsMessage={({ inputValue }) =>
                  inputValue.length < 3
                    ? "Type at least 3 characters to search"
                    : "No leads found"
                }
                styles={selectStyles}
                menuPortalTarget={menuPortalTarget}
                classNamePrefix="tm-select"
              />
              {errors.selected_lead && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.selected_lead}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                Search by email: e.g., shabranalpha@gmail.com
              </p>
            </div>

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
                      // Hide all other filters
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
                    isLoading={dataLoading || loadingUserTeams}
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

            {/* Customer Information */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label>
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control transition-colors bg-gray-50 dark:bg-slate-800/60 ${
                      errors.customer_name
                        ? "border-red-500 dark:border-red-500/80"
                        : ""
                    }`}
                    placeholder="Customer Name"
                    value={formData.customer_name}
                    readOnly
                  />
                  {errors.customer_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.customer_name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1 dark:text-slate-500">
                    Auto-filled from selected lead
                  </p>
                </div>

                <div>
                  <label>Customer Phone</label>
                  <input
                    type="text"
                    className="form-control bg-gray-50 dark:bg-slate-800/60"
                    placeholder="Customer Phone"
                    value={formData.customer_phone}
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1 dark:text-slate-500">
                    Auto-filled from selected lead
                  </p>
                </div>

                <div>
                  <label>Customer Brand</label>
                  <input
                    type="text"
                    className="form-control bg-gray-50 dark:bg-slate-800/60"
                    placeholder="Customer Brand"
                    value={formData.customer_brand}
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1 dark:text-slate-500">
                    Auto-filled from selected lead
                  </p>
                </div>

                {/* NOW MERCHANT IS SELECTABLE - NOT AUTO-FILLED */}
                <div>
                  <FiltersComponent
                    selectedMerchant={formData.merchant}
                    onFilterChange={handleFilterChange}
                    showMerchants={true}
                    isMerchantSearchable={true}
                    merchantLabel={
                      <>
                        Select Merchant <span className="text-red-500">*</span>
                      </>
                    }
                    // Hide all other filters
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
                    Select from external merchants (Bank wire, CashApp, Crypto,
                    etc.)
                  </p>
                  {/* {formData.merchant && (
                    <p className="text-xs text-blue-600 mt-1 dark:text-blue-400">
                      {merchantRequiresProof
                        ? "⚠️ This merchant requires proof of payment"
                        : "✓ No proof required for this merchant"}
                    </p>
                  )} */}
                </div>
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
                    value={formData.merchant_details}
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
                    <label>Proof of Payment</label>
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
                        Upload file or paste URL (Optional - Images or PDF, max
                        5MB)
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
                  Add Services
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
                        value={service.service_name}
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
              <div className="grid grid-cols-2 gap-4">
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
                    <p className="text-xs text-red-500 mt-1">
                      {errors.due_date}
                    </p>
                  )}
                </div>

                <div>
                  <label>Logo Option</label>
                  <Select
                    options={logoOptions}
                    value={formData.logo_option}
                    onChange={(option) => handleChange("logo_option", option)}
                    styles={selectStyles}
                    menuPortalTarget={menuPortalTarget}
                    classNamePrefix="tm-select"
                  />
                </div>
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
                  {formData.customer_brand || "Brand Name"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2 dark:text-slate-400">
                    Bill To:
                  </h3>
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                    {formData.customer_name || "Customer Name"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    {formData.customer_email || "customer@email.com"}
                  </p>
                  {formData.customer_phone && (
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {formData.customer_phone}
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
              {formData.merchant_details && (
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
                          {service.service_name || `Service ${index + 1}`}
                        </td>
                        <td className="py-2 text-center text-gray-900 dark:text-slate-100">
                          {service.quantity}
                        </td>
                        <td className="py-2 text-right text-gray-900 dark:text-slate-100">
                          {parseFloat(service.price || 0).toFixed(2)}
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
                    formData.transaction_status.value === "paid"
                      ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-200"
                  }`}
                >
                  {formData.transaction_status.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExternalPaymentPage;
