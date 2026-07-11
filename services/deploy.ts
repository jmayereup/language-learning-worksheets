import { pb } from './pocketbase';

const REBUILD_ENDPOINT = '/api/rebuild';

/**
 * Trigger a Cloudflare Pages deployment by calling the server-side proxy.
 * The proxy validates the PocketBase admin auth token before forwarding
 * the request to the Cloudflare deploy hook, avoiding browser CORS issues.
 */
export const triggerRebuild = async () => {
    const token = pb.authStore.token;

    try {
        console.log('Triggering Cloudflare rebuild...');
        const response = await fetch(REBUILD_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: token } : {}),
            },
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.error || `Rebuild proxy failed: ${response.statusText}`);
        }

        console.log('Cloudflare rebuild triggered successfully');
        return true;
    } catch (error) {
        console.error('Failed to trigger Cloudflare rebuild:', error);
        return false;
    }
};
