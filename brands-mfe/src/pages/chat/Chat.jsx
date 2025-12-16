import React, { useState } from "react";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import {
  CustomDropdown,
  DropdownItem,
  DropdownTrigger,
  useDropdown,
} from "../../components/CustomDropdown";
import { SearchBox } from "../../components/SearchBox";
import AddChatModal from "./AddChatModal";
import EditChatModal from "./EditChatModal";
import DeleteModal from "../../components/DeleteModal";
import ViewChatModal from "./ViewChatModal";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";
import {
  BsPlus,
  BsPencil,
  BsTrash,
  BsEye,
  BsCopy,
  BsCheck,
  BsChatDots,
} from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import { usePaginatedData } from "../../hooks/usePaginatedData";
import { usePermission } from "../../utils/permissions";

const Chat = () => {
  const canCreateChat = usePermission(["chat.create"]);
  const canEditChat = usePermission(["chat.edit"]);
  const canDeleteChat = usePermission(["chat.delete"]);
  const canViewChat = usePermission(["chat.show"]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  const {
    data: chats,
    loading,
    totalRows,
    currentPage,
    perPage,
    searchTerm,
    setCurrentPage,
    setPerPage,
    handleSearch,
    refresh,
  } = usePaginatedData(ApiRequest.chats.list);

  const handleAction = (action, row) => {
    setSelectedChat(row);
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

  const handleCopyScript = (script, id) => {
    const decodedScript = script.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    navigator.clipboard.writeText(decodedScript);
    setCopiedId(id);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns = [
    {
      name: "S.N",
      width: "70px",
      cell: (_row, index) => (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {(currentPage - 1) * perPage + index + 1}
        </span>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Chat Details",
      selector: (row) => row.title,
      sortable: true,
      minWidth: "280px",
      cell: (row) => (
        <div className="py-1">
          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
            <BsChatDots className="text-blue-500" />
            {row.title}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 text-wrap">
            {row.chat_url}
          </div>
        </div>
      ),
    },
    {
      name: "Associated Brands",
      selector: (row) => row.brands?.length || 0,
      sortable: true,
      width: "180px",
      cell: (row) => (
        <div className="text-sm">
          {row.brands && row.brands.length > 0 ? (
            <div>
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {row.brands.length}{" "}
                {row.brands.length === 1 ? "Brand" : "Brands"}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                {row.brands[0].title}
                {row.brands.length > 1 && ` +${row.brands.length - 1} more`}
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              No brands
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Chat Script",
      selector: (row) => row.chat_script,
      sortable: false,
      grow: 1,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <code className="text-xs text-slate-600 dark:text-slate-400 truncate block line-clamp-2 text-wrap">
            {row.chat_script?.substring(0, 50)}...
          </code>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyScript(row.chat_script, row.id);
            }}
            className="flex-shrink-0 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Copy script"
          >
            {copiedId === row.id ? (
              <BsCheck className="text-green-500 size-4" />
            ) : (
              <BsCopy className="text-slate-500 dark:text-slate-400 size-4" />
            )}
          </button>
        </div>
      ),
    },
    {
      name: "Created",
      selector: (row) => row.created_at,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <div className="text-xs text-slate-600 dark:text-slate-300">
          {new Date(row.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      name: "Actions",
      width: "100px",
      right: true,
      allowOverflow: true,
      button: true,
      ignoreRowClick: true,
      cell: (row) => (
        <div className="relative">
          <DropdownTrigger onClick={(e) => handleDropdownToggle(row.id, e)} />
          <CustomDropdown
            isOpen={openDropdown === row.id}
            onClose={closeDropdown}
            position={dropdownPosition}
          >
            {canViewChat && (
              <DropdownItem
                onClick={() => handleAction("view", row)}
                icon={<BsEye className="size-3.5" />}
                label="View"
              />
            )}
            {canEditChat && (
              <DropdownItem
                onClick={() => handleAction("edit", row)}
                icon={<BsPencil className="size-3.5" />}
                label="Edit"
              />
            )}
            {canDeleteChat && (
              <DropdownItem
                onClick={() => handleAction("delete", row)}
                icon={<BsTrash className="size-3.5" />}
                label="Delete"
                danger
              />
            )}
          </CustomDropdown>
        </div>
      ),
    },
  ];

  const handleCreateChat = async (chatData) => {
    setSubmitting(true);
    try {
      await apiAxios.post(ApiRequest.chats.create, chatData);
      toast.success("Chat created successfully!");
      setActiveModal(null);
      refresh();
    } catch (error) {
      console.error("Error creating chat:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create chat");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateChat = async (chatData) => {
    if (!selectedChat) return;

    setSubmitting(true);
    try {
      await apiAxios.post(ApiRequest.chats.update(selectedChat.id), chatData);
      toast.success("Chat updated successfully!");
      setActiveModal(null);
      setSelectedChat(null);
      refresh();
    } catch (error) {
      console.error("Error updating chat:", error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to update chat");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedChat) return;

    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.chats.delete(selectedChat.id));
      toast.success("Chat deleted successfully!");
      setActiveModal(null);
      setSelectedChat(null);
      refresh();
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error(error.response?.data?.message || "Failed to delete chat");
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chat Management</h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage your chat widgets and configurations
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search chats..."
            size="md"
            icon="search"
            className="w-full sm:w-72"
          />
          <button
            onClick={refresh}
            disabled={loading}
            className="btn btn-black whitespace-nowrap"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} />
            Refresh
          </button>
          {canCreateChat && (
            <button
              onClick={() => setActiveModal("add")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} /> Add Chat
            </button>
          )}
        </div>
      </div>

      {/* Stats Card */}
      {/* <div className="grid gap-4 md:grid-cols-1">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Total Chat Widgets
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                {totalRows || 0}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Active chat configurations
              </p>
            </div>
            <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-200">
              <BsChatDots className="size-8" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={chats || []}
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
                💬
              </div>
              <div className="text-gray-500 dark:text-slate-300">
                No chats found
              </div>
              {searchTerm && (
                <div className="mt-0.5 text-sm text-gray-400 dark:text-slate-500">
                  Try adjusting your search terms
                </div>
              )}
            </div>
          }
        />
      </div>

      {/* Modals */}
      <AddChatModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateChat}
        loading={submitting}
      />

      <EditChatModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedChat(null);
        }}
        chat={selectedChat}
        onSubmit={handleUpdateChat}
        loading={submitting}
      />

      <DeleteModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedChat(null);
        }}
        onConfirm={handleDeleteChat}
        loading={submitting}
        title="Delete Chat Widget"
        message={`Are you sure you want to delete "${selectedChat?.title}"? This action cannot be undone.`}
      />

      <ViewChatModal
        open={activeModal === "view"}
        chat={selectedChat}
        onClose={() => {
          setActiveModal(null);
          setSelectedChat(null);
        }}
      />
    </div>
  );
};

export default Chat;
