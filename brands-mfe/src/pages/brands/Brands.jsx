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
import AddBrandModal from "./AddBrandModal";
import EditBrandModal from "./EditBrandModal";
import DeleteBrandModal from "./DeleteBrandModal";
import ViewBrandModal from "./ViewBrandModal";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { BsArrowRepeat, BsPlus } from "react-icons/bs";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";
import { usePermission } from "@crm/shared/utils/permissions";

const Brands = () => {
  const canCreateBrand = usePermission(["brand.create"]);
  const canEditBrand = usePermission(["brand.edit"]);
  const canDeleteBrand = usePermission(["brand.delete"]);
  const canViewBrand = usePermission(["brand.show"]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();
  const {
    data: brands,
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
  } = usePaginatedData(ApiRequest.brands.list);

  const { user: authUser } = useSelector((state) => state.auth);

  const handleAction = (action, row) => {
    // console.log(`[${action}]`, row);
    setSelectedBrand(row);
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

  const hasAnyActionPermission = canViewBrand || canEditBrand || canDeleteBrand;

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
      cell: (row) => (
        <div>
          <a
            href={row.domain}
            className="line-clamp-2 font-medium text-gray-900 dark:text-slate-100"
          >
            {row.title || "N/A"}
          </a>
          <div className="mt-0.5">
            {row.domain ? (
              <a
                href={row.domain}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {row.domain
                  ? row.domain.replace("https://", "").replace("http://", "")
                  : "N/A"}
              </a>
            ) : (
              "N/A"
            )}
          </div>
          <div className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">
            Unit: {row.unit?.title || "N/A"}
          </div>
        </div>
      ),
    },

    {
      name: "Website Merchant",
      selector: (row) => row.website_merchant?.title || "N/A",
      sortable: true,
      cell: (row) => (
        <span className="rounded px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
          {row?.website_merchant?.title}
        </span>
      ),
    },
    {
      name: "Invoice Merchants",
      selector: (row) => row.invoice_merchants?.length || 0,
      sortable: true,
      cell: (row) => (
        <div>
          {row.invoice_merchants && row.invoice_merchants.length > 0 ? (
            <div className="space-y-1">
              {row.invoice_merchants.slice(0, 2).map((merchant, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="rounded px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                    {merchant.title}
                  </span>
                </div>
              ))}
              {row.invoice_merchants.length > 2 && (
                <div className="text-xs text-gray-500 dark:text-slate-400">
                  +{row.invoice_merchants.length - 2} more
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500 dark:text-slate-400">
              No merchants
            </span>
          )}
        </div>
      ),
    },

    {
      name: "Status",
      selector: (row) => row.send_lead_to_email || "N/A",
      width: "140px",
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
            row.send_lead_to_email === "allow"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-slate-800/60 dark:text-slate-200"
          }`}
        >
          {row.send_lead_to_email || "N/A"}
        </span>
      ),
    },

    ...(hasAnyActionPermission
      ? [
          {
            name: "Action",
            width: "80px",
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
                  {canViewBrand && (
                    <DropdownItem
                      onClick={() => handleAction("view", row)}
                      icon="👁️"
                      label="View"
                    />
                  )}
                  {canEditBrand && (
                    <DropdownItem
                      onClick={() => handleAction("edit", row)}
                      icon="✏️"
                      label="Edit"
                    />
                  )}
                  <DropdownDivider />
                  {canDeleteBrand && (
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

  const handleCreateBrand = async (brandData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(ApiRequest.brands.create, brandData);
      toast.success("Brand created successfully!");
      setActiveModal(null);
      refresh();
    } catch (error) {
      console.error("Error creating brand:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create brand");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBrand = async (brandId, brandData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(
        ApiRequest.brands.update(brandId),
        brandData
      );
      toast.success("Brand updated successfully!");
      setActiveModal(null);
      setSelectedBrand(null);
      refresh();
    } catch (error) {
      console.error("Error updating brand:", error);
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
        toast.error("Failed to update brand. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBrand = async (brandId) => {
    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.brands.delete(brandId));
      toast.success("Brand deleted successfully!");
      setActiveModal(null);
      setSelectedBrand(null);
      refresh();
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error(error.response?.data?.message || "Failed to delete brand");
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
      {/* Header */}
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Brands Management</h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage your brands and their configurations
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {/* Search */}
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Brands"
            size="md"
            icon="search"
            className="w-full sm:w-64"
          />
          {/* Refresh */}
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
          {/* Add Button */}
          {canCreateBrand && (
            <button
              onClick={() => setActiveModal("add")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} /> Add Brand
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={brands}
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
                🏷️
              </div>
              <div className="text-gray-500 dark:text-slate-300">
                No brands found
              </div>
              <div className="mt-0.5 text-sm text-gray-400 dark:text-slate-500">
                Try adjusting your search terms
              </div>
            </div>
          }
        />
      </div>

      {/* Modals */}
      <AddBrandModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateBrand}
        loading={submitting}
      />

      <EditBrandModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
        onSubmit={(brandData) =>
          handleUpdateBrand(selectedBrand?.id, brandData)
        }
        loading={submitting}
      />

      <DeleteBrandModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
        onConfirm={() => handleDeleteBrand(selectedBrand?.id)}
        loading={submitting}
      />

      <ViewBrandModal
        open={activeModal === "view"}
        onClose={() => {
          setActiveModal(null);
          setSelectedBrand(null);
        }}
        brand={selectedBrand}
      />
    </>
  );
};

export default Brands;
