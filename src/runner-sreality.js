const regions = require('./metadata/regions.json')
const sreality = require('./processor/sreality/base.js');
const persistance = require('./db/persistanceLogic.js');
const utils = require('./utils/dates.js');
const log = require.main.require('./logger.js');

(async () => {
  log.info('start vole - sreality')

  subset = 'sreality'
  for (item of regions[subset]) {
    log.info(`Scraping region: ${JSON.stringify(item)} and subset: ${subset}`)
    let data = await sreality.getPages.getSourceFromUrl(item.url)
    if (data === undefined) {
        log.info('No data found')
        continue
    }
    let details = await sreality.parsePage.getStuff(data, {provider: subset, region: item.name}) 
    await persistance.addMissing(details)  
    log.debug('sleeping for 10s')
    await utils.sleep(10000)
    }
  }
)()