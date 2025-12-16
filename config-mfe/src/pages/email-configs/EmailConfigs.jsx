import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { BsArrowRepeat, BsPlus, BsUpload } from "react-icons/bs";
import { SearchBox } from "@crm/shared/components/SearchBox";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";
import { format } from "date-fns";
import {
  CustomDropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownDivider,
  useDropdown,
} from "@crm/shared/components/CustomDropdown";
import { usePermission } from "@crm/shared/utils/permissions";
import toast from "react-hot-toast";
import apiAxios from "@crm/shared/api/ApiAxios";
import AddEmailConfigModal from "./AddEmailConfigModal";
import EditEmailConfigModal from "./EditEmailConfigModal";
import DeleteEmailConfigModal from "./DeleteEmailConfigModal";
import ViewEmailConfigModal from "./ViewEmailConfigModal";
import ViewEmailLogsModal from "./ViewEmailLogsModal";
import SyncEmailsModal from "./SyncEmailsModal";
import MailboxModal from "./MailboxModal";
import AssignUsersModal from "./AssignUsersModal";
import ImportEmailConfigModal from "./ImportEmailConfigModal";

const EmailConfigs = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [importResults, setImportResults] = useState(null);

  // Permissions
  const canCreateEmailConfig = usePermission(["email-config.create"]);
  const canEditEmailConfig = usePermission(["email-config.edit"]);
  const canDeleteEmailConfig = usePermission(["email-config.delete"]);
  const canViewEmailConfig = usePermission(["email-config.show"]);
  const canImportEmailConfig = usePermission(["email-config.import"]);

  const {
    data: emailConfigs,
    loading,
    totalRows,
    currentPage,
    perPage,
    searchTerm,
    setCurrentPage,
    setPerPage,
    handleSearch,
    refresh,
  } = usePaginatedData(ApiRequest.emailConfigs.list);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  const handleImportEmailConfig = async (formData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(
        ApiRequest.emailConfigs.import,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data?.data || {};
      const message = response.data?.message || "Import completed";

      // Extract response data
      const totalProcessed = data.total_brands_processed || 0;
      const totalFound = data.total_brands_found || 0;
      const totalNotFound = data.total_brands_not_found || 0;
      const totalInserted = data.total_emails_inserted || 0;
      const totalSkipped = data.total_rows_skipped || 0;
      const brandsNotFound = data.brands_not_found || [];
      const skippedRows = data.skipped_rows || [];

      if (totalInserted > 0) {
        toast.success(
          `${message}\n${totalInserted} email config(s) imported successfully!`
        );
      } else {
        toast.success(message);
      }

      if (brandsNotFound.length > 0) {
        brandsNotFound.forEach((brand) => {
          toast.error(
            `Brand not found: ${brand.normalized_domain}\n${brand.reason}`,
            {
              duration: 5000,
            }
          );
        });
      }

      if (skippedRows.length > 0) {
        skippedRows.forEach((row) => {
          toast.error(`Row ${row.row_number} skipped: ${row.reason}`, {
            duration: 5000,
          });
        });
      }

      if (totalNotFound > 0 || totalSkipped > 0) {
        toast.error(
          `Summary: ${totalNotFound} brand(s) not found, ${totalSkipped} row(s) skipped`,
          {
            duration: 6000,
          }
        );
      }

      setImportResults(data);
      if (totalNotFound === 0 && totalSkipped === 0) {
        setTimeout(() => {
          setActiveModal(null);
          setImportResults(null);
        }, 1500);
      }

      refresh();
    } catch (error) {
      console.error("Error importing email configs:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to import email configs"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (action, row) => {
    setSelectedConfig(row);
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
      case "mailbox":
        setActiveModal("mailbox");
        break;
      case "assign_users":
        setActiveModal("assignUsers");
        break;
      case "sync":
        handleSyncEmails(row.id);
        break;
      case "logs":
        setActiveModal("logs");
        break;
      default:
        break;
    }
  };

  const handleSyncEmails = (configId) => {
    const config = emailConfigs.find((c) => c.id === configId);
    if (config) {
      setSelectedConfig(config);
      setActiveModal("sync");
    }
  };

  const handleCreateEmailConfig = async (configData) => {
    setSubmitting(true);
    try {
      await apiAxios.post(ApiRequest.emailConfigs.create, configData);
      toast.success("Email config created successfully!");
      setActiveModal(null);
      refresh();
    } catch (error) {
      console.error("Error creating email config:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create email config"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEmailConfig = async (configId, configData) => {
    setSubmitting(true);
    try {
      await apiAxios.put(ApiRequest.emailConfigs.update(configId), configData);
      toast.success("Email config updated successfully!");
      setActiveModal(null);
      setSelectedConfig(null);
      refresh();
    } catch (error) {
      console.error("Error updating email config:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update email config"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmailConfig = async (configId) => {
    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.emailConfigs.delete(configId));
      toast.success("Email config deleted successfully!");
      setActiveModal(null);
      setSelectedConfig(null);
      refresh();
    } catch (error) {
      console.error("Error deleting email config:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete email config"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Never";
    try {
      return format(new Date(date), "MMM dd, yyyy HH:mm");
    } catch {
      return date;
    }
  };

  const hasAnyActionPermission =
    canViewEmailConfig || canEditEmailConfig || canDeleteEmailConfig;

  const getProviderBadge = (provider) => {
    const providers = {
      smtp: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        label: "SMTP",
      },
      "imap+smtp": {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-300",
        label: "IMAP+SMTP",
      },
      mailgun: {
        bg: "bg-orange-100 dark:bg-orange-900/30",
        text: "text-orange-700 dark:text-orange-300",
        label: "Mailgun",
      },
    };

    const prov = providers[provider] || providers.smtp;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${prov.bg} ${prov.text}`}
      >
        {prov.label}
      </span>
    );
  };

  const columns = [
    {
      name: "ID / Name",
      sortable: true,
      width: "200px",
      cell: (row) => (
        <div>
          <div className="font-mono text-sm text-slate-900 dark:text-slate-100">
            #{row.id}
          </div>
          <div className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
            {row.name || "N/A"}
          </div>
        </div>
      ),
    },

    {
      name: "Email / Provider",
      sortable: true,
      width: "250px",
      cell: (row) => (
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate max-w-[230px]">
            {row.email_address}
          </div>
          <div className="mt-1">{getProviderBadge(row.provider)}</div>
        </div>
      ),
    },

    {
      name: "Brand",
      sortable: true,
      width: "180px",
      cell: (row) => (
        <div className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
          {row.brand?.title || "N/A"}
        </div>
      ),
    },

    {
      name: "Status / Sync",
      sortable: true,
      width: "160px",
      cell: (row) => (
        <div>
          <div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                row.active
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {row.active ? "Active" : "Inactive"}
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {formatDate(row.last_synced_at)}
          </div>
        </div>
      ),
    },

    {
      name: "SMTP Config",
      sortable: false,
      width: "200px",
      cell: (row) => (
        <div className="text-xs">
          {row.smtp_host && (
            <>
              <div className="font-mono text-slate-900 dark:text-slate-100 truncate max-w-[180px]">
                {row.smtp_host}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                Port: {row.smtp_port} • {row.smtp_encryption?.toUpperCase()}
              </div>
            </>
          )}
          {!row.smtp_host && (
            <span className="text-slate-400 dark:text-slate-500">
              Not configured
            </span>
          )}
        </div>
      ),
    },

    {
      name: "MailBox",
      sortable: false,
      width: "200px",
      cell: (row) => (
        <>
          <button
            onClick={() => handleAction("mailbox", row)}
            className="btn btn-primary text-xs"
          >
            📧 Open Mailbox
          </button>
          {/* <DropdownItem
            onClick={() => handleAction("mailbox", row)}
            icon="📧"
            label="Open Mailbox"
          /> */}
        </>
      ),
    },

    {
      name: "Created",
      sortable: true,
      // width: "140px",
      cell: (row) => (
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {formatDate(row.created_at)}
        </div>
      ),
    },

    ...(hasAnyActionPermission
      ? [
          {
            name: "",
            right: true,
            allowOverflow: true,
            button: true,
            ignoreRowClick: true,
            width: "60px",
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
                  {canViewEmailConfig && (
                    <DropdownItem
                      onClick={() => handleAction("view", row)}
                      icon="⚙️"
                      label="View Config"
                    />
                  )}
                  {/* <DropdownItem
              onClick={() => handleAction("mailbox", row)}
              icon="📧"
              label="Open Mailbox"
            /> */}
                  <DropdownItem
                    onClick={() => handleAction("sync", row)}
                    icon="🔄"
                    label="Sync Emails"
                  />
                  <DropdownItem
                    onClick={() => handleAction("logs", row)}
                    icon="📊"
                    label="View Logs"
                  />
                  <DropdownItem
                    onClick={() => handleAction("assign_users", row)}
                    icon="👥"
                    label="Assign Users"
                  />
                  <DropdownDivider />
                  {canEditEmailConfig && (
                    <DropdownItem
                      onClick={() => handleAction("edit", row)}
                      icon="✏️"
                      label="Edit"
                    />
                  )}
                  {canDeleteEmailConfig && (
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

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Email Configurations</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage email accounts and SMTP/IMAP settings
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Box */}
            <SearchBox
              onSearch={handleSearch}
              placeholder="Search configs..."
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
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <BsArrowRepeat size={20} />
              )}{" "}
              Refresh
            </button>
            {canImportEmailConfig && (
              <button
                onClick={() => setActiveModal("import")}
                className="btn btn-black whitespace-nowrap"
              >
                <BsUpload size={18} />
                Import
              </button>
            )}

            {/* Add Button */}
            {canCreateEmailConfig && (
              <button
                onClick={() => setActiveModal("add")}
                className="btn btn-primary whitespace-nowrap"
              >
                <BsPlus size={20} />
                Add Config
              </button>
            )}
          </div>
        </div>

        {/* DataTable */}
        <div className="card overflow-hidden p-0">
          <DataTable
            className="tm-data-table"
            columns={columns}
            data={emailConfigs}
            progressPending={loading}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationDefaultPage={currentPage}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[10, 20, 30, 50]}
            onChangeRowsPerPage={setPerPage}
            onChangePage={setCurrentPage}
            dense
            highlightOnHover
            pointerOnHover
            responsive
            noDataComponent={
              <div className="w-full py-12 text-center dark:bg-slate-800">
                <div className="mb-2 text-lg text-gray-400 dark:text-slate-500">
                  📧
                </div>
                <div className="text-gray-500 dark:text-slate-300">
                  No email configurations found
                </div>
                <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                  Try adjusting your search terms
                </div>
              </div>
            }
          />
        </div>
      </div>
      {/* Modals */}
      <AddEmailConfigModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateEmailConfig}
        loading={submitting}
      />
      <EditEmailConfigModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedConfig(null);
        }}
        config={selectedConfig}
        onSubmit={(configData) =>
          handleUpdateEmailConfig(selectedConfig?.id, configData)
        }
        loading={submitting}
      />
      <DeleteEmailConfigModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedConfig(null);
        }}
        config={selectedConfig}
        onConfirm={() => handleDeleteEmailConfig(selectedConfig?.id)}
        loading={submitting}
      />
      <ViewEmailConfigModal
        open={activeModal === "view"}
        onClose={() => {
          setActiveModal(null);
          setSelectedConfig(null);
        }}
        config={selectedConfig}
      />
      <ViewEmailLogsModal
        open={activeModal === "logs"}
        onClose={() => {
          setActiveModal(null);
          setSelectedConfig(null);
        }}
        config={selectedConfig}
      />
      <SyncEmailsModal
        open={activeModal === "sync"}
        onClose={() => {
          setActiveModal(null);
          setSelectedConfig(null);
        }}
        config={selectedConfig}
        onSyncComplete={refresh}
      />
      <MailboxModal
        open={activeModal === "mailbox"}
        onClose={() => {
          setActiveModal(null);
          setSelectedConfig(null);
        }}
        config={selectedConfig}
      />
      <AssignUsersModal
        open={activeModal === "assignUsers"}
        onClose={() => {
          setActiveModal(null);
          setSelectedConfig(null);
        }}
        emailConfig={selectedConfig}
        onSuccess={refresh}
      />

      <ImportEmailConfigModal
        open={activeModal === "import"}
        onClose={() => {
          setActiveModal(null);
          setImportResults(null);
        }}
        onSubmit={handleImportEmailConfig}
        loading={submitting}
        importResults={importResults}
      />
    </>
  );
};

export default EmailConfigs;
