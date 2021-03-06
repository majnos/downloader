const regions = require('./metadata/regions.json')
const idnes = require('./processor/idnes/base.js');
const persistance = require('./db/persistanceLogic.js');
const utils = require('./utils/dates.js');
const log = require.main.require('./logger.js');
const reader = require('./utils/os.js');

(async () => {
  console.log('start vole - idnes')

  subset = 'idnes'
  for (item of regions[subset]) {
    console.log(`Scraping region: ${JSON.stringify(item)} and subset: ${subset}`)
    let data = await idnes.getPages.getSourceFromUrl(item.url)
    if (data === undefined) {
        console.log('No data found')
        continue
    }
    console.log(data)
    // let data = await reader.readFile('new-idnes.html')
    let details = await idnes.parsePage.getStuff(data, {provider: subset, region: item.name})
    // await persistance.addMissing(details)  
    console.log('sleeping for 1s')
    await utils.sleep(1000)
    }
  }
)()