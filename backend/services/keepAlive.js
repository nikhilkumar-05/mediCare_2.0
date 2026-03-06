/**
 * Keep-Alive Bot
 * -------------
 * Pings this server's /api/health endpoint every 14 minutes so that
 * Render.com's free-tier does not spin the service down due to inactivity
 * (Render spins down after 15 minutes of no requests).
 *
 * The bot only activates when RENDER_EXTERNAL_URL is present in the environment,
 * which Render sets automatically. In local development this is a no-op.
 */

const keepAlive = () => {
    const url = process.env.RENDER_EXTERNAL_URL;

    if (!url) {
        console.log('[KeepAlive] RENDER_EXTERNAL_URL not set – bot inactive (local dev mode).');
        return;
    }

    const healthUrl = `${url}/api/health`;
    const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

    const ping = async () => {
        try {
            const { default: fetch } = await import('node-fetch');
            const res = await fetch(healthUrl);
            const data = await res.json();
            console.log(`[KeepAlive] Ping successful at ${new Date().toISOString()} →`, data.message);
        } catch (err) {
            console.error(`[KeepAlive] Ping failed at ${new Date().toISOString()} →`, err.message);
        }
    };

    // First ping after 1 minute (give server time to fully start)
    setTimeout(() => {
        ping();
        setInterval(ping, INTERVAL_MS);
    }, 60 * 1000);

    console.log(`[KeepAlive] Bot started – will ping ${healthUrl} every 14 minutes.`);
};

module.exports = keepAlive;
