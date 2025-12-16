import { Fragment, useState, useRef } from "react";
import {
  Dialog,
  Transition,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import {
  BsUpload,
  BsFileEarmarkExcel,
  BsX,
  BsCloudUpload,
} from "react-icons/bs";

const ImportEmailConfigModal = ({
  open,
  onClose,
  onSubmit,
  loading,
  importResults,
}) => {
  const [file, setFile] = useState(null);
  const [domain, setDomain] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Allowed file types
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
  ];

  const allowedExtensions = [".xlsx", ".xls", ".csv"];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return "Please select a file";

    const extension = "." + file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return `Invalid file type. Allowed: ${allowedExtensions.join(", ")}`;
    }

    if (file.size > 5 * 1024 * 1024) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const error = validateFile(droppedFile);

      if (error) {
        setErrors({ file: error });
        return;
      }

      setFile(droppedFile);
      setErrors({});
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const error = validateFile(selectedFile);

      if (error) {
        setErrors({ file: error });
        return;
      }

      setFile(selectedFile);
      setErrors({});
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!file) {
      newErrors.file = "Please select a file to import";
    }

    if (!domain.trim()) {
      newErrors.domain = "Domain is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("domain", domain.trim());

    onSubmit(formData);
  };

  const handleClose = () => {
    setFile(null);
    setDomain("");
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog as="div" className="relative z-[9999]" onClose={() => {}}>
        {/* Backdrop */}
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
                <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <BsUpload className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-0">
                          Import Email Configs
                        </DialogTitle>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          Upload Excel/CSV file to bulk import
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      <BsX className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="px-6 py-5 max-h-[calc(90vh-200px)] overflow-y-auto space-y-5">
                    {/* Domain Input - Hide when results are shown */}
                    {!importResults && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Domain <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={domain}
                          onChange={(e) => {
                            setDomain(e.target.value);
                            if (errors.domain) {
                              setErrors({ ...errors, domain: null });
                            }
                          }}
                          placeholder="e.g., example.com"
                          className={`form-control ${
                            errors.domain
                              ? "border-red-500"
                              : "border-gray-300 dark:border-slate-600"
                          }`}
                        />
                        {errors.domain && (
                          <p className="mt-1.5 text-sm text-red-500">
                            {errors.domain}
                          </p>
                        )}
                      </div>
                    )}

                    {/* File Upload Area */}
                    {!importResults && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          File <span className="text-red-500">*</span>
                        </label>

                        {!file ? (
                          <div
                            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                              dragActive
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                                : errors.file
                                ? "border-red-400 bg-red-50 dark:bg-red-900/10"
                                : "border-slate-300 dark:border-slate-600 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".xlsx,.xls,.csv"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />

                            <div className="flex flex-col items-center">
                              <div
                                className={`mb-3 rounded-full p-3 ${
                                  dragActive
                                    ? "bg-primary-100 dark:bg-primary-800"
                                    : "bg-slate-100 dark:bg-slate-700"
                                }`}
                              >
                                <BsCloudUpload
                                  className={`h-8 w-8 ${
                                    dragActive
                                      ? "text-primary-600 dark:text-primary-400"
                                      : "text-slate-400 dark:text-slate-500"
                                  }`}
                                />
                              </div>

                              <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                {dragActive
                                  ? "Drop file here"
                                  : "Drag & drop file here"}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                or click to browse
                              </p>

                              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                                <BsFileEarmarkExcel className="h-4 w-4" />
                                <span>Supports: XLSX, XLS, CSV (Max 5MB)</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // File Preview
                          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-700/50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                  <BsFileEarmarkExcel className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate max-w-[250px]">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-red-500 dark:hover:bg-slate-600 transition-colors"
                              >
                                <BsX className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {errors.file && (
                          <p className="mt-1.5 text-sm text-red-500">
                            {errors.file}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Import Results */}
                    {importResults && (
                      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                          Import Results
                        </h4>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Brands Processed
                            </div>
                            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {importResults.total_brands_processed || 0}
                            </div>
                          </div>
                          <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Emails Inserted
                            </div>
                            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                              {importResults.total_emails_inserted || 0}
                            </div>
                          </div>
                          <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Brands Not Found
                            </div>
                            <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                              {importResults.total_brands_not_found || 0}
                            </div>
                          </div>
                          <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Rows Skipped
                            </div>
                            <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                              {importResults.total_rows_skipped || 0}
                            </div>
                          </div>
                        </div>

                        {/* Brands Not Found Details */}
                        {importResults.brands_not_found &&
                          importResults.brands_not_found.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                              <h5 className="text-xs font-semibold text-red-800 dark:text-red-300 mb-2">
                                Brands Not Found:
                              </h5>
                              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                {importResults.brands_not_found.map(
                                  (brand, index) => (
                                    <div
                                      key={index}
                                      className="text-xs text-red-700 dark:text-red-400 bg-white dark:bg-red-900/30 rounded p-2"
                                    >
                                      <div className="font-medium">
                                        {brand.normalized_domain}
                                      </div>
                                      <div className="text-red-600 dark:text-red-500 text-[11px]">
                                        {brand.reason}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Skipped Rows Details */}
                        {importResults.skipped_rows &&
                          importResults.skipped_rows.length > 0 && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                              <h5 className="text-xs font-semibold text-orange-800 dark:text-orange-300 mb-2">
                                Skipped Rows:
                              </h5>
                              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                {importResults.skipped_rows.map(
                                  (row, index) => (
                                    <div
                                      key={index}
                                      className="text-xs text-orange-700 dark:text-orange-400 bg-white dark:bg-orange-900/30 rounded p-2"
                                    >
                                      <div className="font-medium">
                                        Row {row.row_number}
                                      </div>
                                      <div className="text-orange-600 dark:text-orange-500 text-[11px]">
                                        {row.reason}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Success Message */}
                        {importResults.total_emails_inserted > 0 &&
                          importResults.total_brands_not_found === 0 &&
                          importResults.total_rows_skipped === 0 && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
                              <div className="text-sm font-medium text-green-800 dark:text-green-300">
                                ✓ Import completed successfully!
                              </div>
                            </div>
                          )}
                      </div>
                    )}

                    {/* Info Box */}
                    {!importResults && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                          📋 File Format Requirements
                        </h4>
                        <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                          <li>• First row should contain column headers</li>
                          <li>
                            • Required columns: email_address, smtp_host,
                            smtp_port
                          </li>
                          <li>
                            • Optional: smtp_username, smtp_password,
                            encryption
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4 flex items-center justify-end gap-3">
                    {importResults ? (
                      // Show only Close button when results are displayed
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleClose}
                      >
                        Close
                      </button>
                    ) : (
                      // Show normal form buttons when no results
                      <>
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
                          disabled={loading || !file || !domain.trim()}
                          className="btn btn-primary flex items-center gap-2"
                        >
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4"
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
                              <span>Importing...</span>
                            </>
                          ) : (
                            <>
                              <BsUpload className="h-4 w-4" />
                              <span>Import Configs</span>
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ImportEmailConfigModal;
