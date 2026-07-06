const Parser = require('rss-parser');
const parser = new Parser();
parser.parseURL('https://phys.org/rss-feed/earth-news/environment/').then(feed => {
  console.log(feed.title, feed.items.length);
}).catch(console.error);
