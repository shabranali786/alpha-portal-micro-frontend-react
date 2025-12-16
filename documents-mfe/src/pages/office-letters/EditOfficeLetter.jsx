import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BsArrowLeft, BsPlus, BsGripVertical, BsTrash } from "react-icons/bs";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "ckeditor5/ckeditor5.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import apiAxios from "../../api/ApiAxios";
import ApiRequest from "../../api/ApiRequest";
import OfficeLetterPreview from "./components/OfficeLetterPreview";

const EditOfficeLetter = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
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
    heading: "",
    main_heading: "",
  });

  // Selected invoice details for preview
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Paragraphs state
  const [paragraphs, setParagraphs] = useState([]);

  // Fetch office letter data
  useEffect(() => {
    const fetchOfficeLetter = async () => {
      setLoading(true);
      try {
        const response = await apiAxios.get(ApiRequest.officeLetters.show(id));
        const data = response.data?.data;

        if (!data) {
          toast.error("Office letter not found");
          navigate("/office-letters");
          return;
        }

        // Set form data
        setFormData({
          invoice_id: data.invoice_id || "",
          serial_number: data.serial_number || "",
          mark: data.mark || "",
          client_name: data.client_name || "",
          address: data.address || "",
          deadline: data.deadline ? data.deadline.split(" ")[0] : "",
          our_email: data.our_email || "",
          heading: data.heading || "",
          main_heading: data.main_heading || "",
        });

        // If invoice exists, fetch it with items
        if (data.invoice_id) {
          try {
            const invoiceResponse = await apiAxios.get(
              ApiRequest.invoices.show(data.invoice_id),
              {
                params: { with_items: true },
              }
            );
            if (invoiceResponse.data?.data) {
              setSelectedInvoice(invoiceResponse.data.data);
            } else {
              // Fallback to existing invoice data
              setSelectedInvoice(data.invoice);
            }
          } catch (invoiceError) {
            console.error("Error fetching invoice with items:", invoiceError);
            // Fallback to existing invoice data
            setSelectedInvoice(data.invoice);
          }
        }

        // Set paragraphs
        if (data.paragraphs && data.paragraphs.length > 0) {
          const formattedParagraphs = data.paragraphs
            .sort((a, b) => parseInt(a.order_no) - parseInt(b.order_no))
            .map((p, index) => ({
              id: p.id ? `para-${p.id}` : `para-${Date.now()}-${index}`,
              db_id: p.id,
              title: p.title || "",
              description: p.description || "",
              order_no: parseInt(p.order_no) || index + 1,
              is_table_required:
                p.is_table_required === "1" || p.is_table_required === true,
              is_table_required_with_pricing:
                p.is_table_required_with_pricing === "1" ||
                p.is_table_required_with_pricing === true,
            }));
          setParagraphs(formattedParagraphs);
        } else {
          setParagraphs([
            {
              id: `para-${Date.now()}`,
              title: "",
              description: "",
              order_no: 1,
              is_table_required: false,
              is_table_required_with_pricing: false,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching office letter:", error);
        toast.error(
          error.response?.data?.message || "Failed to load office letter"
        );
        navigate("/office-letters");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOfficeLetter();
    }
  }, [id, navigate]);

  // Handle form field changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
  const removeParagraph = (paragraphId) => {
    if (paragraphs.length === 1) {
      toast.error("At least one paragraph is required");
      return;
    }
    const filtered = paragraphs.filter((p) => p.id !== paragraphId);
    const reordered = filtered.map((p, index) => ({
      ...p,
      order_no: index + 1,
    }));
    setParagraphs(reordered);
  };

  // Update paragraph field
  const updateParagraph = (paragraphId, field, value) => {
    setParagraphs((prev) =>
      prev.map((p) => {
        if (p.id === paragraphId) {
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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const payload = {
        serial_number: formData.serial_number,
        mark: formData.mark,
        client_name: formData.client_name,
        address: formData.address,
        deadline: formData.deadline,
        our_email: formData.our_email,
        heading: formData.heading,
        main_heading: formData.main_heading,
        paragraphs: paragraphs.map((p) => ({
          title: p.title || null,
          description: p.description,
          order_no: p.order_no,
          is_table_required: p.is_table_required,
          is_table_required_with_pricing: p.is_table_required_with_pricing,
        })),
      };

      await apiAxios.post(ApiRequest.officeLetters.update(id), payload);
      toast.success("Office letter updated successfully!");
      navigate("/office-letters");
    } catch (error) {
      console.error("Error updating office letter:", error);
      if (error.response?.status === 500) {
        toast.error(
          "Server error. Please check the data format or contact administrator."
        );
      } else if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          toast.error(`${key}: ${serverErrors[key][0]}`);
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to update office letter"
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full size-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">
            Loading office letter...
          </p>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold">Edit Office Letter</h1>
                <p className="text-sm text-gray-600 mt-1 dark:text-slate-400">
                  Editing: {formData.serial_number || "N/A"}
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
                    Updating...
                  </>
                ) : (
                  "Update Office Letter"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Side - Form */}
          <div className="space-y-6">
            <form id="office-letter-form" onSubmit={handleSubmit}>
              {/* Invoice Info (Read-only) */}
              {selectedInvoice && (
                <div className="card p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                    Linked Invoice
                  </h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">
                          Invoice No:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-slate-100">
                          {selectedInvoice.invoice_no}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">
                          Amount:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-slate-100">
                          ${selectedInvoice.transaction_amount}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">
                          Email:
                        </span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-slate-100">
                          {selectedInvoice.lead_email}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-slate-400">
                          Status:
                        </span>
                        <span
                          className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                            selectedInvoice.transaction_status === "paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                          }`}
                        >
                          {selectedInvoice.transaction_status}
                        </span>
                      </div>
                    </div>

                    {/* Show invoice items summary if available */}
                    {hasInvoiceItems && (
                      <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700/40">
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
                </div>
              )}

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

                  {/* Address */}
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
                                      No invoice items available
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

export default EditOfficeLetter;
