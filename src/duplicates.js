const db = require('./db/baseControl.js');


(async () => {
  await db.removeDuplicates('default')
  console.log('done')
  }
)()
