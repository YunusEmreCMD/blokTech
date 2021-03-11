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
app.use(bodyParser.urlencoded({ extended: false }))
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', async (req, res) => {
  let gebruikers = {}
  gebruikers = await db.collection('gebruikers').find({}, {
    sort: {
      name: 1
    }
  }).toArray();
  res.render('index', {
    title: "Dit zijn alle gebruikers",
    gebruikers
  });
});

app.post('/', async (req, res) => {
  let gebruikers = {}
  gebruikers = await db.collection('gebruikers').find({}).toArray();
  res.render('index', {
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
//   res.render('index', {
//     results: gebruikers.length,
//     gebruikers: gebruikers
//   })
// })


// app.get('/toevoegen', (req, res) => {
//   res.render('toevoegen', {title: "yes"});
// });

//   app.post('/toevoegen', (req, res) => {
//     const profiel = {};
//     console.log(req.body.year);
//     res.render('toevoegen', {title: "yes", profiel});
//   });


// app.get('/toevoegen', (req, res) => {
//   res.render('toevoegen', {title: "hoi"});
// });

// app.post('/toevoegen', async (req,res) => {
//   const id = slug(req.body.name);
//   const movie = {"id": "id", "name": req.body.name, "year": req.body.year, "categories": req.body.categories, "storyline": req.body.storyline};
//   await db.collection('gebruikers').insertOne(movie);
//   res.render('toegevoegd', {title: "Added a new movie", movie})
//   console.log(req.body.year);
// });

// app.get('/done', (req, res) => {
//   res.render('done', {title: "hoi"});
// });


app.get('/toevoegen', (req, res) => {
  let gebruikers = {}
  res.render('toevoegen', {
    title: "gebruiker toevoegen",
    gebruikers
  });
});

app.post('/toevoegen', async (req, res) => {
  const id = slug(req.body.naam);
  const gebruikers = {
    "id": req.body.id,
    "naam": req.body.naam,
    "soortGebruiker": req.body.soortGebruiker,
    "opleidingsniveau": req.body.opleidingsniveau,
    "functie": req.body.functie,
    "kwaliteiten": req.body.kwaliteiten,
    "dienstverband": req.body.dienstverband
  };
  await db.collection('gebruikers').insertOne(gebruikers);
  res.render('done', {
    title: req.body.naam + "je bent toegevoegd",
    gebruikers
  })
});



// app.get('/movies', async (req, res) => {
//   // create an empty list of movies
//   let movies = {}
//   // look for alle movies in database and sort them by year and name into an array
//   movies = await db.collection('movies').find({}, {
//     sort: {
//       year: -1,
//       name: 1
//     }
//   }).toArray();
//   res.render('movielist', {
//     title: 'List of all movies',
//     movies
//   })
// })
// app.get('/movies/add', (req, res) => {
//   res.render('add', {
//     title: "Add movie",
//     categories
//   });
// });
// app.post('/movies/add', async (req, res) => {
//   const id = slug(req.body.name);
//   const movie = {
//     "id": "id",
//     "name": req.body.name,
//     "year": req.body.year,
//     "categories": req.body.categories,
//     "storyline": req.body.storyline
//   };
//   await db.collection('movies').insertOne(movie);
//   res.render('moviedetails', {
//     title: "Added a new movie",
//     movie
//   })
// });
// app.get('/movies/:movieId', async (req, res) => {
//   const movie = await db.collection('movies').findOne({
//     id: req.params.movieId
//   });
//   res.render('moviedetails', {
//     title: "Movie details",
//     movie
//   })
// });





app.use(function (req, res, next) {
  res.status(404).send("Sorry ik heb niks kunnen vinden");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})