const PORT = process.env.PORT || 3000;
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
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
      gebruikers: gebruikers
    })
    })


  app.post('/', async (req, res) => {
    // data from database
    let gebruikers = {}
    gebruikers = await db.collection('options').find({}).toArray()
    // filter criteria
    if (req.body.naam !== 'all') {
      gebruikers = gebruikers.filter(gebruiker => { return gebruiker.naam === req.body.naam })
    }
    if (req.body.dienstverband !== 'all') {
      gebruikers = gebruikers.filter(gebruiker => { return gebruiker.dienstverband <= req.body.dienstverband })
    }
    if (req.body.attendence !== 'all') {
      gebruikers = opleidingsniveau.filter(gebruiker => { return gebruiker.opleidingsniveau <= req.body.opleidingsniveau })
    }
    if (req.body.werkomgeving !== 'all') {
      gebruikers = gebruikers.filter(gebruiker => { return gebruikers.werkomgeving <= req.body.werkomgeving })
    }
    res.render('index', {
      results: gebruikers.length,
      gebruikers: gebruikers
    })
  })
  

  // app.get('/toevoegen', (req, res) => {
  //   res.render('toevoegen', {title: "yes"});
  // });

  //   app.post('/toevoegen', (req, res) => {
  //     const profiel = {};
  //     console.log(req.body.year);
  //     res.render('toevoegen', {title: "yes", profiel});
  //   });

    
    app.get('/profiel/toevoegen', (req, res) => {
      res.render('toevoegen', {title: "Add movie"});
    });

    app.post('/profiel/toevoegen', (req,res) => {
      const id = slug(req.body.name);
      const movie = {"id": "id", "name": req.body.name, "year": req.body.year, "categories": req.body.categories, "storyline": req.body.storyline};
      movies.push(movie);
      res.render('toegevoegd', {title: "Added a new movie", movie})
      console.log(req.body.year);
    });



app.use(function (req, res, next) {
  res.status(404).send("Sorry ik heb niks kunnen vinden");
});

app.listen(3000,) ====> app.listen(PORT,) {
  console.log(`Express web app on localhost:3000`);
});
