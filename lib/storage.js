const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'news_data.json');

function loadOldNews() {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    return [];
}

function saveNews(news) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(news, null, 2), 'utf8');
}

function findNewNews(oldNews, newNews) {
    const oldTitles = new Set(oldNews.map(n => n.title));
    return newNews.filter(n => !oldTitles.has(n.title));
}

module.exports = { loadOldNews, saveNews, findNewNews };
