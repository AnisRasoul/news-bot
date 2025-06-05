const { fetchLMDWebsite, fetchLMDFacebook, fetchMIWebsite, fetchMIFacebook, fetchINGFacebook } = require('./lib/scraper');
const { loadOldNews, saveNews, findNewNews } = require('./lib/storage');
const { notifyTelegram } = require('./lib/telegram');
const express = require('express');

async function checkAndNotify() {
    try {
        console.log(`[${new Date().toISOString()}] Checking for news...`);
        const oldNews = loadOldNews();
        
        // Fetch news from all sources
        let allNews = [];
        
        try {
            const lmdWebsiteNews = await fetchLMDWebsite();
            allNews = allNews.concat(lmdWebsiteNews);
        } catch (err) {
            console.error(`[${new Date().toISOString()}] Error fetching LMD Website news:`, err);
        }
        
        try {
            const lmdFacebookNews = await fetchLMDFacebook();
            allNews = allNews.concat(lmdFacebookNews);
        } catch (err) {
            console.error(`[${new Date().toISOString()}] Error fetching LMD Facebook news:`, err);
        }
        
        try {
            const miWebsiteNews = await fetchMIWebsite();
            allNews = allNews.concat(miWebsiteNews);
        } catch (err) {
            console.error(`[${new Date().toISOString()}] Error fetching MI Website news:`, err);
        }
        
        try {
            const miFacebookNews = await fetchMIFacebook();
            allNews = allNews.concat(miFacebookNews);
        } catch (err) {
            console.error(`[${new Date().toISOString()}] Error fetching MI Facebook news:`, err);
        }
        
        try {
            const ingFacebookNews = await fetchINGFacebook();
            allNews = allNews.concat(ingFacebookNews);
        } catch (err) {
            console.error(`[${new Date().toISOString()}] Error fetching ING Facebook news:`, err);
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
                console.log(`[${new Date().toISOString()}] attemting to send notification: ${item.title}`);
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
setInterval(checkAndNotify, 2 * 60 * 60 * 1000);

// Minimal Express server to keep the bot alive
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('CS Univ Bot is running.');
});

app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Express server started on port ${PORT}`);
});