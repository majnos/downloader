const db = require('./db/baseControl.js');
const utils = require('./utils/dates.js');
const regions = require('./metadata/regions');

(async () => {
  let newest = await db.findAll('default', {
    region: /(domy)|(byt)/,
    timestamp: {
      $gte: await utils.getPreviousDate(days = 1)
  }})
  newest.forEach(item => console.log(item))
  }
)()


//  subset: { provider: /'Praha-Vychod-domy'/ },
