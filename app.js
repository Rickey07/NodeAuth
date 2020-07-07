require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');





// Set view engine 
app.set('view engine' , 'ejs');
app.set('views' , __dirname + '/views');

// static files setup
app.use(express.static('public'));

//expressLayouts
app.set('layout' , 'layouts/layouts')
app.use(expressLayouts);

// morgan setup
app.use(logger('dev'))

// bodyParser setup 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



// All routes
const homeRouter = require('./controllers/indexhome');
const userRouter = require('./controllers/user');
app.use('/' , homeRouter);
app.use('/user' , userRouter)

// DB Connection
mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser: true , useUnifiedTopology: true , useCreateIndex: true})
.then(done => console.log('DB Connected'))
.catch(err => console.log(`Error Occured at ${err}`));

// Start connection
app.listen(process.env.PORT || 80 , () => {
    console.log('Server started')
})