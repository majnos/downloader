const fs = require('fs');
const util = require('util');
const cheerio = require('cheerio');
const readFile = util.promisify(fs.readFile);
const regions = require('./metadata/regions');
const getPages = require('./processor/getPages.js')
const getSourceFromUrl = require('./processor/parsePage.js')

let url = regions['bezrealitky-flat'][0]['url'];
let page = getPages.getSourceFromUrl(url);
getSourceFromUrl.getStuff().then(data => {
    console.log(data);
});