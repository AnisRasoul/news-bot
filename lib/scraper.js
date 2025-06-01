const Parser = require('rss-parser');


async function fetchLMDWebsite() {
    const parser = new Parser();
    const feed = await parser.parseURL(process.env.LMD_Website);
    return feed.items.map(item => ({
        title: item.title,
        link: item.link,
        date: item.pubDate || item.isoDate || '',
        resource: 'LMD_Website'
    }));
}

async function fetchLMDFacebook() {
    const parser = new Parser();
    const feed = await parser.parseURL(process.env.LMD_Facebook);
    return feed.items.map(item => ({
        title: item.title,
        link: item.link,
        date: item.pubDate || item.isoDate || '',
        resource: 'LMD_Facebook'
    }));
}

async function fetchMIWebsite() {
    const parser = new Parser();
    const feed = await parser.parseURL(process.env.MI_Website);
    return feed.items.map(item => ({
        title: item.title,
        link: item.link,
        date: item.pubDate || item.isoDate || '',
        resource: 'MI_Website'
    }));
}

async function fetchMIFacebook() {
    const parser = new Parser();
    const feed = await parser.parseURL(process.env.MI_Facebook);
    return feed.items.map(item => ({
        title: item.title,
        link: item.link,
        date: item.pubDate || item.isoDate || '',
        resource: 'MI_Facebook'
    }));
}

async function fetchINGFacebook() {
    const parser = new Parser();
    const feed = await parser.parseURL(process.env.ING_Facebook);
    return feed.items.map(item => ({
        title: item.title,
        link: item.link,
        date: item.pubDate || item.isoDate || '',
        resource: 'ING_Facebook'
    }));
}

module.exports = { fetchLMDWebsite, fetchLMDFacebook, fetchMIWebsite, fetchMIFacebook, fetchINGFacebook };
