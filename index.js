const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId({ length: 5 })

const express = require('express');
const app = express();
const exphbs = require("express-handlebars")
const bodyParser = require('body-parser');
const flash = require('express-flash')
const session = require('express-session')
const Waitersfunc = require('./waitersfac')
const waitersfunc2 = Waitersfunc(db)
const pgp = require('pg-promise')({});


app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

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

const Routes= require('./routes/routesfunc')
const Routes= Routes(waitersfunc2)

app.get('/', Routes.index)


app.get('/admin', Routes.Admin)


app.post('/admin', Routes.admin)

app.get('/waiter', Routes.waiter)

app.post('/adduser', Routes.adduser)

app.get('/login', Routes.login)
app.post('/login', Routes.login2)
app.get('/waiters/:username', Routes.selectDay)
app.post('/waiters/:name', Routes.workDayCheck)
app.get('/delete', Routes.deleteWaiters)
app.get('/days', Routes.shedulingDay)
app.get('/logout', Routes.home)
// setTimeout(() => {
//    const box = document.getElementById('succesmsg');
 
//    // 👇️ hides element (still takes up space on page)
//    box.style.visibility = 'hidden';
//  }, 1000);

const PORT = process.env.PORT || 1923
app.listen(PORT, function () {
   console.log('App started at port:', PORT)
})