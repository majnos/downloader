const db = require('./db/baseControl.js');
const utils = require('./utils/dates.js');
var replace = `(tisice)|(chyne)|(kralupy)|(jesenik)|(skalice)|(horovice)|(neratovic)|
(sibirina)|(mnisek)|(stechovice)|(klicany)|(hostivice)|
(panenske-brezany)|(herink)|(kladno)|(jenec)|
(roztoky)|(obristvi)|(svemyslice)|(drahelcice)|(kvetnice)|(sibrina)`;
var re = new RegExp(replace,"g");
//const regex = '/(tisice)|(chyne)|(kralupy)/';

// const regions = require('./metadata/regions');


(async () => {
  let newest = await db.findAll('default', {
    timestamp: {
      $gte: await utils.getPreviousDate(days = 6)
  },
  href: {
    $not : re
  } 
})
  newest.forEach(item => console.log(item))
  }
)()
