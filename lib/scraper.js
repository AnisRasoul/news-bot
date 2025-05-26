const Parser = require('rss-parser');

const WEBSITE_RSS_URL = "https://rss.app/feeds/QGia0F4BpK6KrVxB.xml";

async function fetchNews() {
    const parser = new Parser();
    const feed = await parser.parseURL(WEBSITE_RSS_URL);
    return feed.items.map(item => ({
        title: item.title,
        link: item.link,
        date: item.pubDate || item.isoDate || '',
        resource: 'website'
    }));
}

async function fetchRssNews(rssUrl) {
    const parser = new Parser();
    const feed = await parser.parseURL(rssUrl);
    return feed.items.map(item => ({
        title: item.title,
        link: item.link,
        date: item.pubDate || item.isoDate || '',
        resource: 'rss'
    }));
}

module.exports = { fetchNews, fetchRssNews };
