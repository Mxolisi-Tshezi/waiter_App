module.exports = function waiterRoutes(waitersfunc2) {

    function index(req, res) {
         res.render('index')
     }
     function Admin(req, res) {
         res.render('admin')
     }
     async function admin(req, res) {
         res.redirect('/days')
     }
 
     async function waiter(req, res) {
         res.redirect('/index')
 
     }
 
 // app.get('/', function (req, res) {
 //    res.render('index')
 // })
 
 // app.get('/admin', function (req, res) {
 
 //    res.render('Admin')
 // })
 
 // app.post('/admin', function (req, res) {
    
 //    res.redirect('/days')
 // })
 
 // app.get('/waiter', function (req, res) {
 //    res.redirect('/index')
 // })
 
 
 // app.post('/adduser', async function (req, res) {
     async function adduser(req, res) {
 
    const username = req.body.userInput.charAt().toUpperCase() + req.body.userInput.slice(1).toLowerCase();
    let alphabet = /^[a-z A-Z]+$/
    const code = uid();
 
    let result = await waitersfunc2.selectUsername(username)
   
 if (alphabet.test(username) == false) {
       req.flash('errormsg', 'Invalid username')
       res.redirect('/')
   }
  else if (Number(result.count) !== 0) {
    res.redirect('/waiters/' + username)
 }
    else {
       req.session.code = code
       await waitersfunc2.setUsername(username, code)
       res.redirect('/login')
    }
 }
 
 
 async function login(req, res) {
 
 // app.get('/login', async function (req, res) {
    const authcode = req.session.code;
 
    if(authcode){
       req.flash('succescode', "Authentication code: " +authcode)
    }
    res.render("code")
 
 }
 
 async function login2(req, res) {
 
 // app.post('/login', async function (req, res) {
    let { code } = req.body;
    let userEntered = await waitersfunc2.authCode(code)
 
    if (userEntered) {
       delete req.session.code;
       req.session.userEntered = userEntered
       res.redirect("/waiters/" + userEntered.username)
       
     
    } else {
       req.flash("errormsg", "invalid details")
       res.redirect("/login")
    }
 }
 async function selectDay(req, res) {
 
 // app.get('/waiters/:username', async function (req, res) {
    let user = req.params.username.charAt().toUpperCase() + req.params.username.slice(1).toLowerCase();;
    let output = ` ${user} `;
    let usernameID= await waitersfunc2.usernameID(req.params.username)
    let result= await waitersfunc2.getDays(usernameID)
    let week= await waitersfunc2.weekdays()
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
 }
 
 async function workDayCheck(req, res) {
 // app.post('/waiters/:name', async function (req, res) {
    let workday = req.body.day;
    let user = req.params.name;
    
    if(typeof workday == "string"){
       req.flash('errormsg', 'Please do not select less than 3 days');
 
    }else if (workday.length >= 3) {
       await waitersfunc2.setWeek(workday, user);
       req.flash('success', "scheduled suceesfully")}
 
       else{
 
          req.flash('errormsg', 'Please do not select less than 3 days') 
          res.redirect('back')
 
      }
 
 }
 
 // app.get('/delete', async function (req, res) {
 
  async function deleteWaiters(req, res) {
    await waitersfunc2.removeWaiters()
    req.flash('succesmsg', "Scheduled cleared sucessfully")
    res.redirect('/days')
 }
 
 async function shedulingDay(req, res) {
 // days async function (req, res) {
     // app.get('/days', async function (req, res) {
 
    let monday = await waitersfunc2.JoinTables('Monday')
    let tuesday = await waitersfunc2.JoinTables('Tuesday')
    let wednesday = await waitersfunc2.JoinTables('Wednesday')
    let thursday = await waitersfunc2.JoinTables('Thursday')
    let friday = await waitersfunc2.JoinTables('Friday')
    let saturday = await waitersfunc2.JoinTables('Saturday')
    let sunday = await waitersfunc2.JoinTables('Sunday')
    let colorChange= await waitersfunc2.getColors()
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
 }
 
 async function home(req, res) {
 
 // app.get('/logout', function (req, res) {
    delete req.session.user
    res.redirect('/')
 }
 
 // setTimeout(() => {
 //    const box = document.getElementById('succesmsg');
  
 //    // 👇️ hides element (still takes up space on page)
 //    box.style.visibility = 'hidden';
 //  }, 1000);
 
 
 return {
 
     index,
     admin,
     waiter,
     adduser,
     Admin,
     login,
     login2,
     workDayCheck,
     deleteWaiters,
     shedulingDay,
     selectDay,
     home
 }
 
 }