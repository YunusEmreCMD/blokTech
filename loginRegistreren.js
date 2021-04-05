////////////////////////// REGISTREREN ///////////////////////

app.get('/registreren', (req, res) => { // checkNotAuthenticated
  res.render('registreren', {
    title: "Registreren"
  })
});


app.post('/registreren', async (req, res) => {
  const { email, password } = req.body;
  let errors = [];

  //Controleer benodigden velden
  if (!email || !password) {
    errors.push({
      message: 'please invullen'
    });
  }

  //Wachtwoord lengte instellen
  if (password.length < 2) {
    errors.push({
      message: 'Wachtwoord te kort'
    })
  }

  await gebruikersModel.findOne({ email: email })
    .then(user => {
      if (user) {
        //Gebruiker bestaat
        errors.push({ message: "Email al in gebruik" });
      }});

  if (errors.length) {
    console.log(errors);
    res.render('registreren', {
      errors,
      email,
      password
    })
  } else {
    const newUser = new vacaturesModel({
      email,
      password
    });
  // hashedPassword
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt,(err, hash)=>{
      if(err) throw err;
      // Verander naar Hash password
      newUser.password = hash;
      //save gebruiker
      newUser.save()
        .then(user =>{
          req.flash('succes_msg','geregistreerd');
          res.redirect('/');
          console.log("Gebruiker aangemaakt!");
        })
        .catch(err => console.log(err));
    })
      });
      }
});




/////////////////////////// INLOGGEN ////////////////////

app.get('/login', checkNotAuthenticated, (req, res) => {
  const errors = req.flash();
  res.render('login', { 
    title: "Inloggen",
    errors 
  })
});

// Login handle
app.post('/login', (req, res, next) => {
  passport.use(
    new localStrategy({ usernameField: 'email' }, (email, password, done)=>{
      // Match user
      vacaturesModel.findOne({ email: email})
      .then(user => {
        if(!user){
          return done(null, false, {message: 'Email bestaat nog niet'})
        }
  
        // Match Password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch){
          req.session.user = user
            return done(null, user);
          } else{
            return done(null, false, {message:'Wachtwoord fout'})
          }
        });
      })
      .catch(err => console.log(err));
    })
  );
  passport.authenticate('local', {
    successRedirect:'/werkzoekende',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});
