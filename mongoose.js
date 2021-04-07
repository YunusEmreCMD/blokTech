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