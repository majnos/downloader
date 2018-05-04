const base = require('./baseControl.js')
const log = require.main.require('./logger.js')

const defaultSet = 'default'

async function addMissing(details) {
    log.info('Adding new items ... (no message means no new item)')
    for (let item of details) {
        let checkedItem = await base.findOne(defaultSet, {id: item.id})
        // add price check
        if ( checkedItem === null ) {
            base.insertOne(defaultSet, item)
            log.info('Inserting this json into the database:')
            log.info(JSON.stringify(item))
        }
        if (checkedItem !== null) {
            if ( checkedItem.id === item.id && checkedItem.price !== item.price){
                base.updateOne(defaultSet, item)
                log.info('The price has changed, updating a new item inside database')
                log.info(JSON.stringify(item))
            } else {
                log.debug('Item already in database '+item.id)
            }
        }
        else {
            log.debug('should not get here')
        }
    }
}

module.exports.addMissing = addMissing
