const db = require('./db/baseControl.js');
const utils = require('./utils/dates.js');
const regions = require('./metadata/regions');

(async () => {
  console.log('start vole')
  // db.purgeSet('new')
  // db.purgeSet('default')
  let subset = 'bezrealitky'
  for (item of regions[subset]) {
    let newest = await db.findAll('default', { 
      timestamp: {
        $gte: await utils.getPreviousDate(days = 1)
    }})
    console.log(newest)
  }
  }
)()