import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useSelectStyles } from "@crm/shared/hooks/useSelectStyles";
import { FiltersComponent } from "@crm/shared/components/AllComponents";
import toast from "react-hot-toast";
import { BsArrowLeft, BsPlus, BsTrash } from "react-icons/bs";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";

const EditInvoicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loadingUserTeams, setLoadingUserTeams] = useState(false);
  const initialTeamsFetched = useRef(false);
  const initialAgentId = useRef(null);

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
      toast.error("Failed to load teams");
    }
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
      const response = await apiAxios.get(ApiRequest.invoices.show(id));
      const invoice = response.data?.data || response.data;

      let assignedUserData = null;
      if (invoice.created_by && hasAssignPermission) {
        if (typeof invoice.created_by === "object" && invoice.created_by.name) {
          assignedUserData = {
            value: invoice.created_by.id,
            label: invoice.created_by.name,
            email: invoice.created_by.email,
            teams: invoice.created_by.teams || [],
          };
        } else {
          const createdById =
            typeof invoice.created_by === "object"
              ? invoice.created_by.id
              : invoice.created_by;

          if (createdById) {
            try {
              const userResponse = await apiAxios.get(
                ApiRequest.users.show(createdById)
              );
              const userData = userResponse.data?.data || userResponse.data;
              assignedUserData = {
                value: userData.id,
                label: userData.name,
                email: userData.email,
                teams: userData.teams || [],
              };
            } catch (userError) {
              console.error("Error fetching user details:", userError);
            }
          }
        }
      }

      if (assignedUserData) {
        initialAgentId.current = assignedUserData.value;
      }

      const mappedData = {
        invoice_number: invoice.invoice_number || invoice.invoice_no || "",
        lead_id: invoice.lead?.id || null,
        assigned_user: assignedUserData,
        team: invoice.team
          ? {
              value: invoice.team.id,
              label: invoice.team.title || invoice.team.name,
            }
          : null,
        merchant: invoice.merchant
          ? {
              value: invoice.merchant.id,
              label: invoice.merchant.title || invoice.merchant.name,
            }
          : null,
        lead_data: {
          name: invoice.lead?.name || "",
          email: invoice.lead?.email || "",
          phone: invoice.lead?.phone || "",
          brand: invoice?.brand?.title || "",
        },
        due_date: invoice.due_date?.split(" ")[0] || "",
        services: invoice.invoice_items?.map((item) => ({
          service_name: item.service || item.service_name || "",
          quantity: item.qty || item.quantity || 1,
          price: item.price || 0,
          amount: (
            (item.qty || item.quantity || 1) * (item.price || 0)
          ).toFixed(2),
        })) || [{ service_name: "", quantity: 1, price: 0, amount: 0 }],
        discount: invoice.discount || 0,
        tax: invoice.tax || 0,
        subtotal: 0,
        total: 0,
      };

      setFormData(mappedData);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to load invoice");
      navigate("/invoices");
    }
  }, [id, navigate, hasAssignPermission]);

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

  useEffect(() => {
    if (
      !pageLoading &&
      formData &&
      hasAssignPermission &&
      formData.assigned_user &&
      !initialTeamsFetched.current
    ) {
      fetchUserTeams(formData.assigned_user.value);
      initialTeamsFetched.current = true;
    }
  }, [formData, hasAssignPermission, pageLoading, fetchUserTeams]);

  useEffect(() => {
    if (
      !pageLoading &&
      formData &&
      initialTeamsFetched.current &&
      hasAssignPermission &&
      formData.assigned_user
    ) {
      const currentAgentId = formData.assigned_user.value;
      if (currentAgentId !== initialAgentId.current) {
        setFormData((prev) => ({ ...prev, team: null }));
        fetchUserTeams(currentAgentId);
      }
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
    const discount = parseFloat(formData.discount) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const total = subtotal - discount + tax;
    const nextSubtotal = subtotal.toFixed(2);
    const nextTotal = total.toFixed(2);

    if (formData.subtotal !== nextSubtotal || formData.total !== nextTotal) {
      setFormData((prev) => ({
        ...prev,
        subtotal: nextSubtotal,
        total: nextTotal,
      }));
    }
  }, [formData]);

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
        { service_name: "", quantity: 1, price: 0, amount: 0 },
      ],
    }));
  };

  const removeService = (index) => {
    if (formData.services.length > 1) {
      const newServices = formData.services.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, services: newServices }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (hasAssignPermission && !formData.assigned_user) {
      newErrors.assigned_user = "Agent is required";
    }

    if (!formData.team) {
      newErrors.team = "Team is required";
    }

    if (hasUpdateMerchantPermission && !formData.merchant) {
      newErrors.merchant = "Merchant is required";
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
        .filter((s) => s.service_name.trim() && s.quantity > 0 && s.price > 0)
        .map((s) => ({
          service: s.service_name,
          price: parseFloat(s.price),
          qty: parseInt(s.quantity),
        }));

      const payload = {
        lead_id: formData.lead_id,
        due_date: formData.due_date,
        items,
        team_id: formData.team.value,
      };

      // Only include merchant_id if user has permission
      if (hasUpdateMerchantPermission && formData.merchant) {
        payload.merchant_id = formData.merchant.value;
      }

      if (hasAssignPermission && formData.assigned_user) {
        payload.created_by = formData.assigned_user.value;
      }

      if (parseFloat(formData.discount) > 0) {
        payload.discount = parseFloat(formData.discount);
      }
      if (parseFloat(formData.tax) > 0) {
        payload.tax = parseFloat(formData.tax);
      }

      await apiAxios.post(ApiRequest.invoices.update(id), payload);
      toast.success("Invoice updated successfully!");
      navigate("/invoices");
    } catch (error) {
      console.error("Error updating invoice:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update invoice";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center transition-colors duration-300 dark:bg-[var(--color-body)]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full size-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">
            Loading invoice...
          </p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-[var(--color-body)]">
      <div className="bg-transparent border-b border-gray-200 dark:border-slate-700/60 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/invoices")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-slate-800/70 dark:text-slate-200"
              >
                <BsArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Edit Invoice</h1>
                <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                  Update invoice details with live preview
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/invoices")}
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
                {loading ? "Updating..." : "Update Invoice"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Assignment & Team Details
              </h2>
              <div className="space-y-4">
                {hasAssignPermission && (
                  <div>
                    <FiltersComponent
                      selectedUser={formData.assigned_user}
                      onFilterChange={handleFilterChange}
                      showUsers={true}
                      isUserSearchable={true}
                      userLabel={
                        <>
                          Select Agent <span className="text-red-500">*</span>
                        </>
                      }
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
                    <p className="text-xs text-gray-500 mt-1 dark:text-slate-500">
                      Type name or email to search agents
                    </p>
                    {errors.assigned_user && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.assigned_user}
                      </p>
                    )}
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
                    <p className="text-xs text-gray-500 mt-1 dark:text-slate-500">
                      Showing teams for selected agent
                    </p>
                  )}
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
                  </div>
                )}

                {/* Readonly Merchant Display for Non-Permitted Users */}
                {!hasUpdateMerchantPermission && (
                  <div>
                    <label>Merchant</label>
                    <input
                      type="text"
                      className="form-control bg-gray-50 dark:bg-slate-800/60"
                      value={formData.merchant?.label || "No Merchant Selected"}
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                      You don't have permission to update merchant
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Customer Information
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Name:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    {formData.lead_data.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Email:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    {formData.lead_data.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Phone:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    {formData.lead_data.phone || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-slate-400">
                    Brand:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    {formData.lead_data.brand || "N/A"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 dark:text-slate-500">
                Customer information cannot be edited
              </p>
            </div>

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
                  <BsPlus size={18} /> ADD NEW
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
                      <label className="font-medium">Service {index + 1}</label>
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
                        <div>
                          <label className="text-xs text-gray-600 dark:text-slate-400">
                            Qty
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="1"
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
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 dark:text-slate-400">
                            Price
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            value={service.price}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 dark:text-slate-400">
                            Amount
                          </label>
                          <input
                            type="text"
                            className="form-control bg-gray-50 dark:bg-slate-800/60 dark:text-slate-200"
                            placeholder="0.00"
                            value={service.amount}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">
                Additional Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
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
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 dark:bg-slate-900/70 dark:border-slate-700/60">
              <div className="text-center border-b border-gray-200 pb-4 mb-6 dark:border-slate-700/60">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                  INVOICE
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
                  {formData.lead_data.phone && (
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
                      {formData.assigned_user.label}
                    </p>
                  )}
                  <p className="text-sm text-gray-900 dark:text-slate-100">
                    <span className="font-medium">Team:</span>{" "}
                    {formData.team?.label || "N/A"}
                  </p>
                  <p className="text-sm text-gray-900 mt-2 dark:text-slate-100">
                    <span className="font-medium">Due:</span>{" "}
                    {formData.due_date
                      ? new Date(formData.due_date).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

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
                {parseFloat(formData.discount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">
                      Discount:
                    </span>
                    <span className="text-red-600 dark:text-red-300">
                      - $ {parseFloat(formData.discount).toFixed(2)}
                    </span>
                  </div>
                )}
                {parseFloat(formData.tax) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-slate-400">
                      Tax:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-slate-100">
                      $ {parseFloat(formData.tax).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 dark:border-slate-700/60">
                  <span className="text-gray-900 dark:text-slate-100">
                    Total:
                  </span>
                  <span className="text-gray-900 dark:text-slate-100">
                    $ {parseFloat(formData.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoicePage;
