const db = require('./db/baseControl.js');
const utils = require('./utils/dates.js');
const regions = require('./metadata/regions');

(async () => {
  console.log('start vole')
  let subset = 'bezrealitky'
    let newest = await db.findAll('default', { 
      timestamp: {
        $gte: await utils.getPreviousDate(days = 1)
    }})
    console.log(newest)
    // console.log('start vole')
    // let subset = 'bezrealitky'
    // let newest = await db.findAll('default', {})
    // console.log(newest)  
  }
)()