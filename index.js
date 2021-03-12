const PORT = process.env.PORT || 3000;
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const slug = require('slug')
const app = express();
const dotenv = require('dotenv').config();
const {
  MongoClient
} = require('mongodb');

let db = null;
// functie om de database te connecten
async function connectDB() {
  const uri = process.env.DB_URI
  // connectie maken met de database
  const options = {
    useUnifiedTopology: true
  };
  const client = new MongoClient(uri, options)
  await client.connect();
  db = await client.db(process.env.DB_NAME)
}
connectDB()
  .then(() => {
    // Het verbinden met de DB is gelukt
    console.log('Feest!')
  })
  .catch(error => {
    // Het verbinden met de DB is niet gelukt
    console.log(error)
  });

// Aangeven waar onze statishce files zich bevinden  
app.use(express.static('static'));

// Hiermee zorgen we ervoor dat we data kunnen versturen naar de DB
app.use(bodyParser.urlencoded({
  extended: false
}))

// Template engine opgeven
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Homepagina route -get
app.get('/', (req, res) => {
  res.render('home', {
    title: "JobDone",
  })
});

// Reultaten pagina route - get
app.get('/resultaten', async (req, res) => {
  let gebruikers = {}
  gebruikers = await db.collection('gebruikers').find({}, {
  }).toArray();
  res.render('resultaten', {
    title: "JobDone",
    layout: 'resultaten',
    gebruikers,
  });
});

// Reultaten pagina route - post - om data vanuit het formulier te versturen
app.post('/resultaten', async (req, res) => {
  let gebruikers = {}
  gebruikers = await db.collection('gebruikers').find({}).toArray();
  res.render('resultaten', {
    results: gebruikers.length,
    gebruikers: gebruikers
  })
})

// Toevoegen pagina route - get
app.get('/toevoegen', (req, res) => {
  let gebruikers = {}
  res.render('toevoegen', {
    title: "Gebruiker Toevoegen",
    gebruikers
  });
});

// Reultaten pagina route - post - ik haal data op het formulier door de req.body te gebruiker
app.post('/toevoegen', async (req, res) => {
  const id = slug(req.body.naam);
  const gebruikers = {
    "id": req.body.id,
    "naam": req.body.naam,
    "soortGebruiker": req.body.soortGebruiker,
    "biografie": req.body.biografie,
    "opleidingRichting": req.body.opleidingRichting,
    "schoolNaam": req.body.schoolNaam,
    "opleidingsniveau": req.body.opleidingsniveau,
    "leerjaar": req.body.leerjaar,
    "kwaliteiten": req.body.kwaliteiten,
    "functie": req.body.functie,
    "dienstverband": req.body.dienstverband
  };
  await db.collection('gebruikers').insertOne(gebruikers);
  res.render('ingevuldeGegevens', {
    title: req.body.naam + " je bent toegevoegd!",
    gebruikers
  })
});

// 404 route
app.use(function (req, res, next) {
  res.status(404).send("Sorry ik heb niks kunnen vinden");
});

// Geeft de port terug die gebruikt wordt
app.listen(PORT, () => {
  console.log(`Gebruikte poort: ${PORT}!`)
})
