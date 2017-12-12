const base = require('./baseControl.js')
const defaultSet = 'default'
const newSet = 'new'  

async function addMissing(details) {
    for (item of details) {
        let checkedItem = await base.findOne(defaultSet, {id: item.id})
        if ( checkedItem === null ) {
            base.insertOne(defaultSet, item)
            base.insertOne(newSet, item)            
            base.findOne(defaultSet, item)
        } else {
            console.log('Item already in database '+item.id)
        }
    }
}

module.exports.addMissing = addMissing