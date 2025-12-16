import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Select from "react-select";
import { usePermission } from "@crm/shared/utils/permissions";

import { useSelectStyles } from "@crm/shared/hooks/useSelectStyles";
import AddPackageModal from "./AddPackageModal";
import EditPackageModal from "./EditPackageModal";
import DeletePackageModal from "./DeletePackageModal";
import ViewPackageModal from "./ViewPackageModal";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { BsArrowRepeat, BsPlus } from "react-icons/bs";

const PackagesMap = () => {
  const canCreatePackage = usePermission(["package.create"]);
  const canEditPackage = usePermission(["package.edit"]);
  const canDeletePackage = usePermission(["package.delete"]);

  const [activeModal, setActiveModal] = useState(null);

  const [packages, setPackages] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState({});
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [packageSearchTerm, setPackageSearchTerm] = useState("");

  const { user: authUser } = useSelector((state) => state.auth);

  const selectStyles = useSelectStyles();

  const fetchBrands = useCallback(
    async (page = 1, limit = 10, search = "") => {
      setLoadingBrands(true);
      try {
        const response = await apiAxios.get(
          `${ApiRequest.brands.list}?page=${page}&per_page=${limit}&search=${search}`
        );

        if (response.data) {
          if (response.data.data) {
            setBrands(response.data.data);
          } else if (Array.isArray(response.data)) {
            setBrands(response.data);
          } else {
            setBrands([]);
          }
        }

        if (
          response.data?.data &&
          response.data.data.length > 0 &&
          !selectedBrand &&
          !search
        ) {
          const defaultBrand = {
            value: response.data.data[0].id,
            label:
              response.data.data[0].name ||
              response.data.data[0].title ||
              `Brand ${response.data.data[0].id}`,
          };
          setSelectedBrand(defaultBrand);
        } else if (!response.data?.data?.length && !selectedBrand && !search) {
          const defaultBrand = {
            value: 1,
            label: "Default Brand",
          };
          setSelectedBrand(defaultBrand);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast.error("Failed to fetch brands");
        setBrands([]);
        if (!search && !selectedBrand) {
          const defaultBrand = {
            value: 1,
            label: "Default Brand",
          };
          setSelectedBrand(defaultBrand);
        }
      } finally {
        setLoadingBrands(false);
      }
    },
    [selectedBrand]
  );

  const fetchPackages = useCallback(
    async (brandId = 1, page = 1, limit = 10, search = "") => {
      setLoading(true);
      try {
        let url = `/brand-packages/${brandId}`;

        const response = await apiAxios.get(url);

        let allPackages = [];
        let total = 0;

        if (response.data?.data && Array.isArray(response.data.data)) {
          allPackages = response.data.data;
          total = response.data.total || response.data.data.length;
        } else if (Array.isArray(response.data)) {
          allPackages = response.data;
          total = response.data.length;
        }

        setPackages(allPackages);
        setTotalRows(total);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast.error("Failed to fetch packages");
        setPackages([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
      }
    },
    []
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

  const handleBrandChange = (selectedOption) => {
    setSelectedBrand(selectedOption);
    setCurrentPage(1);
    setPackageSearchTerm("");
    setSelectedPackages({});
  };

  const handlePackageSelect = (packageId, isSelected) => {
    setSelectedPackages((prev) => ({
      ...prev,
      [packageId]: isSelected,
    }));
  };

  const handleAction = (action, pkg) => {
    // console.log(`[${action}]`, pkg);
    setSelectedPackage(pkg);

    switch (action) {
      case "view":
        setActiveModal("view");
        break;
      case "edit":
        if (canEditPackage) {
          setActiveModal("edit");
        }
        break;
      case "delete":
        if (canDeletePackage) {
          setActiveModal("delete");
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  useEffect(() => {
    if (selectedBrand) {
      fetchPackages(selectedBrand.value);
    } else {
      fetchPackages(1);
    }
  }, [selectedBrand, fetchPackages]);

  const handleCreatePackage = async (packageData) => {
    if (!canCreatePackage) {
      toast.error("You don't have permission to add packages");
      setActiveModal(null);
      return;
    }

    setSubmitting(true);
    try {
      const brandId = selectedBrand ? selectedBrand.value : 1;
      const response = await apiAxios.post(
        `/brand-packages/${brandId}/store`,
        packageData
      );
      toast.success("Package created successfully!");
      setActiveModal(null);
      await fetchPackages(brandId);
    } catch (error) {
      console.error("Error creating package:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create package"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePackage = async (packageId, packageData) => {
    if (!canEditPackage) {
      toast.error("You don't have permission to update packages");
      setActiveModal(null);
      setSelectedPackage(null);
      return;
    }

    setSubmitting(true);
    try {
      const brandId = selectedBrand ? selectedBrand.value : 1;
      const response = await apiAxios.post(
        `/brand-packages/${brandId}/update/${packageId}`,
        packageData
      );
      toast.success("Package updated successfully!");
      setActiveModal(null);
      setSelectedPackage(null);
      await fetchPackages(brandId);
    } catch (error) {
      console.error("Error updating package:", error);
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
        toast.error("Failed to update package. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (!canDeletePackage) {
      toast.error("You don't have permission to remove packages");
      setActiveModal(null);
      setSelectedPackage(null);
      return;
    }

    setSubmitting(true);
    try {
      const brandId = selectedBrand ? selectedBrand.value : 1;
      await apiAxios.delete(`/brand-packages/${brandId}/delete/${packageId}`);
      toast.success("Package deleted successfully!");
      setActiveModal(null);
      setSelectedPackage(null);
      await fetchPackages(brandId);
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error(error.response?.data?.message || "Failed to delete package");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveSelected = async () => {
    if (!canDeletePackage) {
      toast.error("You don't have permission to remove packages");
      return;
    }

    const selectedIds = Object.keys(selectedPackages).filter(
      (id) => selectedPackages[id]
    );

    if (selectedIds.length === 0) {
      toast.error("No packages selected to remove");
      return;
    }

    const brandId = selectedBrand ? selectedBrand.value : 1;

    if (
      !window.confirm(
        `Are you sure you want to remove ${selectedIds.length} selected package(s)?`
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const packageId of selectedIds) {
        try {
          await apiAxios.delete(
            `/brand-packages/${brandId}/delete/${packageId}`
          );
          successCount++;
        } catch (error) {
          console.error(`Failed to delete package ${packageId}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount} package(s) removed successfully!`);
      }
      if (errorCount > 0) {
        toast.error(`${errorCount} package(s) failed to remove`);
      }

      setSelectedPackages({});
      await fetchPackages(brandId);
    } catch (error) {
      console.error("Error removing packages:", error);
      toast.error("Failed to remove packages");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefresh = useCallback(() => {
    const brandId = selectedBrand ? selectedBrand.value : 1;
    fetchPackages(brandId, currentPage, perPage, packageSearchTerm);
  }, [selectedBrand, currentPage, perPage, packageSearchTerm, fetchPackages]);

  const groupedPackages = packages.reduce((groups, pkg) => {
    const type = pkg.type || "other";
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(pkg);
    return groups;
  }, {});

  const getTypeDisplayName = (type) => {
    const typeNames = {
      "search-packages": "Search Packages",
      "filing-packages": "Filing Packages",
      "amazon-brand-registry": "Amazon Brand Registry",
      "rush-filing": "Rush Filing",
      other: "Other Packages",
    };
    return (
      typeNames[type] ||
      type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const brandOptions = brands.map((brand) => ({
    value: brand.id,
    label: brand.name || brand.title || `Brand ${brand.id}`,
  }));

  const PackageCard = ({ pkg }) => {
    const isSelected = selectedPackages[pkg.id];
    const [showFullDescription, setShowFullDescription] = useState(false);
    const truncateText = (text, maxLength = 60) => {
      if (!text) return "No description available";
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    };

    const displayFeatures =
      pkg.features && Array.isArray(pkg.features)
        ? pkg.features.slice(0, 3)
        : [];
    const hasMoreFeatures = pkg.features && pkg.features.length > 3;

    return (
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/60 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200 relative flex flex-col">
        {pkg.badge && (
          <div className=" -mt-[34px] mb-3">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium whitespace-nowrap">
              {pkg.badge}
            </span>
          </div>
        )}
        {/* Package Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3
                  className="text-lg font-semibold text-gray-900 dark:text-slate-100 truncate"
                  title={pkg?.name}
                >
                  {pkg.name}
                </h3>
              </div>

              {/* Package ID and Type */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500 dark:text-slate-400 text-nowrap">
                  ID: {pkg.id}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-xs text-gray-500 dark:text-slate-400 text-nowrap capitalize">
                  {pkg.type?.replace("-", " ") || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex gap-1">
              <button
                className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium flex-shrink-0"
                onClick={() => handleAction("view", pkg)}
              >
                View
              </button>
              {canEditPackage && (
                <button
                  className="text-green-600 dark:text-emerald-300 hover:text-green-800 dark:hover:text-emerald-200 text-sm font-medium flex-shrink-0"
                  onClick={() => handleAction("edit", pkg)}
                >
                  Edit
                </button>
              )}
              {canDeletePackage && (
                <button
                  className="text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 text-sm font-medium flex-shrink-0"
                  onClick={() => handleAction("delete", pkg)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <p
              className="text-sm text-gray-600 dark:text-slate-300"
              title={pkg.description}
            >
              {showFullDescription
                ? pkg.description || "No description available"
                : truncateText(pkg.description)}
              {pkg.description && pkg.description.length > 60 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 text-xs ml-1"
                >
                  {showFullDescription ? "Less" : "More"}
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green-600 dark:text-emerald-300">
              ${pkg.price || "0"}
            </span>
            {pkg.discounted_price && (
              <span className="ml-2 text-sm text-gray-500 dark:text-slate-400 line-through">
                ${pkg.discounted_price}
              </span>
            )}
          </div>

          {/* Status Indicators */}
          <div className="flex gap-1">
            {pkg.rush_filing_enabled && (
              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-200 rounded text-xs font-medium">
                Rush
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 dark:bg-slate-800/70 text-gray-700 dark:text-slate-200 rounded text-xs">
              Sort: {pkg.sort || "N/A"}
            </span>
          </div>
        </div>

        {/* Limited Features Display */}
        {displayFeatures.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 dark:text-slate-400 mb-2 flex items-center justify-between">
              <span>Features</span>
              <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded">
                {pkg.features ? pkg.features.length : 0} total
              </span>
            </div>
            <ul className="space-y-1">
              {displayFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-xs text-gray-700 dark:text-slate-200"
                >
                  <div className="w-1.5 h-1.5 bg-green-50 dark:bg-emerald-500/60 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
              {hasMoreFeatures && (
                <li className="text-xs text-blue-600 dark:text-blue-300 font-medium">
                  +{pkg.features.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Before Content - Compact */}
        {pkg.beforeContent && (
          <div className="bg-green-50 dark:bg-emerald-500/10 border-l-4 border-green-400 dark:border-emerald-500/40 p-2 mb-4">
            <p
              className="text-xs text-green-700 dark:text-emerald-200 line-clamp-2"
              title={pkg.beforeContent}
            >
              {truncateText(pkg.beforeContent, 80)}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => handlePackageSelect(pkg.id, !isSelected)}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors text-sm mt-auto ${
            isSelected
              ? "btn btn-danger"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isSelected ? "Selected" : "Select"}
        </button>

        {/* Package Dates - Small Footer */}
        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800 flex justify-between text-xs text-gray-400 dark:text-slate-500">
          <span>Created: {new Date(pkg.created_at).toLocaleDateString()}</span>
          <span>Updated: {new Date(pkg.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Brand Packages Mapping
          </h1>
          <p className="text-gray-600 dark:text-slate-300">
            {selectedBrand?.label || "Default Brand"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Brand Selector */}
          <div className="w-full sm:w-64">
            <Select
              className="rs-brand"
              classNamePrefix="rs"
              options={brandOptions}
              value={selectedBrand}
              onChange={handleBrandChange}
              onInputChange={handleBrandInputChange}
              inputValue={brandSearchTerm}
              isSearchable={true}
              isLoading={loadingBrands}
              styles={selectStyles}
              menuPortalTarget={
                typeof document !== "undefined" ? document.body : null
              }
              placeholder="Search Brand..."
              noOptionsMessage={() => "No brands found"}
              loadingMessage={() => "Loading brands..."}
              isClearable={false}
              filterOption={null}
            />
          </div>

          {/* Package Search */}
          {/* <div className="w-full sm:w-64">
            <input
              type="text"
              value={packageSearchTerm}
              onChange={(e) => handlePackageSearch(e.target.value)}
              placeholder="Search packages..."
              disabled={!selectedBrand}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 dark:bg-slate-800/70"
            />
          </div> */}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {canCreatePackage && (
              <button
                onClick={() => setActiveModal("add")}
                className="btn btn-primary"
              >
                <BsPlus size={20} /> Add Package
              </button>
            )}
            <button className="btn bg-green-600 text-white hover:bg-green-700">
              Package Types
            </button>
            <button className="btn bg-purple-600 text-white hover:bg-purple-700">
              M. Categories
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="btn btn-black"
            >
              <BsArrowRepeat size={20} color="white" />
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <>
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full size-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        </>
      ) : (
        <>
          {/* Selected Brand Info */}
          {selectedBrand && (
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/40 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-300 rounded-full"></div>
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  Selected Brand: {selectedBrand.label}
                </span>
                <span className="text-blue-600 dark:text-blue-300 text-sm">
                  ({packages.length} packages found)
                </span>
              </div>
            </div>
          )}

          {/* Package Categories */}
          <div className="space-y-8">
            {Object.keys(groupedPackages).length === 0 ? (
              <div className="text-center py-12 rounded-2xl border border-gray-200 dark:border-slate-700/60 dark:bg-slate-900/40">
                <div className="text-gray-400 dark:text-slate-500 text-lg mb-2">
                  📦
                </div>
                <div className="text-gray-500 dark:text-slate-400">
                  No packages found
                </div>
                <div className="text-sm text-gray-400 dark:text-slate-500 mt-1">
                  Try selecting a different brand or add a new package
                </div>
              </div>
            ) : (
              Object.entries(groupedPackages).map(([type, typePackages]) => (
                <div key={type} className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 border-b border-gray-200 dark:border-slate-700/60 pb-2">
                    {getTypeDisplayName(type)}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 gap-6">
                    {typePackages.map((pkg) => (
                      <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selected Packages Summary */}
          {Object.keys(selectedPackages).filter((id) => selectedPackages[id])
            .length > 0 && (
            <div className="fixed bottom-6 right-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/60 rounded-xl shadow-lg p-4">
              <div className="text-sm font-medium text-gray-900 dark:text-slate-100 mb-2">
                Selected Packages:{" "}
                {
                  Object.keys(selectedPackages).filter(
                    (id) => selectedPackages[id]
                  ).length
                }
              </div>
              <div className="flex gap-2">
                {canDeletePackage && (
                  <button
                    onClick={handleRemoveSelected}
                    disabled={submitting}
                    className="btn btn-primary btn-sm"
                  >
                    {submitting ? "Removing..." : "Remove Selected"}
                  </button>
                )}
                <button
                  onClick={() => setSelectedPackages({})}
                  className="btn bg-green-600 text-white hover:bg-green-700 btn-sm"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <AddPackageModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreatePackage}
        loading={submitting}
        brandId={selectedBrand?.value}
        brandName={selectedBrand?.label}
      />

      <EditPackageModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedPackage(null);
        }}
        package={selectedPackage}
        onSubmit={(packageData) =>
          handleUpdatePackage(selectedPackage?.id, packageData)
        }
        loading={submitting}
        brandId={selectedBrand?.value}
        brandName={selectedBrand?.label}
      />

      <DeletePackageModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedPackage(null);
        }}
        package={selectedPackage}
        onConfirm={() => handleDeletePackage(selectedPackage?.id)}
        loading={submitting}
      />

      <ViewPackageModal
        open={activeModal === "view"}
        onClose={() => {
          setActiveModal(null);
          setSelectedPackage(null);
        }}
        package={selectedPackage}
        brandName={selectedBrand?.label}
      />
    </>
  );
};

export default PackagesMap;
