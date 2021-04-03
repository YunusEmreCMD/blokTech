require('dotenv').config();

const PORT = process.env.PORT || 3000;
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const slug = require('slug')
const mongoose = require('mongoose');
const db = mongoose.connection
const app = express();
// const {
//   MongoClient
// } = require('mongodb');

mongoose.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

db.once('open', () => {
  console.log('Connected to MongoDB')
})

// let db = null;
// // functie om de database te connecten
// async function connectDB() {
//   const uri = process.env.DB_URI
//   // connectie maken met de database
//   const options = {
//     useUnifiedTopology: true
//   };
//   const client = new MongoClient(uri, options)
//   await client.connect();
//   db = await client.db(process.env.DB_NAME)
// }
// connectDB()
//   .then(() => {
//     // Het verbinden met de DB is gelukt
//     console.log('Feest!')
//   })
//   .catch(error => {
//     // Het verbinden met de DB is niet gelukt
//     console.log(error)
//   });

// Aangeven waar onze statishce files zich bevinden  
app.use(express.static('static'));

// Hiermee zorgen we ervoor dat we data kunnen versturen naar de DB
app.use(bodyParser.urlencoded({
  extended: false
}))

// Template engine opgeven
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const gebruikersSchema = new mongoose.Schema({
  soortGebruiker: {
    type: String,
    required: false
  },
  id: {
    type: String,
    required: false
  },
  naam: {
    type: String,
    required: false
  },
  biografie: {
    type: String,
    required: false
  },
  opleidingRichting: {
    type: String,
    required: false
  },
  schoolNaam: {
    type: String,
    required: false
  },
  opleidingsniveau: {
    type: String,
    required: false
  },
  leerjaar: {
    type: Number,
    required: false
  },
  functie: {
    type: String,
    required: false
  },
  dienstverband: {
    type: String,
    required: false
  }
});

const gebruikersCollection = mongoose.model('gebruikers', gebruikersSchema);

// Homepagina route -get
app.get('/' ,async (req, res) => {
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
    title: "Resultaten",
    results: gebruikers.length,
    layout: 'resultaten',
    gebruikers,
  });
});

// Reultaten pagina route - post - om data vanuit het formulier te versturen
app.post('/resultaten', async (req, res) => {

  // variabelen aan, filter opties
  const opleidingsFilter = req.body.opleidingsniveauFilter
  const dienstverbandFilter = req.body.dienstverbandFilter

  // lege object aan, standaard. Zoekt naar alles
  let query = {}

  // if else checkt waarop er wordt gefilterd, past query aan
  if (opleidingsFilter === 'Alle' && dienstverbandFilter === 'Alle') {
    query = {}
  } else if (opleidingsFilter === 'Alle') {
    query = { dienstverband: dienstverbandFilter }
  } else if (dienstverbandFilter === 'Alle') {
    query = { opleidingsniveau: opleidingsFilter }
  } else {
    query = { 
      opleidingsniveau: opleidingsFilter,
      dienstverband: dienstverbandFilter
    }
  }

  // query gebruiken, om in de db te zoeken
  // lean, omzetten naar json, anders is het een mongodb object
  const gebruikers = await gebruikersCollection.find(query).lean()

  res.render('resultaten', {
    title: "Resultaten",
    results: gebruikers.length,
    layout: 'resultaten',
    gebruikers,
    opleidingsFilter,
    dienstverbandFilter
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

// Reultaten pagina route - post - ik haal data op het formulier door de req.body te gebruiken
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