"use client";

import React, { useEffect, useState } from "react";

interface WebhookModalProps {
  open: boolean;
  onClose: () => void;
}

const WebhookModal: React.FC<WebhookModalProps> = ({ open, onClose }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (open) {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("webhookUrl") || ""
          : "";
      setUrl(stored);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    try {
      if (typeof window !== "undefined")
        localStorage.setItem("webhookUrl", url);
    } catch (err) {
      console.error("Could not save webhook URL", err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-[#0b1220]  text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg mb-3">Webhook configuration</h3>

          <label className="text-sm text-gray-500">Webhook URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full mt-2 p-2 rounded bg-transparent border border-gray-700 text-sm placeholder-gray-500 outline-none"
            placeholder="https://example.com/webhook"
          />

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-800 text-sm delete-button"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 rounded text-sm delete-button bg-teal-500 hover:bg-teal-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookModal;
