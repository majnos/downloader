const fs = require('fs');
const util = require('util');
const cheerio = require('cheerio');
const readFile = util.promisify(fs.readFile);
const regions = require('./metadata/regions');
const getPages = require('./processor/getPages.js')
const parsePage = require('./processor/parsePage.js')

let url = regions['bezrealitky-flat'][1]['url'];

(async () => {
  console.log('start vole')
  let data = await getPages.getSourceFromUrl(url);
  let details = await parsePage.getStuff(data);
  console.log(details);
  }
)()