const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId({ length: 5 })

const express = require('express');
const app = express();
const exphbs = require("express-handlebars")
const bodyParser = require('body-parser');
const flash = require('express-flash')
const session = require('express-session')
const pgp = require('pg-promise')({});
const Waitersfunc = require('./waitersfac')
const WaiterRoutes= require('./routes/routes')



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

const waitersfunc2 = Waitersfunc(db)
const waiterRoutes= WaiterRoutes(waitersfunc2)

app.get('/', waiterRoutes.index)

app.get('/admin', waiterRoutes.Admin)

app.post('/admin', waiterRoutes.admin)

app.get('/waiter', waiterRoutes.waiter)
app.post('/adduser', waiterRoutes.adduser)

app.get('/login', waiterRoutes.login)

app.post('/login', waiterRoutes.login2)

app.get('/waiters/:username', waiterRoutes.selectDay)


app.post('/waiters/:name', waiterRoutes.workDayCheck)


app.get('/delete', waiterRoutes.deleteWaiters)


app.get('/days', waiterRoutes.shedulingDay)


app.get('/logout', waiterRoutes.home)


const PORT = process.env.PORT || 1923
app.listen(PORT, function () {
   console.log('App started at port:', PORT)
})