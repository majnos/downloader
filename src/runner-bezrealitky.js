const regions = require('./metadata/regions.json')
const bezrealitky = require('./processor/bezrealitky/base.js');
const persistance = require('./db/persistanceLogic.js');
const utils = require('./utils/dates.js');
const log = require.main.require('./logger.js');

(async () => {
  log.info('start vole - bezrealitky')
  let subset = 'bezrealitky'
  for (item of regions[subset]) {
    log.debug(`Scraping region: ${JSON.stringify(item)} and subset: ${subset}`)
    let data = await bezrealitky.getPages.getSourceFromUrl(item.url)
    if (data === undefined) {
      log.debug('No data found')
      continue
  }
    let details = await bezrealitky.parsePage.getStuff(data, {provider: subset, region: item.name})
    await persistance.addMissing(details)  
    log.debug('sleeping for 1s')
    await utils.sleep(1000)
  }

  }
)()