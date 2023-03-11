import express from "express"
// const bodyParser = require('body-parser'); //old way of importing.
import bodyParser from "body-parser"; //ES 6
import path from "path"; //for loading files from a path. serve bootstrap site for example.
import lodash, { some } from "lodash";
import { MongoClient, ObjectId } from "mongodb";

/**
 *  Example of using ES6 syntectic sugar to create Express JS server
 */
//mongodb+srv://monkey:3ClVr3J5HLsuu9w7@cluster0.cckieyd.mongodb.net
let connectionstring = 'mongodb+srv://monkey:3ClVr3J5HLsuu9w7@cluster0.cckieyd.mongodb.net';
connectionstring = "mongodb+srv://tanya:pwd@cluster0.lvm5st0.mongodb.net";
//let connectionstring = 'mongodb://localhost:27017';

class ExpressServer {
  constructor(hostname = process.env.LOCAL_HOST, port = process.env.DEFAULT_PORT2) {
    this.serverName = 'Express Server';
    this.hostname = hostname;
    this.port = port;

    //Auto Start Server
    this.initServer()

    //const cl = new MongoClient("mongodb://localhost:27017");
    //this.connectionstring = 'mongodb://localhost:27017';


  }

  initServer = () => {
    //Create Server
    this.server = express()

    //setup the view engine. for showing views on the website
    //by default, ejs is looking for a folder called 'views' in the root of the folder
    console.log(`${path.join(__dirname)}`);
    this.server.set("view engine", "ejs");

    // for parsing application/json
    this.server.use(bodyParser.json());
    // for parsing application/x-www-form-urlencoded - form data
    this.server.use(bodyParser.urlencoded({ extended: true }));

    // this.server.get('/user', (req, res)=> {
    //   res.send('Got a GET request at /user')
    //   // next()
    // })

    this.server.get('/', (req, res) => {
      const somecar = {
        "name": "Mach 5",
        "driver": "Speed Racer"
      }
      res.send(somecar)
      // next()
    })

    //here let's start putting some mongo db stuff
    this.server.get('/mongodb/helloworld', (req, res) => {

      async function run() {
        let cl = new MongoClient(connectionstring);
        try {
          await cl.connect();
          const dbs = cl.db("heroes");
          const coll = dbs.collection("hero_names");

          const cur = coll.find({}, {});

          let items = [];
          await cur.forEach(function (doc) {
            items.push(doc);
          });
          console.log(items);
          // res.end(JSON.stringify(items));
          let responseObject = {
            items: items
          }
          res.send(responseObject);

        } catch (err) {
          console.warn("ERROR: " + err);
          if (errCallback) errCallback(err);
        } finally {
          await cl.close();
        }
      }
      run().catch(console.dir);
    })

    //add some super hero
    this.server.get('/mongodb/addDrStrange', (req, res) => {

      async function run() {
        let cl = new MongoClient(connectionstring);
        try {
          await cl.connect();
          const dbs = cl.db("heroes");
          const coll = dbs.collection("hero_powers");

          //const rest = await coll.insertOne({"quote":"This is my quote."});
          //db.heroes.insertOne({hero:"Joker",name:"Unknown"})
          let resultOfDb = await coll.insertOne({ name: "Dr. Strange", power: "Sorcery"});

          console.log(resultOfDb);
          let responseObject = {
            resultOfDb: resultOfDb
          }
          res.send(responseObject);

        } catch (err) {
          console.warn("ERROR: " + err);
          if (errCallback) errCallback(err);
        } finally {
          await cl.close();
        }
      }
      run().catch(console.dir);
    })

    //update a hero
    this.server.get('/mongodb/updateSpiderman', (req, res) => {

      async function run() {
        let cl = new MongoClient(connectionstring);
        try {
          await cl.connect();
          const dbs = cl.db("heroes");
          const coll = dbs.collection("hero_powers");

          //const rest = await coll.insertOne({"quote":"This is my quote."});
          //db.heroes.insertOne({hero:"Joker",name:"Unknown"})
          let resultOfDb = await coll.updateOne(
            { name: "Spiderman" },
            { $set: { power: "Shoot webs" } }
          );

          console.log(resultOfDb);
          let responseObject = {
            resultOfDb: resultOfDb
          }
          res.send(responseObject);

        } catch (err) {
          console.warn("ERROR: " + err);
          if (errCallback) errCallback(err);
        } finally {
          await cl.close();
        }
      }
      run().catch(console.dir);
    })

    //add and delete hero

    this.server.get('/mongodb/deleteDrStrange', (req, res) => {
      console.log('delete with GET option')
      async function run() {
        let cl = new MongoClient(connectionstring);
        try {
          await cl.connect();
          const dbs = cl.db("heroes");
          const coll = dbs.collection("hero_powers");

          //const rest = await coll.insertOne({"quote":"This is my quote."});
          //db.heroes.insertOne({hero:"Joker",name:"Unknown"})
          let resultOfDb = await coll.deleteOne({ name: "Dr. Strange" });

          console.log(resultOfDb);
          let responseObject = {
            resultOfDb: resultOfDb
          }
          res.send(responseObject);

        } catch (err) {
          console.warn("ERROR: " + err);
          if (errCallback) errCallback(err);
        } finally {
          await cl.close();
        }
      }
      run().catch(console.dir);
    })

    this.server.post('/mongodb/addHero', (req, res) => {
      let tempHero = {
        name: req.body.name,
        power: req.body.power
      }

      console.log(`recieved hero is `);
      console.log(tempHero);

      async function run() {
        let cl = new MongoClient(connectionstring);
        try {
          await cl.connect();
          const dbs = cl.db("heroes");
          const coll = dbs.collection("hero_powers");
          let resultOfDb = await coll.insertOne(tempHero);

          console.log(resultOfDb);
          let responseObject = {
            resultOfDb: resultOfDb
          }
          res.send(responseObject);

        } catch (err) {
          console.warn("ERROR: " + err);
          if (errCallback) errCallback(err);
        } finally {
          await cl.close();
        }
      }
      run().catch(console.dir);
    })

    this.server.post('/mongodb/updateHero', (req, res) => {

      let tempHero = {
        name: req.body.name,
        power: req.body.power
      }

      console.log(`recieved hero is `);
      console.log(tempHero);

      async function run() {
        let cl = new MongoClient(connectionstring);
        try {
          await cl.connect();
          const dbs = cl.db("heroes");
          const coll = dbs.collection("hero_powers");

          let resultOfDb = await coll.updateOne(
            { name: tempHero.name },
            { $set: { power: tempHero.power } }
          );

          console.log(resultOfDb);
          let responseObject = {
            resultOfDb: resultOfDb
          }
          res.send(responseObject);

        } catch (err) {
          console.warn("ERROR: " + err);
          if (errCallback) errCallback(err);
        } finally {
          await cl.close();
        }
      }
      run().catch(console.dir);
    })

    this.server.post('/deleteHero', (req, res) => {

      //first step is get the id from the body

      console.log(req.body);

      let tempName = req.body.name;

      async function run() {

        console.log(`async deletehero has started`);

        let cl = new MongoClient(connectionstring);

        try {

          console.log(`about to try connect`);

          await cl.connect();

          //we need to get the database

          let db = cl.db("heroes");

          //we need to get the collection or table

          let collection = db.collection("hero_powers");

          let resultOfDelete = await collection.deleteOne(
            {
              "name": tempName
            });

          console.log(resultOfDelete);

          const responseObject = {

            "msg": "Got a POST request at /deleteHero",

            "result": resultOfDelete

          }

          //res.status(500).json(resultOBject)
          res.send(responseObject);
        }//end of try
        catch (err) {
          console.log(`error in try connect`);
          console.log(err);
        } //end of catch

      } //end of run

      run().catch(console.dir);

    }//end of delete endpoint
    );


    //Start Listening
    this.server.listen(this.port, (error) => {
      if (error)
        throw error;
      console.log(`${this.serverName} Started at http://${this.hostname}:${this.port}/`);
    })
  }
}

//EXPORT MODULE
module.exports = ExpressServer
