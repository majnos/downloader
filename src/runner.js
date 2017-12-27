const fs = require('fs')
const util = require('util')
const cheerio = require('cheerio')
const readFile = util.promisify(fs.readFile)
const regions = require('./metadata/regions')
const getPages = require('./processor/getPages.js')
const parsePage = require('./processor/parsePage.js')
const persistance = require('./db/persistanceLogic.js')
const db = require('./db/baseControl.js')
const utils = require('./utils/dates.js')


for (item of regions['bezrealitky']) {
  console.log(item.url + '\n')
}

(async () => {
  console.log('start vole')
  // db.purgeSet('new')
  // db.purgeSet('default')
  let subset = 'bezrealitky'
  for (item of regions[subset]) {
    let data = await getPages.getSourceFromUrl(item.url)
    let details = await parsePage.getStuff(data, subset)
    await persistance.addMissing(details)  
    // let newest = await db.findAll('default', { 
    //   timestamp: {
    //     $gte: await utils.getPreviousDate(days = 1)
    // }})
    // console.log(newest)
    console.log('sleeping for 10s')
    await utils.sleep(10000)
  }
  }
)()