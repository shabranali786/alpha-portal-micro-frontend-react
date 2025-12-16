import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BsArrowLeft, BsPlus, BsGripVertical, BsTrash } from "react-icons/bs";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "ckeditor5/ckeditor5.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import apiAxios from "@crm/shared/api/ApiAxios";
import ApiRequest from "@crm/shared/api/ApiRequest";
import OfficeLetterPreview from "./components/OfficeLetterPreview";
import InvoiceSearchSelectWithData from "./components/InvoiceSearchSelectWithData";

const AddOfficeLetter = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    invoice_id: "",
    serial_number: "",
    mark: "",
    client_name: "",
    address: "",
    deadline: "",
    our_email: "",
    heading: "NONFINAL OFFICE ACTION",
    main_heading: "Office Action About Applicant's Trademark Application",
  });

  // Selected invoice details for preview
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Paragraphs state
  const [paragraphs, setParagraphs] = useState([
    {
      id: `para-${Date.now()}`,
      title: "",
      description: "",
      order_no: 1,
      is_table_required: false,
      is_table_required_with_pricing: false,
    },
  ]);

  // Handle form field changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle invoice selection
  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setFormData((prev) => ({
      ...prev,
      invoice_id: invoice?.id || "",
      client_name:
        invoice?.lead?.name || invoice?.lead_email || prev.client_name,
      our_email: invoice?.lead_email || prev.our_email,
    }));
    if (errors.invoice_id) {
      setErrors((prev) => ({ ...prev, invoice_id: "" }));
    }
  };

  // Add new paragraph
  const addParagraph = () => {
    const newParagraph = {
      id: `para-${Date.now()}`,
      title: "",
      description: "",
      order_no: paragraphs.length + 1,
      is_table_required: false,
      is_table_required_with_pricing: false,
    };
    setParagraphs([...paragraphs, newParagraph]);
  };

  // Remove paragraph
  const removeParagraph = (id) => {
    if (paragraphs.length === 1) {
      toast.error("At least one paragraph is required");
      return;
    }
    const filtered = paragraphs.filter((p) => p.id !== id);
    const reordered = filtered.map((p, index) => ({
      ...p,
      order_no: index + 1,
    }));
    setParagraphs(reordered);
  };

  // Update paragraph field
  const updateParagraph = (id, field, value) => {
    setParagraphs((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  // Handle drag end for reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(paragraphs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reordered = items.map((item, index) => ({
      ...item,
      order_no: index + 1,
    }));

    setParagraphs(reordered);
  };

  // Validate form - Only invoice is required
  const validateForm = () => {
    const newErrors = {};

    if (!formData.invoice_id) {
      newErrors.invoice_id = "Invoice is required";
    }

    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please select an invoice");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        paragraphs: paragraphs.map((p) => ({
          title: p.title || null,
          description: p.description,
          order_no: p.order_no,
          is_table_required: p.is_table_required,
          is_table_required_with_pricing: p.is_table_required_with_pricing,
        })),
      };

      await apiAxios.post(ApiRequest.officeLetters.create, payload);
      toast.success("Office letter created successfully!");
      navigate("/office-letters");
    } catch (error) {
      console.error("Error creating office letter:", error);
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          toast.error(`${key}: ${serverErrors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create office letter"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Build preview data
  const previewData = {
    ...formData,
    paragraphs: paragraphs.map((p) => ({
      ...p,
      is_table_required: p.is_table_required ? "1" : "0",
      is_table_required_with_pricing: p.is_table_required_with_pricing
        ? "1"
        : "0",
    })),
    invoice: selectedInvoice,
  };

  // Check if invoice has items
  const hasInvoiceItems = selectedInvoice?.invoice_items?.length > 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 dark:bg-slate-900/80 dark:border-slate-700/60 backdrop-blur mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/office-letters")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-slate-800/70 dark:text-slate-200"
              >
                <BsArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Create Office Letter</h1>
                <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                  Fill in the details to create a new office letter
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/office-letters")}
                className="btn btn-black"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="office-letter-form"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
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
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Office Letter"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Side - Form */}
          <div className="space-y-6">
            <form id="office-letter-form" onSubmit={handleSubmit}>
              {/* Invoice Selection Card */}
              <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Invoice Selection
                </h3>
                <InvoiceSearchSelectWithData
                  value={formData.invoice_id}
                  onChange={handleInvoiceSelect}
                  error={errors.invoice_id}
                />

                {/* Show invoice items summary if available */}
                {hasInvoiceItems && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 rounded-lg">
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Invoice Items ({selectedInvoice.invoice_items.length})
                    </div>
                    <div className="space-y-1">
                      {selectedInvoice.invoice_items.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="flex justify-between text-xs text-blue-700 dark:text-blue-300"
                        >
                          <span>{item.service}</span>
                          <span>
                            {item.qty} x ${item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Basic Information Card */}
              <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Serial Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. OL-2024-001"
                      value={formData.serial_number}
                      onChange={(e) =>
                        handleChange("serial_number", e.target.value)
                      }
                    />
                  </div>

                  {/* Mark */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Mark
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. MARK-001"
                      value={formData.mark}
                      onChange={(e) => handleChange("mark", e.target.value)}
                    />
                  </div>

                  {/* Client Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter client name"
                      value={formData.client_name}
                      onChange={(e) =>
                        handleChange("client_name", e.target.value)
                      }
                    />
                  </div>

                  {/* Our Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Our Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="contact@example.com"
                      value={formData.our_email}
                      onChange={(e) =>
                        handleChange("our_email", e.target.value)
                      }
                    />
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Deadline
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.deadline}
                      onChange={(e) => handleChange("deadline", e.target.value)}
                    />
                  </div>

                  {/* Address - Full Width */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Address
                    </label>
                    <textarea
                      rows={3}
                      className="form-control"
                      placeholder="Enter full address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      You can use HTML tags like &lt;br /&gt; for line breaks
                    </span>
                  </div>
                </div>
              </div>

              {/* Headings Card */}
              <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Letter Headings
                </h3>
                <div className="space-y-4">
                  {/* Main Heading */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Main Heading
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Office Action About Applicant's Trademark Application"
                      value={formData.main_heading}
                      onChange={(e) =>
                        handleChange("main_heading", e.target.value)
                      }
                    />
                  </div>

                  {/* Heading */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. NONFINAL OFFICE ACTION"
                      value={formData.heading}
                      onChange={(e) => handleChange("heading", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Paragraphs Card */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    Paragraphs
                  </h3>
                  <button
                    type="button"
                    onClick={addParagraph}
                    className="btn btn-primary btn-sm"
                  >
                    <BsPlus size={18} />
                    Add Paragraph
                  </button>
                </div>

                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                  Drag and drop to reorder paragraphs
                </p>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="paragraphs">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {paragraphs.map((paragraph, index) => (
                          <Draggable
                            key={paragraph.id}
                            draggableId={paragraph.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`border rounded-lg p-4 transition-all ${
                                  snapshot.isDragging
                                    ? "shadow-lg bg-blue-50 dark:bg-slate-800 border-blue-300 dark:border-blue-600"
                                    : "bg-gray-50 dark:bg-slate-800/60 border-gray-200 dark:border-slate-700"
                                }`}
                              >
                                {/* Paragraph Header */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded"
                                    >
                                      <BsGripVertical
                                        size={16}
                                        className="text-gray-400 dark:text-slate-500"
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                      Paragraph {index + 1}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeParagraph(paragraph.id)
                                    }
                                    className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                  >
                                    <BsTrash size={14} />
                                  </button>
                                </div>

                                {/* Paragraph Title */}
                                <div className="mb-3">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                    Title
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter paragraph title (optional)"
                                    value={paragraph.title}
                                    onChange={(e) =>
                                      updateParagraph(
                                        paragraph.id,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                {/* Paragraph Description - CKEditor */}
                                <div className="mb-3">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                    Description
                                  </label>
                                  <div className="prose-editor">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      data={paragraph.description}
                                      onChange={(event, editor) => {
                                        const data = editor.getData();
                                        updateParagraph(
                                          paragraph.id,
                                          "description",
                                          data
                                        );
                                      }}
                                      config={{
                                        toolbar: [
                                          "heading",
                                          "|",
                                          "bold",
                                          "italic",
                                          "underline",
                                          "|",
                                          "bulletedList",
                                          "numberedList",
                                          "|",
                                          "link",
                                          "|",
                                          "undo",
                                          "redo",
                                        ],
                                        placeholder:
                                          "Enter paragraph description...",
                                      }}
                                    />
                                  </div>
                                </div>

                                {/* Paragraph Options - Both checkboxes always visible */}
                                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-200 dark:border-slate-700">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="form-checkbox rounded text-blue-600 dark:bg-slate-700 dark:border-slate-600"
                                      checked={paragraph.is_table_required}
                                      onChange={(e) =>
                                        updateParagraph(
                                          paragraph.id,
                                          "is_table_required",
                                          e.target.checked
                                        )
                                      }
                                      disabled={!hasInvoiceItems}
                                    />
                                    <span
                                      className={`text-sm ${
                                        hasInvoiceItems
                                          ? "text-gray-700 dark:text-slate-300"
                                          : "text-gray-400 dark:text-slate-500"
                                      }`}
                                    >
                                      Show Table (Services)
                                    </span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="form-checkbox rounded text-blue-600 dark:bg-slate-700 dark:border-slate-600"
                                      checked={
                                        paragraph.is_table_required_with_pricing
                                      }
                                      onChange={(e) =>
                                        updateParagraph(
                                          paragraph.id,
                                          "is_table_required_with_pricing",
                                          e.target.checked
                                        )
                                      }
                                      disabled={!hasInvoiceItems}
                                    />
                                    <span
                                      className={`text-sm ${
                                        hasInvoiceItems
                                          ? "text-gray-700 dark:text-slate-300"
                                          : "text-gray-400 dark:text-slate-500"
                                      }`}
                                    >
                                      Include Pricing
                                    </span>
                                  </label>

                                  {!hasInvoiceItems && (
                                    <span className="text-xs text-amber-600 dark:text-amber-400">
                                      Select an invoice with items to enable
                                      tables
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </form>
          </div>

          {/* Right Side - Preview */}
          <div className="xl:sticky xl:top-24 xl:self-start">
            <div className="card p-0 overflow-hidden">
              <div className="bg-gray-100 dark:bg-slate-800 px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                  📄 Live Preview
                </h3>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <OfficeLetterPreview data={previewData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOfficeLetter;
