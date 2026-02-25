/**
 * Trigger a Cloudflare Pages deployment via webhook
 */
export const triggerRebuild = async () => {
    const WEBHOOK_URL = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/9bcde703-70bb-4046-8794-fed92562fe0c';
    
    try {
        console.log('Triggering Cloudflare rebuild...');
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
        });
        
        if (!response.ok) {
            throw new Error(`Cloudflare trigger failed: ${response.statusText}`);
        }
        
        console.log('Cloudflare rebuild triggered successfully');
        return true;
    } catch (error) {
        console.error('Failed to trigger Cloudflare rebuild:', error);
        return false;
    }
};
