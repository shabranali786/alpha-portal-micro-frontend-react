import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

const defaultForm = {
  title: "",
  ip: "",
  description: "",
};

const EditIPModal = ({ open, onClose, onSubmit, ipRecord, loading }) => {
  const [formState, setFormState] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && ipRecord) {
      setFormState({
        title: ipRecord.title || "",
        ip: ipRecord.ip || "",
        description: ipRecord.description || "",
      });
      setErrors({});
    } else if (!open) {
      setFormState(defaultForm);
      setErrors({});
    }
  }, [open, ipRecord]);

  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formState.title.trim()) nextErrors.title = "Title is required";
    if (!formState.ip.trim()) nextErrors.ip = "IP is required";
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      title: formState.title.trim(),
      ip: formState.ip.trim(),
      description: formState.description.trim(),
    });
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
              <DialogPanel className="w-full max-w-md overflow-hidden rounded-2xl border border-transparent bg-white text-slate-900 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:text-slate-100">
                <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700/60">
                  <DialogTitle className="text-lg font-semibold">
                    Update IP
                  </DialogTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Adjust the details for this authorized IP.
                  </p>
                </div>

                <form
                  className="space-y-4 px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Title<span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={formState.title}
                      onChange={(event) =>
                        handleChange("title", event.target.value)
                      }
                      placeholder="e.g. Transworld HQ"
                      className={`form-control ${
                        errors.title
                          ? "border-rose-400 dark:border-rose-400"
                          : ""
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-xs text-rose-500">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      IP Address<span className="text-rose-500">*</span>
                    </label>
                    <input
                      value={formState.ip}
                      onChange={(event) =>
                        handleChange("ip", event.target.value)
                      }
                      placeholder="000.000.000.000"
                      className={`form-control ${
                        errors.ip ? "border-rose-400 dark:border-rose-400" : ""
                      }`}
                    />
                    {errors.ip && (
                      <p className="mt-1 text-xs text-rose-500">{errors.ip}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Description
                    </label>
                    <textarea
                      value={formState.description}
                      onChange={(event) =>
                        handleChange("description", event.target.value)
                      }
                      rows={3}
                      placeholder="Why are we approving this IP?"
                      className="form-control"
                    />
                  </div>
                </form>

                {/* Footer */}
                <div className="border-t border-slate-200 dark:border-slate-700/60 px-6 py-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-black"
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
                    {loading ? "Updating..." : "Update IP"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditIPModal;
