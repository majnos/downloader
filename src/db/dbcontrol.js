const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

// Connection URL
const URL = 'mongodb://localhost:27017/myproject'

async function connect(url) {
    try {
        console.log('away' + url)
        let db = await MongoClient.connect(url)
        console.log('Successfuly connected to the server') 
        return db
    } catch (err) {
        console.log(err)
    }
}

async function test() {
    try {
        console.log('here:' + URL)
        const db = await connect(URL)
        
        // await db.collection('Movies').drop()
        await db.collection('Movies').insertMany([
            { name: 'Enter the Dragon' },
            { name: 'Ip Man' },
            { name: 'Kickboxer' }
            ]);
    
        // Don't `await`, instead get a cursor
        const cursor = db.collection('Movies').find();
        // Use `next()` and `await` to exhaust the cursor
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        console.log(doc.name);
        await db.close()
        }
    } catch (err) {
        console.log(err)
    }
}


async function insert() {
    let insertDocuments = function(db, callback) {
        // Get the documents collection
        let collection = db.collection('documents');
        // Insert some documents
        collection.insertMany([
          {a : 1}, {a : 2}, {a : 3}
        ], function(err, result) {
          assert.equal(err, null);
          assert.equal(3, result.result.n);
          assert.equal(3, result.ops.length);
          console.log("Inserted 3 documents into the collection");
          callback(result);
        });
      }
}
async function write2() {
    let MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

    // Connection URL
    let url = 'mongodb://localhost:27017/myproject';
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    insertDocuments(db, function() {
    db.close();
    });
    });
}

async function close() {
    db.close()
}


(async () => {
    console.log('start pico vole pico')
    let data = await test()
    }
  )()