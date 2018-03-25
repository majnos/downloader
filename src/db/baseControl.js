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
const DBNAME = 'myproject'

async function insertOne(selectSet, json) {
    try {
        log.debug('Inserting a '+JSON.stringify(json)+' into the collection: '+selectSet+' at ' + URL)
        const client = await MongoClient.connect(URL)
        const db = await client.db(DBNAME)
        let collection = await db.collection(selectSet)
        await collection.insertOne(json);
        await client.close()
    } catch (err) {
        log.debug(err)
    }
}

async function updateOne(selectSet, json){
  try {
    log.debug('Updating a '+JSON.stringify(json)+' into the collection: '+selectSet+' at ' + URL)
    const client = await MongoClient.connect(URL)
    const db = await client.db(DBNAME)
    let collection = await db.collection(selectSet)
    await collection.updateOne(
      {id: json.id},
      {$set: {"price": json.price,
              "timestamp": json.timestamp
             }
      }); // ADD tag updated to the record
    await client.close()
  } catch (err) {
    log.debug(err)
  }
}

async function findOne(selectSet, json) {
    try {
        log.debug('looking for: '+ JSON.stringify(json))
        const client = await MongoClient.connect(URL)
        const db = await client.db(DBNAME)
        let output = await db.collection(selectSet).find(json).next()
        await client.close()
        return output
    } catch (err) {
        log.debug(err)
    }
}

async function findAll(selectSet='default', json) {
    try {
        log.debug('looking for this subjson: '+ JSON.stringify(json))
        const client = await MongoClient.connect(URL)
        const db = await client.db(DBNAME)
        let cursor = await db.collection(selectSet).find(json)
        let out = []
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            log.debug(doc);
            out.push(doc)
          }
        await client.close()
        return out
    } catch (err) {
        log.debug(err)
    }
}

async function purgeSet(selectSet){
  try {
    const client = await MongoClient.connect(URL)
    const db = await client.db(DBNAME)
    await db.collection(selectSet).remove({})
    log.debug('Collection ' + selectSet + ' purged.' )
    await client.close()
  } catch (err) {
    log.debug(err)
  }
}

async function deleteOne(selectSet, id) {
    try {
        const client = await MongoClient.connect(URL)
        const db = await client.db(DBNAME)
        await db.orders.deleteOne( { "_id" : ObjectId(id) } );
        await client.close()
     } catch (e) {
        print(e)
     }
}


async function removeDuplicates(selectSet){
  const client = await MongoClient.connect(URL)
  const db = await client.db(DBNAME)
  let collection = await db.collection(selectSet)
  let cursor = await collection.aggregate([
    {$match: {
        id: { "$ne": '' },
        href: { "$ne": '' },
      }},
    {$group: {
        _id: { id: "$id"},
        dups: { "$addToSet": "$_id" },
        count: { "$sum": 1 }
      }},
    { $match: {
        count: { "$gt": 1 }    // Duplicates considered as count greater than one
      }}
  ])
  const docs = await cursor.toArray()
  console.log('dummy')
  await docs.map( doc =>
    {
      doc.dups.shift()
      collection.deleteOne({_id : {$in: doc.dups }})
    }
  )
}


// async function removeDuplicates(selectSet){
//   const client = await MongoClient.connect(URL)
//   const db = await client.db(DBNAME)
//   let collection = await db.collection(selectSet)
//   let cursor = await collection.aggregate([
//     {$match: {
//         id: {"$ne": ''}
//       }}
//       ])
//   const docs = await cursor.toArray()
//   console.log('dummy')
//   }


module.exports.insertOne = insertOne
module.exports.updateOne = updateOne
module.exports.findOne = findOne
module.exports.findAll = findAll
module.exports.deleteOne = deleteOne
module.exports.purgeSet = purgeSet
module.exports.removeDuplicates = removeDuplicates
