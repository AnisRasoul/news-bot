const { fetchNews, fetchRssNews } = require('./lib/scraper');
const { loadOldNews, saveNews, findNewNews } = require('./lib/storage');
const { notifyTelegram } = require('./lib/telegram');
const express = require('express');

const RSS_URL = process.env.RSS_URL;

async function checkAndNotify() {
    try {
        console.log(`[${new Date().toISOString()}] Checking for news...`);
        const oldNews = loadOldNews();
        const newNews = await fetchNews();
        let allNews = [...newNews];

        // Fetch RSS news if RSS_URL is set
        if (RSS_URL) {
            try {
                const rssNews = await fetchRssNews(RSS_URL);
                allNews = allNews.concat(rssNews);
            } catch (err) {
                console.error(`[${new Date().toISOString()}] Error fetching RSS news:`, err);
            }
        }

        const diff = findNewNews(oldNews, allNews);
        if (diff.length > 0) {
            console.log(`[${new Date().toISOString()}] Found ${diff.length} new news item(s). Sending notifications...`);
        } else {
            console.log(`[${new Date().toISOString()}] No new news found.`);
        }
        for (const item of diff) {
            try {
                await notifyTelegram(item);
                console.log(`[${new Date().toISOString()}] Sent notification: ${item.title}`);
            } catch (err) {
                console.error(`[${new Date().toISOString()}] Error sending Telegram notification:`, err);
            }
        }
        if (diff.length > 0) {
            saveNews(allNews);
            console.log(`[${new Date().toISOString()}] News data updated.`);
        }
    } catch (err) {
        console.error(`[${new Date().toISOString()}] General error in checkAndNotify:`, err);
    }
}

// Run every 30 minutes
checkAndNotify();
setInterval(checkAndNotify, 30 * 60 * 1000);

// Minimal Express server to keep the bot alive
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('CS Univ Bot is running.');
});

app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Express server started on port ${PORT}`);
});