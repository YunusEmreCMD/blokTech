const port = process.env.PORT || 3000;
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');

let db = null;
// functie om de database te connecten
async function connectDB () {
  const uri = process.env.DB_URI
  // connectie maken met de database
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options)
  await client.connect();
  db = await client.db(process.env.DB_NAME)
}
connectDB()
  .then(() => {
    // succes om te verbinden
    console.log('Feest!')
  })
  .catch( error => {
    // geen succes om te verbinden
    console.log(error)
  });

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

    app.get('/toevoegen', (req, res) => {
      res.render('toevoegen', {title: "yes"});
    });

app.use(function (req, res, next) {
  res.status(404).send("Sorry ik heb niks kunnen vinden");
});

app.listen(3000, () => {
  console.log(`Express web app on localhost:3000`);
});
