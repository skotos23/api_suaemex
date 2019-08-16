const exprees = require('express');
const path = require('path');
const exphbs=require('express-handlebars');
const override = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const  passport= require('passport');

//const router = require('./routes/index');

//init 
const app = exprees();
require('./database');
require('./config/passport');


//setting
app.set('port',process.env.PORT||3000);
app.set('views',path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
//middleware

app.use(exprees.urlencoded({extended:false}));
app.use(override('_method'));
app.use(session({
    secret : 'mysecretapp',
    resave: true,
    saveUninitialized:true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//app.use(router);
//global variables
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.errors_msg = req.flash('errors_msg');
    res.locals.error = req.flash('error');
    res.locals.user= req.user || null;
    next();
});

//routes
/*router.get('./routes/');
router.get('./routes/users');
router.get('./routes/notes');*/
app.use(require('./routes/'));
app.use(require('./routes/documents'));
app.use(require('./routes/users'));

//statics
app.use(exprees.static(path.join(__dirname, 'public')));
//server 

app.listen(app.get('port'), ()=>{
    console.log('server on port',app.get('port'))
});