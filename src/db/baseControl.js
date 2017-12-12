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
        console.log('Connecting to server' + url)
        let db = await MongoClient.connect(url)
        console.log('Successfuly connected to the server') 
        return db
    } catch (err) {
        console.log(err)
    }
}

async function insertOne(selectSet, json) {
    try {
        console.log('Inserting a '+json+' into the collection: '+selectSet+' at ' + URL)
        const db = await connect(URL)
        await db.collection(selectSet).insertOne(json);
        await db.close()
    } catch (err) {
        await db.close()        
        console.log(err)
    }
}

async function findOne(selectSet, json) {
    try {
        console.log('looking for: '+ json)
        const db = await connect(URL)
        let collection = db.collection(selectSet)
        let output = await collection.find(json).next()
        await db.close()        
        console.log('returning: '+output)
        return output
    } catch (err) {
        await db.close()        
        console.log(err)    
    }
}

async function findAll(selectSet, json) {
    try {
        console.log('looking for this subjson: '+json)
        const db = await connect(URL)
        let cursor = db.collection(selectSet).find(json)
        let out = []
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            console.log(doc);
            out.push(doc)
          }
        await db.close()   
        return out             
    } catch (err) {
        // await db.close()        
        console.log(err)
    }
}

async function purgeSet(selectSet){
    const db = await connect(URL)
    await db.collection(selectSet).remove({})
    console.log('Collection ' + selectSet + ' purged.' )
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

// (async () => {
//     console.log('start pico vole pico')
//     await insertOne('new', {text: 'ahojhele'})
//     //
//     await purgeSet('new')
//     await findAll('new')

//     // let testik = await findAll(
//     //     {}
//     // )    
//     console.log('done pico')
//     })()

module.exports.insertOne = insertOne
module.exports.findOne = findOne
module.exports.findAll = findAll
module.exports.deleteOne = deleteOne
module.exports.purgeSet = purgeSet
