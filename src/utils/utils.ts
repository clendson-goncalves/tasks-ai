import { getSetting } from "../utils/supabase";

export interface Task {
    id: number;
    title: string;
    completed: boolean;
    notes?: string;
  }
  
  export const filterTasksByStatus = (tasks: Task[], filter: string) => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  };
  
  export const generateUniqueId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  export async function sendWebhookEvent(event: string, task: Task) {
      try {
        const now = Date.now();
        const key = `${event}:${task.id}`;
        if (!(globalThis as any).__webhookDedup) {
          (globalThis as any).__webhookDedup = new Map<string, number>();
        }
        const dedupMap: Map<string, number> = (globalThis as any).__webhookDedup;
        const last = dedupMap.get(key) ?? 0;
        if (now - last < 1000) {
          console.debug('Skipping duplicate webhook event', key);
          return;
        }
        dedupMap.set(key, now);
  const urlString = await getSetting("taskWebhookUrl");
  if (!urlString) return;

      let parsed: URL;
      try {
        parsed = new URL(urlString);
      } catch (err) {
        console.warn('Webhook URL is invalid, skipping webhook:', urlString);
        return;
      }
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        console.warn('Webhook URL must be http(s), skipping webhook:', urlString);
        return;
      }

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeout = controller ? setTimeout(() => controller.abort(), 5000) : undefined;

      try {
        await fetch(parsed.toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, task, timestamp: new Date().toISOString() }),
          signal: controller ? controller.signal : undefined,
        });
      } catch (err) {
        if (err && (err as any).name === 'AbortError') {
          console.debug('Webhook request aborted (timeout) for', urlString);
        } else {
          console.debug('Webhook request failed for', urlString, err);
        }
      } finally {
        if (timeout) clearTimeout(timeout);
      }
    } catch (err) {
      console.debug('Webhook helper unexpected error', err);
    }
  }
  