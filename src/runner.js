const fs = require('fs')
const util = require('util')
const cheerio = require('cheerio')
const readFile = util.promisify(fs.readFile)
const regions = require('./metadata/regions')
const getPages = require('./processor/getPages.js')
const parsePage = require('./processor/parsePage.js')
const persistance = require('./db/persistanceLogic.js')
const db = require('./db/baseControl.js')


// let url = regions['bezrealitky-flat'][0]['url'];

for (item of regions['bezrealitky-flat']) {
  console.log(item.url + '\n')
}

(async () => {
  console.log('start vole')
  // db.purgeSet('new')
  // db.purgeSet('default')
  for (item of regions['bezrealitky-flat']) {
    let data = await getPages.getSourceFromUrl(item.url)
    let details = await parsePage.getStuff(data)
    await persistance.addMissing(details)  
    let newest = await db.findAll('new')
    console.log(newest)
  }
  }
)()