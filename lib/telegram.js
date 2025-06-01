const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHANNEL = '-1002547974013';

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

function getResourceStyle(resource) {
    switch (resource) {
        case 'LMD_Website':
            return {
                icon: '🌐',
                label: 'LMD Website',
                announcement: '📢 LMD'
            };
        case 'LMD_Facebook':
            return {
                icon: '📘',
                label: 'LMD Facebook',
                announcement: '📢 LMD'
            };
        case 'MI_Website':
            return {
                icon: '🌐',
                label: 'MI Website',
                announcement: '📢 Math et informatique'
            };
        case 'MI_Facebook':
            return {
                icon: '📘',
                label: 'MI Facebook',
                announcement: '📢 Math et informatique'
            };
        case 'ING_Facebook':
            return {
                icon: '📘',
                label: 'ING Facebook',
                announcement: '📢 Ingenieur'
            };
        case 'website':
            return {
                icon: '🌐',
                label: 'Website',
                announcement: '📢 Other'
            };
        case 'rss':
            return {
                icon: '📰',
                label: 'Facebook',
                announcement: '📢 Other'
            };
        default:
            return {
                icon: '📢',
                label: 'Other',
                announcement: '📢 Other'
            };
    }
}

async function notifyTelegram(newsItem) {
    const currentTime = new Date();
    const newsDate = new Date(newsItem.date);
    const timeDifference = currentTime - newsDate;
    const hoursOld = timeDifference / (1000 * 60 * 60); 
    
    if (hoursOld > 8) {
        console.log(`Skipping old news: ${newsItem.title} (${hoursOld.toFixed(1)} hours old)`);
        return;
    }

    let resource = newsItem.resource || 'other';
    if (newsItem.source === 'website' || newsItem.link?.includes('cs.univ-batna2.dz')) {
        resource = 'website';
    } else if (newsItem.source === 'rss' || newsItem.link?.includes('rss.app')) {
        resource = 'rss';
    }

    const style = getResourceStyle(resource);

    const message =
        `${style.announcement}\n\n` +
        `<b>${style.icon} ${newsItem.title}</b>\n` +
        `<i>${newsItem.date}</i>\n\n` +
        `<p>${newsItem.description || 'No description available.'}</p>\n\n` +
        `<a href="${newsItem.link}">🔗 Read more</a>\n\n` +
        `<b>Source:</b> ${style.label}`;

    await bot.sendMessage(
        TELEGRAM_CHANNEL,
        message,
        { parse_mode: 'HTML', disable_web_page_preview: false }
    );
}

module.exports = { notifyTelegram };
