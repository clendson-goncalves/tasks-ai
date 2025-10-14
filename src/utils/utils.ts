export interface Task {
    id: number;
    title: string;
    completed: boolean;
    notes?: string;
  }
  
  // filter tasks
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
  
  // Create unique ID timestamp based
  export const generateUniqueId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  // Send a webhook event if a webhook URL is configured.
  export async function sendWebhookEvent(event: string, task: Task) {
    try {
      const urlString = typeof window !== 'undefined'
        ? (localStorage.getItem('webhookUrl') || process.env.NEXT_PUBLIC_WEBHOOK_URL)
        : process.env.NEXT_PUBLIC_WEBHOOK_URL;

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

      // small timeout for webhook so it doesn't hang the app
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
        // network errors are expected occasionally; log at debug level and swallow
        // Avoid noisy logs for common 'Failed to fetch'
        if (err && (err as any).name === 'AbortError') {
          console.debug('Webhook request aborted (timeout) for', urlString);
        } else {
          console.debug('Webhook request failed for', urlString, err);
        }
      } finally {
        if (timeout) clearTimeout(timeout);
      }
    } catch (err) {
      // Any unexpected error should not break the app
      console.debug('Webhook helper unexpected error', err);
    }
  }
  