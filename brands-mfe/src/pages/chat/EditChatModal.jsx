import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";

export default function EditChatModal({
  open,
  onClose,
  chat,
  onSubmit,
  loading,
}) {
  const [formData, setFormData] = useState({
    title: "",
    chat_script: "",
    chat_url: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (chat && open) {
      setFormData({
        title: chat.title || "",
        chat_script: chat.chat_script || "",
        chat_url: chat.chat_url || "",
      });
    }
  }, [chat, open]);

  useEffect(() => {
    if (formData.chat_script) {
      const urlMatch = formData.chat_script.match(/src=["']([^"']+)["']/);
      if (urlMatch && urlMatch[1]) {
        setFormData((prev) => ({ ...prev, chat_url: urlMatch[1] }));
      }
    }
  }, [formData.chat_script]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Chat name is required";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Chat name must be at least 2 characters";
    }

    if (!formData.chat_script.trim()) {
      newErrors.chat_script = "Chat script is required";
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
      title: formData.title.trim(),
      chat_script: formData.chat_script.trim(),
      chat_url: formData.chat_url.trim(),
    };

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
              <DialogPanel className="transform transition-all w-full max-w-2xl overflow-hidden rounded-2xl border border-transparent bg-white text-gray-900 dark:text-slate-100 shadow-xl dark:border-slate-700/60 dark:bg-slate-900 dark:shadow-black/40">
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                    Edit Chat
                  </DialogTitle>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Update your chat widget script and configuration
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="px-6 py-5 max-h-[calc(90vh-150px)] overflow-y-auto"
                >
                  <div className="space-y-4">
                    {/* Chat Name */}
                    <div>
                      <label>
                        Chat Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`form-control ${
                          errors.title ? "border-red-500" : ""
                        }`}
                        placeholder="Enter chat name (e.g., tm-assured)"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        disabled={loading}
                      />
                      {errors.title && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.title}
                        </span>
                      )}
                    </div>

                    {/* Chat Script */}
                    <div>
                      <label>
                        Chat Script <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`form-control ${
                          errors.chat_script ? "border-red-500" : ""
                        }`}
                        placeholder="Paste chat script here"
                        rows={6}
                        value={formData.chat_script}
                        onChange={(e) =>
                          handleChange("chat_script", e.target.value)
                        }
                        disabled={loading}
                      />
                      {errors.chat_script && (
                        <span className="text-xs text-red-500 dark:text-red-400">
                          {errors.chat_script}
                        </span>
                      )}
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Paste the complete chat widget script tag
                      </p>
                    </div>

                    {/* Chat URL (Auto-extracted) */}
                    <div>
                      <label>Chat URL</label>
                      <input
                        className="form-control bg-gray-50 dark:bg-slate-800/60 cursor-not-allowed"
                        placeholder="Auto extracted from script"
                        value={formData.chat_url}
                        disabled={true}
                        readOnly
                      />
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        This field is automatically extracted from the chat
                        script
                      </p>
                    </div>
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
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Chat"}
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
