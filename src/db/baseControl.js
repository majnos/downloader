const log = require.main.require('./logger.js')
const MongoClient = require('mongodb').MongoClient
// const assert = require('assert');
const TESTDATA =  {
                    id: '411640',
                    size: 'Prodej bytu 3+kk, 99 m²',
                    href: '/nemovitosti-byty-domy/411640-nabidka-prodej-bytu-pod-sokolovnou-praha',
                    price: '5.150.000 Kč',
                    rooms: '3+kk'
                }
// Connection URL
const URL = 'mongodb://localhost:27017/myproject'

async function connect(url) {
    try {
        log.debug('Connecting to server' + url)
        let db = await MongoClient.connect(url)
        log.debug('Successfuly connected to the server')
        return db
    } catch (err) {
        log.error(err)
    }
}

async function insertOne(selectSet, json) {
    try {
        log.debug('Inserting a '+JSON.stringify(json)+' into the collection: '+selectSet+' at ' + URL)
        const db = await connect(URL)
        await db.collection(selectSet).insertOne(json);
        await db.close()
    } catch (err) {
        await db.close()
        log.debug(err)
    }
}

async function findOne(selectSet, json) {
    try {
        log.debug('looking for: '+ JSON.stringify(json))
        const db = await connect(URL)
        let collection = db.collection(selectSet)
        let output = await collection.find(json).next()
        await db.close()
        return output
    } catch (err) {
        await db.close()
        log.debug(err)
    }
}

async function findAll(selectSet='default', json) {
    try {
        log.debug('looking for this subjson: '+ JSON.stringify(json))
        const db = await connect(URL)
        let cursor = db.collection(selectSet).find(json)
        let out = []
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            log.debug(doc);
            out.push(doc)
          }
        await db.close()
        return out
    } catch (err) {
        // await db.close()
        log.debug(err)
    }
}

async function purgeSet(selectSet){
    const db = await connect(URL)
    await db.collection(selectSet).remove({})
    log.debug('Collection ' + selectSet + ' purged.' )
    await db.close()
}

async function deleteOne(selectSet, id) {
    try {
        const db = await connect(URL)
        db.orders.deleteOne( { "_id" : ObjectId(id) } );
        await db.close()
     } catch (e) {
        await db.close()
        print(e);
     }
}

async function deleteOne(selectSet, id) {
    try {
        const db = await connect(URL)
        db.orders.deleteOne( { "_id" : ObjectId(id) } );
        await db.close()
     } catch (e) {
        await db.close()
        print(e);
     }
}

async function getDuplicates(selectSet){
  let duplicates = [];

  const db = await connect(URL)
  db.collection(selectSet).aggregate([
      { $match: {
          id: { "$ne": '' },
          href: { "$ne": ''},
          price: { "$ne": ''}// discard selection criteria
        }},
      { $group: {
          _id: { id: "$id", href: "$href", price: "$price"}, // can be grouped on multiple properties
          dups: { "$addToSet": "$_id" },
          count: { "$sum": 1 }
        }},
      { $match: {
          count: { "$gt": 1 }    // Duplicates considered as count greater than one
        }}
    ],
    {allowDiskUse: true}       // For faster processing if set is larger
  )               // You can display result until this and check duplicates
    .forEach(function(doc) {
      doc.dups.shift();      // First element skipped for deleting
      doc.dups.forEach( function(dupId){
          duplicates.push(dupId);   // Getting all duplicate ids
        }
      )
    })
}

module.exports.insertOne = insertOne
module.exports.findOne = findOne
module.exports.findAll = findAll
module.exports.deleteOne = deleteOne
module.exports.purgeSet = purgeSet
module.exports.getDuplicates = getDuplicates
