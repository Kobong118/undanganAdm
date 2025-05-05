var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const favicon = require('serve-favicon');
const compression = require('compression');

const usersRouter = require('./routes/users');
const undanganAdm = require('./routes/adm');
const generateQrCode = require('./routes/generateQrCode');
const hadiah = require('./routes/hadiah');
const pesan = require('./routes/pesan');
const admin = require('./routes/admin');
const blogger = require ('./routes/blogger')
const rumah = require ('./routes/rumah');
const haulApaLimbangan = require ('./routes/haulApaLimbangan');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Set favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/mp3', express.static(path.join(__dirname, 'public/mp3')));
//middleware compression
app.use(compression());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressLayouts);
app.use('/', rumah);
app.use('/undangan-maulid-adm', undanganAdm);
app.use('/users', usersRouter);
app.use('/generate-qr', generateQrCode);
app.use('/hadiah', hadiah);
app.use('/pesan', pesan);
app.use('/admin', admin);
app.use('/api/blog', blogger);
app.use('/haul-apa-limbangan', haulApaLimbangan);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',
    {layout:"layouts/main-layout",title:'error'}
  );
});

module.exports = app;
