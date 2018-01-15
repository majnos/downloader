const fs = require('fs')
const util = require('util')
const cheerio = require('cheerio')
const readFile = util.promisify(fs.readFile)
const regions = require('./metadata/regions.json')
// const getPages = require('./processor/getPages.js')
// const parsePage = require('./processor/parsePage.js')
const realitymix = require('./processor/realitymix/base.js');
const persistance = require('./db/persistanceLogic.js');
const db = require('./db/baseControl.js');
const utils = require('./utils/dates.js');


// for (item of regions['realitymix']) {
//   console.log(item.url + '\n')
// }  

(async () => {
  console.log('start vole')

  subset = 'realitymix'
  for (item of regions[subset]) {
    console.log(`Scraping region: ${JSON.stringify(item)} and subset: ${subset}`)
    let data = await realitymix.getPages.getSourceFromUrl(item.url)
    if (data === undefined) {
        console.log('No data found')
        continue
    }
    // console.log(data)
    let details = await realitymix.parsePage.getStuff(data, {provider: subset, region: item.name})
    await persistance.addMissing(details)  
    console.log('sleeping for 10s')
    await utils.sleep(10000)
    }
  }
)()