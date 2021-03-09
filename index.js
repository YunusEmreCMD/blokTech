const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = 3000;


// Array voor dynamische content
// const gebruikers = [
//   {naam: "Yunus Emre Alkan", soortGebruiker: "Werkzoekende", opleidingsniveau: "Hbo", leerjaar: 2, functie: "Creative designer", dienstverband: "Stage"},
//   {naam: "Ali", soortGebruiker: "Werkzoekende", opleidingsniveau: "Universiteit", leerjaar: 3, functie: "Architect", dienstverband: "Stage"},
//   {naam: "Lisa", soortGebruiker: "Werkzoekende", opleidingsniveau: "Mbo", leerjaar: 1, functie: "Apotheek assistente", dienstverband: "Part-time"}
// ]

// DB Connectie testen
// console.log(process.env.TESTVAR);

let db = null;
// function connectDB
async function connectDB () {
  // get URI from .env file
  const uri = process.env.DB_URI
  // make connection to database
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options)
  await client.connect();
  db = await client.db(process.env.DB_NAME)
}
connectDB()
  .then(() => {
    // if succesfull connections is made, show a message
    console.log('Feest!')
  })
  .catch( error => {
    // if connnection is unsuccesful, show errors
    console.log(error)
  });

// let db = null;
// // function connectDB
// async function connectDB () {
//   // GET URI from .env file
//   const uri = process.env.DB_URI
//   //make connection to database
//   const options = { useUnifiedTopplogy: true };
//   const client = new MongoClient(uri, options)
//   await client.connect();
//   db = await client.db(process.env.DB_NAME)
// }

// connectDB()
//   .then(() => {
//     // succes
//     console.log('feest!');
//   })
//   .catch( error => {
//     // unsucces
//     console.log(error)
//   });

app.use(express.static('static'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', async (req,res) => {
  let gebruikers = {}
  gebruikers = await db.collection('gebruikers').find({},{sort: {name: 1}}).toArray();
  res.render('index', {title: "Dit zijn alle gebruikers", gebruikers});
});

  app.post('/', async (req, res) => {
    let gebruikers = {}
    gebruikers = await db.collection('gebruikers').find({}).toArray();
    res.render('index', {
      results: gebruikers.length,
      gebruikers: gebruiker
    })
    })

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

app.listen(3000, () => {
  console.log(`Express web app on localhost:3000`);
});
