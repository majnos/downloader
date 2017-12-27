const base = require('./baseControl.js')
const defaultSet = 'default'

async function addMissing(details) {
    for (item of details) {
        let checkedItem = await base.findOne(defaultSet, {id: item.id})
        if ( checkedItem === null ) {
            base.insertOne(defaultSet, item)
        } else {
            console.log('Item already in database '+item.id)
        }
    }
}

module.exports.addMissing = addMissing