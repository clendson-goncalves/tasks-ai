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
      const envUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL || "";
      setUrl(envUrl);
    }
  }, [open]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Could not copy webhook URL", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-[#0b1220]  text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg mb-3">Webhook configuration</h3>

          <label className="text-sm text-gray-500">Webhook URL</label>
          <div className="w-full mt-2 p-2 rounded bg-transparent border border-gray-700 text-sm text-gray-200">
            <div className="break-words">
              {url || <span className="text-gray-500">Not configured</span>}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-800 text-sm delete-button"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded text-sm delete-button bg-teal-500 hover:bg-teal-700"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebhookModal;
