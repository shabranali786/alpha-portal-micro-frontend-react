import { Fragment, useState, useEffect } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";

export default function EditRoleModal({
  open,
  onClose,
  role,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (role && open) {
      setFormData({
        name: role.name || "",
        description: role.description || "",
      });
    }
  }, [role, open]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Role name must be at least 2 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    // console.log("Updating role with permissions:", submitData);

    try {
      await onSubmit(submitData);
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-[9999]" onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="transform transition-all w-full max-w-lg overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Edit Role: {role?.name}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Update role information and permissions
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto"
                >
                  <div className="grid gap-6">
                    {/* Basic Information */}
                    <div className="grid gap-4">
                      {/* Role Name */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                          Role Name{" "}
                          <span className="text-red-500 dark:text-red-300">
                            *
                          </span>
                        </label>
                        <input
                          className={`form-control  ${
                            errors.name ? "border-red-500" : ""
                          }`}
                          placeholder="e.g. Admin, Manager, Staff"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                        />
                        {errors.name && (
                          <span className="text-xs text-red-500 dark:text-red-300">
                            {errors.name}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-200">
                          Description
                        </label>
                        <textarea
                          className="resize-none form-control"
                          placeholder="Role description..."
                          rows={3}
                          value={formData.description}
                          onChange={(e) =>
                            handleChange("description", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Permissions Section */}
                    {/* <div className="border-t border-gray-200 dark:border-slate-700/60 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-4">
                        Permissions ({permissions.length} available)
                      </h3>

                      {loadingPermissions ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full size-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="text-gray-600 dark:text-slate-400 mt-2">
                            Loading permissions...
                          </p>
                        </div>
                      ) : permissions.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-slate-700/60 rounded-lg">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200 dark:border-slate-700/60 sticky top-0">
                              <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-slate-300">
                                  Select
                                </th>
                                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-slate-300">
                                  Permission Name
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {permissions.map((permission) => (
                                <tr
                                  key={permission.id}
                                  className="border-b border-gray-100 hover:bg-gray-50 dark:bg-slate-900/40"
                                >
                                  <td className="py-3 px-4">
                                    <input
                                      type="checkbox"
                                      checked={isPermissionSelected(
                                        permission.name
                                      )}
                                      onChange={() =>
                                        handlePermissionChange(permission.name)
                                      }
                                      className="size-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                  </td>
                                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-slate-100">
                                    {permission.name}
                                    {permission.description && (
                                      <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                        {permission.description}
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                          No permissions available
                        </div>
                      )}

           
                      {selectedPermissions.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                            Selected: {selectedPermissions.length} permissions
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {selectedPermissions.map((permission, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div> */}
                  </div>
                </form>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    className="btn btn-black"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Role"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
