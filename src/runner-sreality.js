const fs = require('fs')
const util = require('util')
const cheerio = require('cheerio')
const readFile = util.promisify(fs.readFile)
const regions = require('./metadata/regions.json')
// const getPages = require('./processor/getPages.js')
// const parsePage = require('./processor/parsePage.js')
const bezrealitky = require('./processor/bezrealitky/base.js');
const sreality = require('./processor/sreality/base.js');
const persistance = require('./db/persistanceLogic.js');
const db = require('./db/baseControl.js');
const utils = require('./utils/dates.js');


// for (item of regions['bezrealitky']) {
//   console.log(item.url + '\n')
// }

(async () => {
  console.log('start vole')

  subset = 'sreality'
  for (item of regions[subset]) {
    let data = await sreality.getPages.getSourceFromUrl(item.url)
    let details = await sreality.parsePage.getStuff(data, {provider: subset, region: item.name})
    await persistance.addMissing(details)  
    console.log('sleeping for 10s')
    await utils.sleep(10000)
  }
  }
)()