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

// const kwaliteiten = ["HTML", "CSS", "Illustrator", "Photoshop", "Javascript"];

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
    // succes om te verbinden
    console.log('Feest!')
  })
  .catch(error => {
    // geen succes om te verbinden
    console.log(error)
  });

app.use(express.static('static'));
app.use(bodyParser.urlencoded({
  extended: false
}))
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.get('/', (req, res) => {
  res.render('home', {
    title: "JobDone",
  })
});

app.get('/resultaten', async (req, res) => {
  let gebruikers = {}
  gebruikers = await db.collection('gebruikers').find({}, {
    sort: {
      name: 1
    }
  }).toArray();
  res.render('resultaten', {
    title: "JobDone",
    layout: 'resultaten',
    gebruikers,
  });
});

app.post('/resultaten', async (req, res) => {
  let gebruikers = {}
  gebruikers = await db.collection('gebruikers').find({}).toArray();
  res.render('resultaten', {
    results: gebruikers.length,
    gebruikers: gebruikers
  })
})

// app.post('/', async (req, res) => {
//   // data from database
//   let gebruikers = {}
//   gebruikers = await db.collection('options').find({}).toArray()
//   // filter criteria
//   if (req.body.naam !== 'all') {
//     gebruikers = gebruikers.filter(gebruiker => { return gebruiker.naam === req.body.naam })
//   }
//   if (req.body.dienstverband !== 'all') {
//     gebruikers = gebruikers.filter(gebruiker => { return gebruiker.dienstverband <= req.body.dienstverband })
//   }
//   if (req.body.attendence !== 'all') {
//     gebruikers = opleidingsniveau.filter(gebruiker => { return gebruiker.opleidingsniveau <= req.body.opleidingsniveau })
//   }
//   if (req.body.werkomgeving !== 'all') {
//     gebruikers = gebruikers.filter(gebruiker => { return gebruikers.werkomgeving <= req.body.werkomgeving })
//   }
//   res.render('resultaten', {
//     results: gebruikers.length,
//     gebruikers: gebruikers
//   })
// })

app.get('/toevoegen', (req, res) => {
  let gebruikers = {}
  res.render('toevoegen', {
    title: "Gebruiker Toevoegen",
    gebruikers
  });
});

app.post('/toevoegen', async (req, res) => {
  const id = slug(req.body.naam);
  const gebruikers = {
    "id": req.body.id,
    "naam": req.body.naam,
    "soortGebruiker": req.body.soortGebruiker,
    "opleidingRichting": req.body.opleidingRichting,
    "schoolNaam": req.body.schoolNaam,
    "opleidingsniveau": req.body.opleidingsniveau,
    "leerjaar": req.body.leerjaar,
    "kwaliteiten": req.body.kwaliteiten,
    "functie": req.body.functie,
    "dienstverband": req.body.dienstverband
  };
  await db.collection('gebruikers').insertOne(gebruikers);
  res.render('done', {
    title: req.body.naam + " je bent toegevoegd!",
    gebruikers
  })
});

app.use(function (req, res, next) {
  res.status(404).send("Sorry ik heb niks kunnen vinden");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})