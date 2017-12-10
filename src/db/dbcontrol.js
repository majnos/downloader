const MongoClient = require('mongodb').MongoClient
const assert = require('assert');
const TESTDATA =  { 
                    id: '411640',
                    size: 'Prodej bytu 3+kk, 99 m²',
                    href: '/nemovitosti-byty-domy/411640-nabidka-prodej-bytu-pod-sokolovnou-praha',
                    price: '5.150.000 Kč',
                    rooms: '3+kk' 
                }
const COLLECTION = 'test'
// Connection URL
const URL = 'mongodb://localhost:27017/myproject'

async function connect(url) {
    try {
        console.log('Connectingto server' + url)
        let db = await MongoClient.connect(url)
        console.log('Successfuly connected to the server') 
        return db
    } catch (err) {
        console.log(err)
    }
}

async function insertOne(json) {
    try {
        console.log('Inserting a data into the collection: '+COLLECTION+' at ' + URL)
        const db = await connect(URL)
        await db.collection(COLLECTION).insertOne(json);
        await db.close()
    } catch (err) {
        await db.close()        
        console.log(err)
    }
}

async function findOne(json) {
    try {
        const db = await connect(URL)
        let collection = db.collection(COLLECTION)
        let output = await collection.find(json).next()
        await db.close()        
        console.log(output)
    } catch (err) {
        await db.close()        
        console.log(err)    
    }
}

async function findAll(subjson)     {
    try {
        const db = await connect(URL)
        let cursor = db.collection(COLLECTION).find(subjson)
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
            console.log(doc);
          }
        await db.close()                
    } catch (err) {
        await db.close()        
        console.log(err)
    }
}

async function deleteOne(id) {
    try {
        const db = await connect(URL)
        db.orders.deleteOne( { "_id" : ObjectId(id) } );
        await db.close()                        
     } catch (e) {
        await db.close()                        
        print(e);
     }
}

async function close() {
    db.close()
}

(async () => {
    console.log('start pico vole pico')
    await insertOne({text: 'ahojhele'})
    await findAll(
        {}
    )
    })()