import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";

import toast from "react-hot-toast";

import AddTeamModal from "./AddTeamModal";
import EditTeamModal from "./EditTeamModal";
import DeleteTeamModal from "./DeleteTeamModal";
import ViewTeamModal from "./ViewTeamModal";
import {
  CustomDropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownDivider,
  useDropdown,
} from "@crm/shared/components/CustomDropdown";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import { SearchBox } from "@crm/shared/components/SearchBox";
import { BsArrowRepeat, BsPlus, BsThreeDotsVertical } from "react-icons/bs";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { usePaginatedData } from "@crm/shared/hooks/usePaginatedData";
import { usePermission } from "@crm/shared/utils/permissions";

const Teams = () => {
  const canCreateTeam = usePermission(["team.create"]);
  const canEditTeam = usePermission(["team.edit"]);
  const canDeleteTeam = usePermission(["team.delete"]);
  const canViewTeam = usePermission(["team.show"]);

  const [activeModal, setActiveModal] = useState(null);

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    data: teams,
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
  } = usePaginatedData(ApiRequest.teams.list);

  const {
    openDropdown,
    dropdownPosition,
    handleDropdownToggle,
    closeDropdown,
  } = useDropdown();

  const handleAction = (action, row) => {
    // console.log(`[${action}]`, row);
    setSelectedTeam(row);

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

  const hasAnyActionPermission = canViewTeam || canEditTeam || canDeleteTeam;

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      width: "80px",
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title || "N/A",
      width: "250px",
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-medium text-gray-900 line-clamp-2 dark:text-slate-100">
            {row.title || "N/A"}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-slate-400">
            Unit: {row.unit?.title || "N/A"}
          </div>
        </div>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.description || "No description",
      sortable: true,
      cell: (row) => (
        <div
          className="text-sm text-gray-600 line-clamp-2 dark:text-slate-400"
          title={row.description}
        >
          {row.description || "No description available"}
        </div>
      ),
    },
    {
      name: "Users",
      selector: (row) => row.user?.length || 0,
      width: "100px",
      sortable: true,
      cell: (row) => (
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
          {row.user?.length || 0} users
        </span>
      ),
    },
    {
      name: "Brands",
      selector: (row) => row.team_brands?.length || 0,
      width: "120px",
      sortable: true,
      cell: (row) => (
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-emerald-900/30 dark:text-emerald-200">
          {row.team_brands?.length || 0} brands
        </span>
      ),
    },
    {
      name: "Created",
      selector: (row) => row.created_at,
      width: "120px",
      sortable: true,
      cell: (row) => (
        <div className="text-xs text-gray-500 dark:text-slate-400">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString()
            : "N/A"}
        </div>
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
                  {canViewTeam && (
                    <DropdownItem
                      onClick={() => handleAction("view", row)}
                      icon="👁️"
                      label="View"
                    />
                  )}

                  {canEditTeam && (
                    <DropdownItem
                      onClick={() => handleAction("edit", row)}
                      icon="✏️"
                      label="Edit"
                    />
                  )}

                  <DropdownDivider />

                  {canDeleteTeam && (
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

  const handleCreateTeam = async (teamData) => {
    setSubmitting(true);
    try {
      // console.log("Creating team:", teamData);
      const response = await apiAxios.post(ApiRequest.teams.create, teamData);
      // console.log("Team created:", response.data);

      toast.success("Team created successfully!");
      setActiveModal(null);
      refresh();
    } catch (error) {
      console.error("Error creating team:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to create team");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTeam = async (teamId, teamData) => {
    setSubmitting(true);
    try {
      const response = await apiAxios.post(
        ApiRequest.teams.update(teamId),
        teamData
      );
      // console.log("Team updated:", response.data);

      toast.success("Team updated successfully!");
      setActiveModal(null);
      setSelectedTeam(null);
      refresh();
    } catch (error) {
      console.error("Error updating team:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to update team");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    setSubmitting(true);
    try {
      await apiAxios.delete(ApiRequest.teams.delete(teamId));

      toast.success("Team deleted successfully!");
      setActiveModal(null);
      setSelectedTeam(null);
      refresh();
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error(error.response?.data?.message || "Failed to delete team");
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
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-slate-100">
            Teams Management
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Manage your teams, users, and brands
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <SearchBox
            onSearch={handleSearch}
            placeholder="Search Team"
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
                className="animate-spin size-4 mr-2"
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

          {/* Add Team Button */}
          {canCreateTeam && (
            <button
              onClick={() => setActiveModal("add")}
              className="btn btn-primary whitespace-nowrap"
            >
              <BsPlus size={20} /> Add Team
            </button>
          )}
        </div>
      </div>

      {/* Teams Table */}
      <div className="card overflow-hidden p-0">
        <DataTable
          className="tm-data-table"
          columns={columns}
          data={teams}
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
                :(
              </div>
              <div className="text-gray-500 dark:text-slate-300">
                No teams found
              </div>
              {searchTerm && (
                <div className="mt-1 text-sm text-gray-400 dark:text-slate-500">
                  Try adjusting your search terms
                </div>
              )}
            </div>
          }
        />
      </div>

      {/* Modals */}
      <AddTeamModal
        open={activeModal === "add"}
        onClose={() => setActiveModal(null)}
        onSubmit={handleCreateTeam}
        loading={submitting}
      />

      <EditTeamModal
        open={activeModal === "edit"}
        onClose={() => {
          setActiveModal(null);
          setSelectedTeam(null);
        }}
        team={selectedTeam}
        onSubmit={(teamData) => handleUpdateTeam(selectedTeam?.id, teamData)}
        loading={submitting}
      />

      <DeleteTeamModal
        open={activeModal === "delete"}
        onClose={() => {
          setActiveModal(null);
          setSelectedTeam(null);
        }}
        team={selectedTeam}
        onConfirm={() => handleDeleteTeam(selectedTeam?.id)}
        loading={submitting}
      />

      <ViewTeamModal
        open={activeModal === "view"}
        onClose={() => {
          setActiveModal(null);
          setSelectedTeam(null);
        }}
        team={selectedTeam}
      />
    </>
  );
};

export default Teams;
