const base = require('./baseControl.js')

async function addMissing(details) {
    for (item of details) {
        let checkedItem = await base.findOne({id: item.id})
        if ( checkedItem === null ) {
            base.insertOne(item)
            base.findOne(item)
        } else {
            console.log('Item already in database '+item.id)
        }
    }
}

module.exports.addMissing = addMissing