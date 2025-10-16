"use client";

import React, { useEffect, useState } from "react";
import { NotebookPen } from "lucide-react";

interface WebhookModalProps {
  open: boolean;
  onClose: () => void;
}

const WebhookModal: React.FC<WebhookModalProps> = ({ open, onClose }) => {
  const [taskWebhookUrl, setTaskWebhookUrl] = useState("");
  const [chatWebhookUrl, setChatWebhookUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const mod = await import("../utils/supabase");
        if (mod && typeof mod.getSetting === "function") {
          const [taskUrl, chatUrl] = await Promise.all([
            mod.getSetting("taskWebhookUrl"),
            mod.getSetting("chatWebhookUrl"),
          ]);
          setTaskWebhookUrl(taskUrl || "");
          setChatWebhookUrl(chatUrl || "");
        }
      } catch (err) {
        console.debug("Failed to load webhook URLs from DB", err);
        setTaskWebhookUrl("");
        setChatWebhookUrl("");
      }
    })();
  }, [open]);

  if (!open) return null;

  const handleSave = async () => {
    try {
      const mod = await import("../utils/supabase");
      if (mod && typeof mod.setSetting === "function") {
        await Promise.all([
          mod.setSetting("taskWebhookUrl", taskWebhookUrl),
          mod.setSetting("chatWebhookUrl", chatWebhookUrl),
        ]);
      }
    } catch (err) {
      console.debug("Failed to save webhook URLs to DB", err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full max-w-md mx-4">
        <div className="bg-[#0b1220] text-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg mb-6">Webhook configuration</h3>

          <div className="space-y-4">
            <div>
              <div className="flex"></div>
              <label className="text-sm text-gray-500">Task Webhook URL</label>
              <input
                type="text"
                value={taskWebhookUrl}
                onChange={(e) => setTaskWebhookUrl(e.target.value)}
                className="w-full mt-2 p-2 rounded bg-transparent border border-gray-700 text-sm placeholder-gray-500 outline-none"
                placeholder="https://example.com/task-webhook"
              />
              <p className="mt-1 text-xs text-gray-500">
                Used for task events like creation, updates, and deletion
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Chat Webhook URL</label>
              <input
                type="text"
                value={chatWebhookUrl}
                onChange={(e) => setChatWebhookUrl(e.target.value)}
                className="w-full mt-2 p-2 rounded bg-transparent border border-gray-700 text-sm placeholder-gray-500 outline-none"
                placeholder="https://example.com/chat-webhook"
              />
              <p className="mt-1 text-xs text-gray-500">
                Used for chat messages and responses
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-800 text-sm delete-button"
            >
              Close
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
