const base = require('./baseControl.js')
const log = require.main.require('./logger.js')

const defaultSet = 'default'

async function addMissing(details) {
    log.info('Adding new items ... (no message means no new item)')
    for (item of details) {
        let checkedItem = await base.findOne(defaultSet, {id: item.id})
        if ( checkedItem === null ) {
            base.insertOne(defaultSet, item)
            log.info('Inserting this json into the database:')
            log.info(JSON.stringify(item))
        } else {
            log.debug('Item already in database '+item.id)
        }
    }
}

module.exports.addMissing = addMissing