import React, { useEffect, useState, useCallback, useMemo } from "react";
import Select from "react-select";

import { useSelectStyles } from "../hooks/useSelectStyles";
import toast from "react-hot-toast";
import apiAxios from "../api/ApiAxios";
import ApiRequest from "../api/ApiRequest";

const FiltersComponent = ({
  selectedBrand,
  selectedUnit,
  selectedMerchant,
  selectedPaymentStatus,
  selectedSortBy, // ← ADD THIS
  selectedTeam,
  selectedUser,
  selectedRole,
  selectedPermission,
  selectedLead,
  leadEmail,
  fromDate,
  toDate,
  paymentFromDate,
  paymentToDate,
  onFilterChange,
  showPaymentStatus = true,
  showMerchants = true,
  showUnits = true,
  showBrands = true,
  showSortBy = false, // ← ADD THIS
  showTeams = false,
  showUsers = false,
  showRoles = false,
  showPermissions = false,
  showLeads = false,
  showLeadEmail = false,
  showDateRange = false,
  showPaymentDateRange = false,
  multiSelectUsers = false,
  multiSelectBrands = false,
  isRoleSearchable = false,

  // Custom Labels
  unitLabel,
  brandLabel,
  merchantLabel,
  teamLabel,
  userLabel,
  roleLabel,
  permissionLabel,
  leadLabel,
  leadEmailLabel,
  paymentStatusLabel,
  sortByLabel, // ← ADD THIS
  fromDateLabel,
  toDateLabel,
  paymentFromDateLabel,
  paymentToDateLabel,
}) => {
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);

  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [unitSearchTerm, setUnitSearchTerm] = useState("");
  const [merchantSearchTerm, setMerchantSearchTerm] = useState("");
  const [teamSearchTerm, setTeamSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [permissionSearchTerm, setPermissionSearchTerm] = useState("");
  const [leadSearchTerm, setLeadSearchTerm] = useState("");

  const menuPortalTarget =
    typeof document !== "undefined" ? document.body : null;
  const selectStyles = useSelectStyles();

  const paymentStatusOptions = [
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
  ];

  // ← ADD THIS ARRAY
  const sortByOptions = [
    { value: "created_at", label: "Created Date" },
    { value: "transaction_date", label: "Transaction Date" },
  ];

  const fetchBrands = useCallback(async (page = 1, limit = 20, search = "") => {
    try {
      const response = await apiAxios.get(
        `${ApiRequest.brands.list}?page=${page}&per_page=${limit}&search=${search}`
      );

      let brandsData = [];
      if (Array.isArray(response.data?.data)) {
        brandsData = response.data.data;
      }

      const brandOptions = brandsData.map((brand) => ({
        value: brand.id,
        label: brand.title || brand.name || `Brand ${brand.id}`,
      }));

      setBrands(brandOptions);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  }, []);

  const fetchUnits = useCallback(async (page = 1, limit = 20, search = "") => {
    try {
      const response = await apiAxios.get(
        `${ApiRequest.units.list}?page=${page}&per_page=${limit}&search=${search}`
      );

      let unitsData = [];
      if (Array.isArray(response.data?.data)) {
        unitsData = response.data.data;
      }

      const unitOptions = unitsData.map((unit) => ({
        value: unit.id,
        label: unit.title || unit.name || `Unit ${unit.id}`,
      }));

      setUnits(unitOptions);
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnits([]);
    }
  }, []);

  const fetchMerchants = useCallback(
    async (page = 1, limit = 20, search = "") => {
      if (!showMerchants) return;

      try {
        const response = await apiAxios.get(
          `${ApiRequest.merchants.list}?page=${page}&per_page=${limit}&search=${search}`
        );

        let merchantsData = [];
        if (Array.isArray(response.data?.data)) {
          merchantsData = response.data.data;
        }

        const merchantOptions = merchantsData.map((merchant) => ({
          value: merchant.id,
          label: merchant.name || merchant.title || `Merchant ${merchant.id}`,
        }));

        setMerchants(merchantOptions);
      } catch (error) {
        console.error("Error fetching merchants:", error);
        setMerchants([]);
      }
    },
    [showMerchants]
  );

  const fetchTeams = useCallback(
    async (page = 1, limit = 20, search = "") => {
      if (!showTeams) return;

      try {
        const response = await apiAxios.get(
          `${ApiRequest.teams.list}?page=${page}&per_page=${limit}&search=${search}`
        );

        let teamsData = [];
        if (Array.isArray(response.data?.data)) {
          teamsData = response.data.data;
        }

        const teamOptions = teamsData.map((team) => ({
          value: team.id,
          label: team.name || team.title || `Team ${team.id}`,
        }));

        setTeams(teamOptions);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setTeams([]);
      }
    },
    [showTeams]
  );

  const fetchUsers = useCallback(
    async (page = 1, limit = 20, search = "") => {
      if (!showUsers) return;

      try {
        const response = await apiAxios.get(
          `${ApiRequest.users.list}?page=${page}&per_page=${limit}&search=${search}`
        );

        let usersData = [];
        if (Array.isArray(response.data?.data)) {
          usersData = response.data.data;
        }

        const userOptions = usersData.map((user) => ({
          value: user.id,
          label: user.name || user.email || `User ${user.id}`,
          email: user.email,
          teams: user.teams || [],
        }));

        setUsers(userOptions);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    },
    [showUsers]
  );

  const fetchRoles = useCallback(
    async (page = 1, limit = 50, search = "") => {
      if (!showRoles) return;

      setLoadingRoles(true);
      try {
        const response = await apiAxios.get(
          `${ApiRequest.roles.list}?page=${page}&per_page=${limit}&search=${search}`
        );

        let rolesData = [];
        if (Array.isArray(response.data?.data)) {
          rolesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          rolesData = response.data;
        }

        const roleOptions = rolesData.map((role) => ({
          value: role.name || role.id,
          label: role.name || role.title || `Role ${role.id}`,
          id: role.id,
        }));

        setRoles(roleOptions);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([
          { value: "admin", label: "Admin" },
          { value: "manager", label: "Manager" },
          { value: "staff", label: "Staff" },
        ]);
      } finally {
        setLoadingRoles(false);
      }
    },
    [showRoles]
  );

  const fetchPermissions = useCallback(
    async (page = 1, limit = 20, search = "") => {
      if (!showPermissions) return;

      try {
        const response = await apiAxios.get(
          `${ApiRequest.permissions.list}?page=${page}&per_page=${limit}&search=${search}`
        );

        let permissionsData = [];
        if (Array.isArray(response.data?.data)) {
          permissionsData = response.data.data;
        }

        const permissionOptions = permissionsData.map((permission) => ({
          value: permission.id,
          label:
            permission.name ||
            permission.title ||
            `Permission ${permission.id}`,
        }));

        setPermissions(permissionOptions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setPermissions([]);
      }
    },
    [showPermissions]
  );

  const fetchLeads = useCallback(
    async (page = 1, limit = 20, search = "") => {
      if (!showLeads) return;

      try {
        const response = await apiAxios.get(
          `${ApiRequest.leads.list}?page=${page}&per_page=${limit}&search=${search}`
        );

        let leadsData = [];
        if (Array.isArray(response.data?.data)) {
          leadsData = response.data.data;
        }

        const leadOptions = leadsData.map((lead) => ({
          value: lead.id,
          label: `${lead.name || "N/A"} (${lead.email || "N/A"})`,
        }));

        setLeads(leadOptions);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setLeads([]);
      }
    },
    [showLeads]
  );

  const handleBrandInputChange = (inputValue, actionMeta) => {
    setBrandSearchTerm(inputValue);
    if (actionMeta.action === "input-change") {
      clearTimeout(window.brandSearchTimeout);
      window.brandSearchTimeout = setTimeout(() => {
        if (inputValue.trim()) {
          fetchBrands(1, 20, inputValue.trim());
        } else {
          fetchBrands(1, 10, "");
        }
      }, 300);
    }
  };

  const handleUnitInputChange = (inputValue, actionMeta) => {
    setUnitSearchTerm(inputValue);
    if (actionMeta.action === "input-change") {
      clearTimeout(window.unitSearchTimeout);
      window.unitSearchTimeout = setTimeout(() => {
        if (inputValue.trim()) {
          fetchUnits(1, 20, inputValue.trim());
        } else {
          fetchUnits(1, 10, "");
        }
      }, 300);
    }
  };

  const handleMerchantInputChange = (inputValue, actionMeta) => {
    setMerchantSearchTerm(inputValue);
    if (actionMeta.action === "input-change") {
      clearTimeout(window.merchantSearchTimeout);
      window.merchantSearchTimeout = setTimeout(() => {
        if (inputValue.trim()) {
          fetchMerchants(1, 20, inputValue.trim());
        } else {
          fetchMerchants(1, 10, "");
        }
      }, 300);
    }
  };

  const handleTeamInputChange = (inputValue, actionMeta) => {
    setTeamSearchTerm(inputValue);
    if (actionMeta.action === "input-change") {
      clearTimeout(window.teamSearchTimeout);
      window.teamSearchTimeout = setTimeout(() => {
        if (inputValue.trim()) {
          fetchTeams(1, 20, inputValue.trim());
        } else {
          fetchTeams(1, 10, "");
        }
      }, 300);
    }
  };

  const handleUserInputChange = (inputValue, actionMeta) => {
    setUserSearchTerm(inputValue);
    if (actionMeta.action === "input-change") {
      clearTimeout(window.userSearchTimeout);
      window.userSearchTimeout = setTimeout(() => {
        if (inputValue.trim()) {
          fetchUsers(1, 20, inputValue.trim());
        } else {
          fetchUsers(1, 10, "");
        }
      }, 300);
    }
  };

  const handleRoleInputChange = (inputValue, actionMeta) => {
    if (!isRoleSearchable) return;

    setRoleSearchTerm(inputValue);
    if (actionMeta.action === "input-change") {
      clearTimeout(window.roleSearchTimeout);
      window.roleSearchTimeout = setTimeout(() => {
        if (inputValue.trim()) {
          fetchRoles(1, 20, inputValue.trim());
        } else {
          fetchRoles(1, 50, "");
        }
      }, 300);
    }
  };

  const handlePermissionInputChange = (inputValue, actionMeta) => {
    setPermissionSearchTerm(inputValue);
    if (actionMeta.action === "input-change") {
      clearTimeout(window.permissionSearchTimeout);
      window.permissionSearchTimeout = setTimeout(() => {
        if (inputValue.trim()) {
          fetchPermissions(1, 20, inputValue.trim());
        } else {
          fetchPermissions(1, 10, "");
        }
      }, 300);
    }
  };

  const handleLeadInputChange = (inputValue, actionMeta) => {
    setLeadSearchTerm(inputValue);
    if (actionMeta.action === "input-change") {
      clearTimeout(window.leadSearchTimeout);
      window.leadSearchTimeout = setTimeout(() => {
        if (inputValue.trim()) {
          fetchLeads(1, 20, inputValue.trim());
        } else {
          fetchLeads(1, 10, "");
        }
      }, 300);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const requests = [];

        if (showBrands) requests.push(fetchBrands());
        if (showUnits) requests.push(fetchUnits());
        if (showMerchants) requests.push(fetchMerchants());
        if (showTeams) requests.push(fetchTeams());
        if (showUsers) requests.push(fetchUsers());
        if (showRoles) requests.push(fetchRoles());
        if (showPermissions) requests.push(fetchPermissions());
        if (showLeads) requests.push(fetchLeads());

        if (requests.length > 0) {
          await Promise.all(requests);
        }
      } catch (error) {
        console.error("Error loading filter options:", error);
        toast.error("Failed to load filter options");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [
    fetchBrands,
    fetchUnits,
    fetchMerchants,
    fetchTeams,
    fetchUsers,
    fetchRoles,
    fetchPermissions,
    fetchLeads,
    showBrands,
    showUnits,
    showMerchants,
    showTeams,
    showUsers,
    showRoles,
    showPermissions,
    showLeads,
  ]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {showLeadEmail && (
          <div>
            <label>{leadEmailLabel || "Lead Email"}</label>
            <input
              type="email"
              value={leadEmail || ""}
              onChange={(event) =>
                onFilterChange("leadEmail", event.target.value)
              }
              placeholder="Search by lead email"
              className="form-control"
            />
          </div>
        )}

        {/* Units Filter */}
        {showUnits && (
          <div>
            <label>{unitLabel || "Unit"}</label>
            <Select
              options={units}
              value={selectedUnit}
              onChange={(option) => onFilterChange("unit", option)}
              onInputChange={handleUnitInputChange}
              inputValue={unitSearchTerm}
              placeholder="Select Units"
              styles={selectStyles}
              isClearable
              isSearchable
              noOptionsMessage={() => "No units found"}
              loadingMessage={() => "Loading units..."}
              filterOption={null}
              menuPortalTarget={menuPortalTarget}
              classNamePrefix="tm-select"
            />
          </div>
        )}

        {/* Brands Filter */}
        {showBrands && (
          <div>
            <label>{brandLabel || "Brands"}</label>
            <Select
              options={brands}
              value={selectedBrand}
              onChange={(option) => onFilterChange("brand", option)}
              onInputChange={handleBrandInputChange}
              inputValue={brandSearchTerm}
              placeholder="Select Brands"
              styles={selectStyles}
              isClearable
              isSearchable={true}
              isLoading={loading}
              isMulti={multiSelectBrands}
              noOptionsMessage={() => "No brands found"}
              loadingMessage={() => "Loading brands..."}
              filterOption={null}
              menuPortalTarget={menuPortalTarget}
              classNamePrefix="tm-select"
            />
          </div>
        )}

        {/* Merchants Filter */}
        {showMerchants && (
          <div>
            <label>{merchantLabel || "Merchant"}</label>
            <Select
              options={merchants}
              value={selectedMerchant}
              onChange={(option) => onFilterChange("merchant", option)}
              onInputChange={handleMerchantInputChange}
              inputValue={merchantSearchTerm}
              placeholder="Select Merchants"
              styles={selectStyles}
              isClearable
              isSearchable={true}
              isLoading={loading}
              noOptionsMessage={() => "No merchants found"}
              loadingMessage={() => "Loading merchants..."}
              filterOption={null}
              menuPortalTarget={menuPortalTarget}
              classNamePrefix="tm-select"
            />
          </div>
        )}

        {/* Teams Filter */}
        {showTeams && (
          <div>
            <label>{teamLabel || "Teams"}</label>
            <Select
              options={teams}
              value={selectedTeam}
              onChange={(option) => onFilterChange("team", option)}
              onInputChange={handleTeamInputChange}
              inputValue={teamSearchTerm}
              placeholder="Select Teams"
              styles={selectStyles}
              isClearable
              isSearchable={true}
              isLoading={loading}
              noOptionsMessage={() => "No teams found"}
              loadingMessage={() => "Loading teams..."}
              filterOption={null}
              menuPortalTarget={menuPortalTarget}
              classNamePrefix="tm-select"
            />
          </div>
        )}

        {/* Users Filter */}
        {showUsers && (
          <div>
            <label>{userLabel || "Users"}</label>
            <Select
              options={users}
              value={selectedUser}
              onChange={(option) => onFilterChange("user", option)}
              onInputChange={handleUserInputChange}
              inputValue={userSearchTerm}
              placeholder="Select Users"
              styles={selectStyles}
              isClearable
              isSearchable={true}
              isLoading={loading}
              isMulti={multiSelectUsers}
              noOptionsMessage={() => "No users found"}
              loadingMessage={() => "Loading users..."}
              filterOption={null}
              menuPortalTarget={menuPortalTarget}
              classNamePrefix="tm-select"
            />
          </div>
        )}

        {/* Roles Filter */}
        {showRoles && (
          <div>
            <label>{roleLabel || "Role"}</label>
            <Select
              className="rs-role"
              classNamePrefix="tm-select"
              options={roles}
              value={selectedRole}
              onChange={(option) => onFilterChange("role", option)}
              {...(isRoleSearchable && {
                onInputChange: handleRoleInputChange,
                inputValue: roleSearchTerm,
                filterOption: null,
              })}
              placeholder="Select Role"
              styles={selectStyles}
              isClearable
              isSearchable={isRoleSearchable}
              isLoading={loadingRoles}
              noOptionsMessage={() => "No roles found"}
              loadingMessage={() => "Loading roles..."}
              menuPortalTarget={menuPortalTarget}
            />
          </div>
        )}

        {/* Permissions Filter */}
        {showPermissions && (
          <div>
            <label>{permissionLabel || "Permissions"}</label>
            <Select
              options={permissions}
              value={selectedPermission}
              onChange={(option) => onFilterChange("permission", option)}
              onInputChange={handlePermissionInputChange}
              inputValue={permissionSearchTerm}
              placeholder="Select Permissions"
              styles={selectStyles}
              isClearable
              isSearchable={true}
              isLoading={loading}
              noOptionsMessage={() => "No permissions found"}
              loadingMessage={() => "Loading permissions..."}
              filterOption={null}
              menuPortalTarget={menuPortalTarget}
              classNamePrefix="tm-select"
            />
          </div>
        )}

        {/* Leads Filter */}
        {showLeads && (
          <div>
            <label>{leadLabel || "Leads"}</label>
            <Select
              options={leads}
              value={selectedLead}
              onChange={(option) => onFilterChange("lead", option)}
              onInputChange={handleLeadInputChange}
              inputValue={leadSearchTerm}
              placeholder="Search leads by name or email"
              styles={selectStyles}
              isClearable
              isSearchable={true}
              isLoading={loading}
              noOptionsMessage={() => "No leads found"}
              loadingMessage={() => "Loading leads..."}
              filterOption={null}
              menuPortalTarget={menuPortalTarget}
              classNamePrefix="tm-select"
            />
          </div>
        )}

        {/* Payment Status Filter */}
        {showPaymentStatus && (
          <div>
            <label>{paymentStatusLabel || "Payment Status"}</label>
            <Select
              options={paymentStatusOptions}
              value={selectedPaymentStatus}
              onChange={(option) => onFilterChange("paymentStatus", option)}
              placeholder="Select Payment Status"
              styles={selectStyles}
              isClearable
              isSearchable={true}
              isLoading={loading}
              menuPortalTarget={menuPortalTarget}
              classNamePrefix="tm-select"
            />
          </div>
        )}

        {/* ← ADD THIS SORT BY SECTION */}
        {showSortBy && (
          <div>
            <label>{sortByLabel || "Sort By"}</label>
            <Select
              options={sortByOptions}
              value={selectedSortBy}
              onChange={(option) => onFilterChange("sortBy", option)}
              placeholder="Select Sort By"
              styles={selectStyles}
              isSearchable={false}
              menuPortalTarget={menuPortalTarget}
              classNamePrefix="tm-select"
            />
          </div>
        )}

        {showDateRange && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label>{fromDateLabel || "From Date"}</label>
              <input
                type="date"
                value={fromDate || ""}
                onChange={(e) => onFilterChange("fromDate", e.target.value)}
                className="form-control"
              />
            </div>
            <div>
              <label>{toDateLabel || "To Date"}</label>
              <input
                type="date"
                value={toDate || ""}
                onChange={(e) => onFilterChange("toDate", e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        )}

        {showPaymentDateRange && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label>{paymentFromDateLabel || "Payment From Date"}</label>
              <input
                type="date"
                value={paymentFromDate || ""}
                onChange={(e) =>
                  onFilterChange("paymentFromDate", e.target.value)
                }
                className="form-control"
              />
            </div>
            <div>
              <label>{paymentToDateLabel || "Payment To Date"}</label>
              <input
                type="date"
                value={paymentToDate || ""}
                onChange={(e) =>
                  onFilterChange("paymentToDate", e.target.value)
                }
                className="form-control"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltersComponent;
