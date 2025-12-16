import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "ckeditor5/ckeditor5.css";
import { BsX, BsPaperclip, BsSend } from "react-icons/bs";

export default function EmailComposeBackUp({ lead, onClose, onSend }) {
  const [mailTo, setMailTo] = useState(lead?.email || "");
  const [mailCc, setMailCc] = useState("");
  const [mailBcc, setMailBcc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!body.trim() || !mailTo.trim()) return;

    const emailData = {
      to: mailTo,
      cc: mailCc,
      bcc: mailBcc,
      subject: subject || "(No Subject)",
      body: body,
      attachments: attachments,
    };

    onSend(emailData);
  };

  const editorConfiguration = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "numberedList",
        "bulletedList",
        "|",
        "link",
        "blockQuote",
        "|",
        "undo",
        "redo",
      ],
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
      ],
    },
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        openInNewTab: {
          mode: "manual",
          label: "Open in a new tab",
          attributes: {
            target: "_blank",
            rel: "noopener noreferrer",
          },
        },
      },
    },
    placeholder: "Type your message here...",
  };

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-slate-700/60 px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-900">
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
          New Message
        </h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors shadow-sm"
        >
          <BsX className="size-5" />
        </button>
      </div>

      {/* Compose Form */}
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900">
        <div className="space-y-5">
          {/* To Field */}
          <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-slate-700/50">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 w-16">
              To:
            </label>
            <input
              type="email"
              value={mailTo}
              onChange={(e) => setMailTo(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-gray-900 dark:text-slate-100 transition-all"
              placeholder="recipient@email.com"
            />
            <button
              onClick={() => setShowCc(!showCc)}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                showCc
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium"
                  : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
            >
              Cc
            </button>
            <button
              onClick={() => setShowBcc(!showBcc)}
              className={`px-2 py-0.5 text-xs rounded transition-colors ${
                showBcc
                  ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium"
                  : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
            >
              Bcc
            </button>
          </div>

          {/* CC Field */}
          {showCc && (
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-slate-700/50">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300 w-16">
                Cc:
              </label>
              <input
                type="email"
                value={mailCc}
                onChange={(e) => setMailCc(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-gray-900 dark:text-slate-100 transition-all"
                placeholder="cc@email.com"
              />
            </div>
          )}

          {/* BCC Field */}
          {showBcc && (
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-slate-700/50">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300 w-16">
                Bcc:
              </label>
              <input
                type="email"
                value={mailBcc}
                onChange={(e) => setMailBcc(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-gray-900 dark:text-slate-100 transition-all"
                placeholder="bcc@email.com"
              />
            </div>
          )}

          {/* Subject Field */}
          <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-slate-700/50">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 w-16">
              Subject:
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-gray-900 dark:text-slate-100 transition-all"
              placeholder="Email subject"
            />
          </div>

          {/* CKEditor */}
          <div className="ckeditor-wrapper rounded-lg border border-gray-300 dark:border-slate-600 p-1 bg-white dark:bg-slate-800 shadow-sm">
            <CKEditor
              editor={ClassicEditor}
              config={editorConfiguration}
              data={body}
              onChange={(event, editor) => {
                const data = editor.getData();
                setBody(data);
              }}
            />
          </div>

          {/* Attachments Display */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {attachments.map((attachment, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-blue-200 dark:border-slate-600 text-xs shadow-sm transition-all"
                >
                  <BsPaperclip className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-slate-100">
                      {attachment.name}
                    </div>
                    <div className="text-gray-500 dark:text-slate-500">
                      {attachment.size}
                    </div>
                  </div>
                  <button
                    onClick={() => removeAttachment(idx)}
                    className="ml-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full size-5 flex items-center justify-center"
                  >
                    <BsX className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 dark:border-slate-700/60 px-6 py-4 bg-gray-50 dark:bg-slate-900 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="file"
              id="new-mail-attachment"
              multiple
              onChange={handleFileAttachment}
              className="hidden"
            />
            <label
              htmlFor="new-mail-attachment"
              className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2"
            >
              <BsPaperclip className="size-4" />
              Attach File
            </label>
            {attachments.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-slate-500">
                {attachments.length}{" "}
                {attachments.length === 1 ? "file" : "files"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              Discard
            </button>
            <button onClick={handleSend} className="btn btn-primary">
              <BsSend className="size-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
