const dateTime = require('node-datetime');

async function getDate() {
    let dt = dateTime.create()
    let formatted = dt.format('Y-m-d H:M:S')
    return formatted
}

module.exports.getDate = getDate