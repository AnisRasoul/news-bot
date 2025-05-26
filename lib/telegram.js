const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHANNEL = '-1002547974013';

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// Send a testing message on startup
bot.sendMessage(TELEGRAM_CHANNEL, 'Testing connection to channel.', { disable_web_page_preview: true }).catch(() => { });

function getResourceStyle(resource) {
    switch (resource) {
        case 'website':
            return {
                icon: '🌐',
                label: 'Website'
            };
        case 'rss':
            return {
                icon: '📰',
                label: 'Facebook'
            };
        default:
            return {
                icon: '📢',
                label: 'Other'
            };
    }
}

async function notifyTelegram(newsItem) {
    // Determine resource type
    let resource = newsItem.resource || 'other';
    if (newsItem.source === 'website' || newsItem.link?.includes('cs.univ-batna2.dz')) {
        resource = 'website';
    } else if (newsItem.source === 'rss' || newsItem.link?.includes('rss.app')) {
        resource = 'rss';
    }

    const style = getResourceStyle(resource);

    const message =
        `<b>${style.icon} ${newsItem.title}</b>\n` +
        `<i>${newsItem.date}</i>\n\n` +
        `<a href="${newsItem.link}">🔗 Read more</a>\n\n` +
        `<b>Source:</b> ${style.label}`;

    await bot.sendMessage(
        TELEGRAM_CHANNEL,
        message,
        { parse_mode: 'HTML', disable_web_page_preview: false }
    );
}
notifyTelegram({ title: 'Test News', date: '2023-10-01', link: 'https://example.com' })

module.exports = { notifyTelegram };
