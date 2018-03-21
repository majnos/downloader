const db = require('./db/baseControl.js');


(async () => {
  await db.getDuplicates('default')
  console.log('done')
  }
)()
