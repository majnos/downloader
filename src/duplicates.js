const db = require('./db/baseControl.js');


(async () => {
  const result = await db.getDuplicates('default')
  console.log(result)
  }
)()
