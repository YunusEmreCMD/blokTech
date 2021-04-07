// Mongodb connectie
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



// .insertOne
const gebruikers = {
  "voornaam": req.body.voornaam,
  "achternaam": req.body.achternaam,
  "leeftijd": req.body.leeftijd,
  "werkzoekendeEmail": req.body.werkzoekendeEmail,
  "werkzoekendePortfolio": req.body.werkzoekendePortfolio,
  "werkzoekendeCv": req.body.werkzoekendeCv,
  "werkzoekendeWoonplaats": req.body.werkzoekendeWoonplaats,
  "biografie": req.body.biografie,
  "opleidingRichting": req.body.opleidingRichting,
  "schoolNaam": req.body.schoolNaam,
  "opleidingsniveau": req.body.opleidingsniveau,
  "leerjaar": req.body.leerjaar,
  "skills": req.body.skills,
  "functie": req.body.functie,
  "branch": req.body.branch,
  "dienstverband": req.body.dienstverband
};

await db.collection('gebruikers').insertOne(gebruikers);



// .find({}, {}).toArray();
app.get('/werkzoekende', async (req, res) => {
  let gebruikers = {}
  gebruikers = await db.collection('gebruikers').find({}, {}).toArray();
  res.render('werkzoekende', {
    title: "Werkzoekende",
    paginaClass: "resultaten",
    gebruikers
  })
});