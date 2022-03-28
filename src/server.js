// Dependencies
const fs = require('fs');
const path = require('path');
const redis = require('redis');
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const url = require('url');
const winston = require('winston');
const expressWinston = require('express-winston');
const cors = require('cors');
const session = require('express-session')


const app = express()

const redisConnection  = {
    host: '127.0.0.1',
    port: 6379,
    ttl: 86400,
    no_ready_check: true
}

const redisClient = redis.createClient({...redisConnection});
const redisStore = require('connect-redis')(session);

redisClient.connect()//;catch(console.error)


redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
});
redisClient.on('connect', () => {
    console.log('Redis connected!');
});

app.use(
    session({
        name: 'SessionIdName',
        secret: 'SomeSessionPasswordForRedis',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
        // store: new redisStore({
        //     ...redisConnection,
        //     client: redisClient
        // }),
    })
);

// app.use(function (req, res, next) {
//   var tries = 3

//   function lookupSession(error) {
//     if (error) {
//       return next(error)
//     }

//     tries -= 1

//     if (req.session !== undefined) {
//       return next()
//     }

//     if (tries < 0) {
//       return next(new Error('oh no'))
//     }

//     sessionMiddleware(req, res, lookupSession)
//   }

//   lookupSession()
// })

// app.use(function (req, res, next) {
//   if (!req.session) {
//     return next(new Error("oh no")) // handle error
//   }
//   next() // otherwise continue
// })


// const redisClient = redis.createClient({
//     url: process.env.REDIS_URL
// })
// redisClient.connect()


app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  meta: false, // optional: control whether you want to log the meta data about the request (default to true)
  // format: winston.format.combine(
  //   winston.format.colorize(),
  //   // winston.format.()
  // ),
  // msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  // expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  // colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  // ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));
app.use(bodyParser.json());

//app.use(express.static('public'))
app.use(cookieParser());

//TODO - add sentry here

var corsOption = {
  origin: 'http://localhost',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOption))

// app.use((req, res, next) => {
//   // res.setHeader('Access-Control-Allow-Origin', ['*']);
//   // res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   // res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');

//   const sid = req.query.sid;

//   if (typeof sid === 'undefined') {
//     return res.status(400).send({
//       message: 'sid is undefined'
//     });
//   } else {

//     redisClient
//     .get(sid)
//     .then( data => {

//       if (!data) {
//         throw `Session not found: ${sid}`
//       }

//       req.user = JSON.parse(data)

//       if (!req.user.info) {
//         throw `User data error`
//       }

//       next();

//     })
//     .catch( (error) => {
//       console.error(error)
//       return res.status(400).send({
//         message: error
//       });
//     })
//   }
// });

app.options('/collect', cors()) // enable pre-flight request for POST request
app.get('/collect', function(req, res) {
  req.session.x++;
  res.send({ x : req.session })
});

let port = 3000;

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Personal-area app listening on port ${port}`)
})



