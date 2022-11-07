const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId({ length: 5 })

const express = require('express');
const app = express();
const exphbs = require("express-handlebars")
const bodyParser = require('body-parser');
const flash = require('express-flash')
const session = require('express-session')
const Waitersfunc = require('./waitersfac')
const pgp = require('pg-promise')({});


app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// waitersapp

// create database akhe;
// create role sibone login password 'sibone123';
// grant all privileges on database akhe to sibone;
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://sibone:sibone123@localhost:5432/akhe";
const config = {
   connectionString: DATABASE_URL
}
if(process.env.NODE_ENV === "production"){
   config.ssl = {
      rejectUnauthorized: false
   }
}

app.use(session({
   secret: 'secret',
   resave: false,
   saveUninitialized: true
}));

app.use(flash());

app.use(express.static('public'))

const db = pgp(config);
const waitersFunction = Waitersfunc(db)

app.get('/', function (req, res) {
   res.render('index')
})

app.get('/admin', function (req, res) {

   res.render('Admin')
})

app.post('/admin', function (req, res) {
   
   res.redirect('/days')
})

app.get('/waiter', function (req, res) {
   res.redirect('/index')
})


app.post('/adduser', async function (req, res) {
   const username = req.body.userInput.charAt().toUpperCase() + req.body.userInput.slice(1).toLowerCase();
   let alphabet = /^[a-z A-Z]+$/
   const code = uid();

   let result = await waitersFunction.selectUsername(username)
  
   
if (alphabet.test(username) == false) {
      req.flash('errormsg', 'Invalid username')
      res.redirect('/')
  }
 else if (Number(result.count) !== 0) {
   res.redirect('/waiters/' + username)
}
   else {
      req.session.code = code
      await waitersFunction.setUsername(username, code)
      res.redirect('/login')
   }
})

app.get('/login', async function (req, res) {
   const authcode = req.session.code;

   if(authcode){
      req.flash('succescode', "Authentication code: " +authcode)
   }
   res.render("code")

})


app.post('/login', async function (req, res) {
   let { code } = req.body;
   let userEntered = await waitersFunction.authCode(code)

   if (userEntered) {
      delete req.session.code;
      req.session.userEntered = userEntered
      res.redirect("/waiters/" + userEntered.username)
      
    
   } else {
      req.flash("errormsg", "invalid details")
      res.redirect("/login")
   }
})

app.get('/waiters/:username', async function (req, res) {
   let user = req.params.username.charAt().toUpperCase() + req.params.username.slice(1).toLowerCase();;
   let output = ` ${user} `;
   let usernameID= await waitersFunction.usernameID(req.params.username)
   let result= await waitersFunction.getDays(usernameID)
   let week= await waitersFunction.weekdays()
   week = week.map(day => {

      const checked = result.filter(item => item.workday == day.workday)

      return {
         ...day,
         status: checked.length > 0 ? 'checked' : ''
      }
   })

   res.render('shift', {
      user,
      output,
      week
   });
})


app.post('/waiters/:name', async function (req, res) {
   let workday = req.body.day;
   let user = req.params.name;
   
   if(typeof workday == "string"){
      req.flash('errormsg', 'Please do not select less than 3 days');

   }else if (workday.length >= 3) {
      await waitersFunction.setWeek(workday, user);
      req.flash('success', "scheduled suceesfully")}

      else{

         req.flash('errormsg', 'Please do not select less than 3 days');   
     }

     res.redirect('back')
})

app.get('/delete', async function (req, res) {
   await waitersFunction.removeWaiters()
   req.flash('succesmsg', "Scheduled cleared sucessfully")
   res.redirect('/days')
})

app.get('/days', async function (req, res) {

   let monday = await waitersFunction.JoinTables('Monday')
   let tuesday = await waitersFunction.JoinTables('Tuesday')
   let wednesday = await waitersFunction.JoinTables('Wednesday')
   let thursday = await waitersFunction.JoinTables('Thursday')
   let friday = await waitersFunction.JoinTables('Friday')
   let saturday = await waitersFunction.JoinTables('Saturday')
   let sunday = await waitersFunction.JoinTables('Sunday')
   let colorChange= await waitersFunction.getColors()
   res.render('schedule', {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      colorChange
   })
})


app.get('/logout', function (req, res) {
   delete req.session.user
   res.redirect('/')
})

// setTimeout(() => {
//    const box = document.getElementById('succesmsg');
 
//    // 👇️ hides element (still takes up space on page)
//    box.style.visibility = 'hidden';
//  }, 1000);

const PORT = process.env.PORT || 1923
app.listen(PORT, function () {
   console.log('App started at port:', PORT)
})