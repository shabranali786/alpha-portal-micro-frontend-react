import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
  CustomDropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownDivider,
  useDropdown,
} from "@crm/shared/components/CustomDropdown";
import { SearchBox } from "@crm/shared/components/SearchBox";
import AddUnitModal from "./AddUnitModal";
import EditUnitModal from "./EditUnitModal";
import DeleteUnitModal from "./DeleteUnitModal";
import ViewUnitModal from "./ViewUnitModal";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { BsArrowRepeat, BsPlus } from "react-icons/bs";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";
import { usePermission } from "@crm/shared/utils/permissions";

const Units = () => {
  const canCreateUnit = usePermission(["unit.create"]);
  const canEditUnit = usePermission(["unit.edit"]);
  const canDeleteUnit = usePermission(["unit.delete"]);
  const canViewUnit = usePermission(["unit.show"]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: units,
    loading,
    totalRows,
    currentPage,
    perPage,
    searchTerm,
    setCurrentPage,
    setPerPage,
    handleSearch,
    refresh,
    fetchData,
  } = usePaginatedData(ApiRequest.units.list);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  const { user: authUser } = useSelector((state) => state.auth);

  const handleAction = (action, row) => {
    // console.log(`[${action}]`, row);
    setSelectedUnit(row);
    closeDropdown();

    switch (action) {
      case "view":
        setActiveModal("view");
        break;
      case "edit":
        setActiveModal("edit");
        break;
      case "delete":
        setActiveModal("delete");
        break;
      default:
        break;
    }
  };

  const hasAnyActionPermission = canViewUnit || canEditUnit || canDeleteUnit;

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "90px",
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title || "N/A",
      sortable: true,
      grow: 2,
    },
    {
      name: "Lifetime Limit",
      selector: (row) => row.lifetime_limit || "0",
      width: "150px",
      sortable: true,
      cell: (row) => (
        <span className="rounded px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
          {row.lifetime_limit === "0" ? "Unlimited" : row.lifetime_limit}
        </span>
      ),
    },
    {
      name: "Total Brands",
      selector: (row) => row.brands_count || "0",
      sortable: true,
      cell: (row) => (
        <span className="rounded px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
          {row.brands_count || 0} brands
        </span>
      ),
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <span className="text-sm text-gray-600 dark:text-slate-400">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },

    ...(hasAnyActionPermission
      ? [
          {
            name: "Action",
            right: true,
            allowOverflow: true,
            button: true,
            ignoreRowClick: true,
            cell: (row) => (
              <div className="relative">
                <DropdownTrigger
                  onClick={(e) => handleDropdownToggle(row.id, e)}
                />
                <CustomDropdown
                  isOpen={openDropdown === row.id}
                  onClose={closeDropdown}
                  position={dropdownPosition}
                >
                  {canViewUnit && (
                    <DropdownItem
                      onClick={() => handleAction("view", row)}
                      icon="👁️"
                      label="View"
                    />
                  )}
                  {canEditUnit && (
                    <DropdownItem
                      onClick={() => handleAction("edit", row)}
                      icon="✏️"
                      label="Edit"
                    />
                  )}
                  <DropdownDivider />
                  {canDeleteUnit && (
                    <DropdownItem
                      onClick={() => handleAction("delete", row)}
                      icon="🗑️"
                      label="Delete"
                      danger={true}
                    />
                  )}
                </CustomDropdown>
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleCreateUnit = async (unitData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(ApiRequest.units.create, unitData);
      toast.success("Unit created successfully!");
      setActiveModal(null);
      refresh();
    } catch (error) {
      console.error("Error creating unit:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create unit");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUnit = async (unitId, unitData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(
        ApiRequest.units.update(unitId),
        unitData
      );
      toast.success("Unit updated successfully!");
      setActiveModal(null);
      setSelectedUnit(null);
      refresh();
    } catch (error) {
      console.error("Error updating unit:", error);
      if (error.response?.status === 500) {
        toast.error(
          "Server error. Please check the data format or contact administrator."
        );
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update unit. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUnit = async (unitId) => {
    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.units.delete(unitId));
      toast.success("Unit deleted successfully!");
      setActiveModal(null);
      setSelectedUnit(null);
      refresh();
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast.error(error.response?.data?.message || "Failed to delete unit");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Units Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage system units and their lifetime limits
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Units"
            size="md"
            icon="search"
            className="w-full sm:w-64"
          />

          {/* Refresh Button */}
          <button
            onClick={refresh}
            disabled={loading}
            className="btn btn-black"
          >
            {loading ? (
              <svg
                className="animate-spin size-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <BsArrowRepeat size={20} />
            )}{" "}
            Refresh
          </button>

          {/* Add Unit Button */}
          {canCreateUnit && (
            <button
              onClick={() => setActiveModal("add")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} /> Add Unit
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={units}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          paginationPerPage={perPage}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          onChangeRowsPerPage={handlePerRowsChange}
          onChangePage={handlePageChange}
          dense
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="w-full py-12 text-center dark:bg-slate-800">
              <div className="mb-2 text-lg text-gray-400 dark:text-slate-500">
                🏢
              </div>
              <div className="text-gray-500 dark:text-slate-300">
                No units found
              </div>
              <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                Try adjusting your search terms
              </div>
            </div>
          }
        />
      </div>

      {/* Modals */}
      <AddUnitModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateUnit}
        loading={submitting}
      />

      <EditUnitModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedUnit(null);
        }}
        unit={selectedUnit}
        onSubmit={(unitData) => handleUpdateUnit(selectedUnit?.id, unitData)}
        loading={submitting}
      />

      <DeleteUnitModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedUnit(null);
        }}
        unit={selectedUnit}
        onConfirm={() => handleDeleteUnit(selectedUnit?.id)}
        loading={submitting}
      />

      <ViewUnitModal
        open={activeModal === "view"}
        onClose={() => {
          setActiveModal(null);
          setSelectedUnit(null);
        }}
        unit={selectedUnit}
      />
    </>
  );
};

export default Units;
