const 
  mindscape = require('./services/index.js'),

  express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),

  neo4j = require('neo4j-driver').v1,

  path = require('path'),
  uuid = require('uuid/v4'),

  admin = require('firebase-admin'),
  serviceAccount = require('./mindscape-868a8-firebase-adminsdk-su4ar-98c60a3e56.json'),

  service = mindscape(),
  server = express(),

  neo4j_configs = {
    process_env: {
      host: process.env.GRAPHENEDB_BOLT_URL,
      user: process.env.GRAPHENEDB_BOLT_USER,
      pass: process.env.GRAPHENEDB_BOLT_PASSWORD,
    },
    my_graphenedb: {
      host: 'bolt://hobby-giphgfjnbmnagbkepekepdnl.dbs.graphenedb.com:24786',
      user: 'app56614688-dYRNeO',
      pass: '6pQjlv4oiV5HXJBrqZp8',
    },
    local: {
      host: 'bolt://localhost:7687',
      user: 'neo4j',
      pass: 'o4jw4lru5H!d3',
    },
  },// TODO: don't post this publicly, someone might mess with it-- but really no one cares right now, you don't even have any users man, so whatever-- but really, don't post it lol, maybe someone will look at your old commits and hack youuuuu; ok, i'll remember...

  { host, user, pass } = neo4j_configs['my_graphenedb'],
  neo4j_driver = neo4j.driver(host, neo4j.auth.basic(user, pass));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mindscape-868a8.firebaseio.com"
});

server.set('port', (process.env.PORT || 3000));

server.use(morgan('dev')); // logger

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.use(express.static(path.join(__dirname, 'dist'))); 

/*
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const store_options = {
  logErrors: true,
  url: 'redis://h:pa0daabadd50ba3515435a534d06c31d3533a8c7647db7d06dea4a2e73733b200@ec2-34-204-242-91.compute-1.amazonaws.com:14209'
};

const session_options = {
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 2,
    //secure: true,
  },
  genid: (req) => {
    return uuid();
  },
  resave: true,
  rolling: true,
  saveUninitialized: true,
  secret: 'keyboard canoli',
  store: new RedisStore(store_options),
  //unset: 'destory',
}
if (server.get('env') === 'production') {
  server.set('trust proxy', 1) // trust first proxy
  session_options.cookie.secure = true // serve secure cookies
}
server.use(session(session_options));
*/

function respond(callback) {
  return (req, res) => {
    return Promise.resolve(callback(req, res)).then(data => {
      if (data.error) {
        console.log(data.error);
        res.status(400).json({data});
      }
      else {
        res.status(200).json({data});
      }
    }).catch(error => {
      console.error(error);
      res.status(500).json({data: err});
    });
  };
}

server.post('/api/resume', respond((req, res) => {
  console.log('resume');
  const { vect, auth_token } = req.body;

  return admin.auth().verifyIdToken(auth_token).then(decodedToken => {
    const session = neo4j_driver.session();
    const tx = session.beginTransaction();
    const user_id = decodedToken.uid;

    return service.get({tx, user_id, vect}).then(dish => {
      tx.commit();
      session.close();

      return dish;
    });
  });
}));

server.post('/api/login', respond((req, res) => {
  console.log('login');
  const { vect, auth_token, google, facebook, pass } = req.body; // TODO use login details

  return admin.auth().verifyIdToken(auth_token).then(decodedToken => {
    const session = neo4j_driver.session();
    const tx = session.beginTransaction();
    const user_id = decodedToken.uid;

    return service.login({tx, vect, user_id}).then(dish => {
      if (dish) {
        tx.commit();
        session.close();

        return dish;
      }
      else {
        // create new user
        return service.seed({tx, vect, user_id, google, facebook, pass}).then(dish =>{
          tx.commit();
          session.close();

          return dish;
        });
      }
    });
  });
}));

server.post('/api/logout', respond((req, res) => {
  console.log('logout');
  const { auth_token, vect } = req.body;

  return admin.auth().verifyIdToken(auth_token).then(decodedToken => {
    const session = neo4j_driver.session();
    const tx = session.beginTransaction();
    const user_id = decodedToken.uid;

    return service.logout({tx, user_id, vect}).then(dish => {
      tx.commit();
      session.close();

      return dish;
    });
  });
}));

server.post('/api/set', respond((req, res) => {
  const { auth_token, vect, node_by_id, link_by_id } = req.body;

  console.log('set');

  return admin.auth().verifyIdToken(auth_token).then(decodedToken => {
    const user_id = decodedToken.uid;

    const session = neo4j_driver.session();
    const tx = session.beginTransaction();

    return service.set({tx, user_id, vect, node_by_id, link_by_id}).then(dish => {
      tx.commit();
      session.close();

      return dish;
    });
  });
}));

server.listen(server.get('port'), () => {
  console.log('Server started: http://localhost:' + server.get('port') + '/');
});
