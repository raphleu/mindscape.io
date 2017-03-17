const mindscape = require('./services/index.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const session = require('express-session');
const uuid = require('uuid/v4');
const redisStore = require('connect-redis')(session);

const graphenedb_config = {
  host: process.env.GRAPHENEDB_BOLT_URL,
  user: process.env.GRAPHENEDB_BOLT_USER,
  pass: process.env.GRAPHENEDB_BOLT_PASSWORD,
};

const my_graphenedb_config = {
  host: 'bolt://hobby-giphgfjnbmnagbkepekepdnl.dbs.graphenedb.com:24786',
  user: 'app56614688-dYRNeO',
  pass: '6pQjlv4oiV5HXJBrqZp8',
}; // TODO: don't post this publicly, someone might mess with it-- but really no one cares right now, you don't even have any users man, so whatever-- but really, don't post it lol, maybe someone will look at your old commits and hack youuuuu; ok, i'll remember.

const local_neo4j_config = {
  host: 'http://localhost:7474',
  user: 'neo4j',
  pass: 'o4jw4lru5H!d3',
};

const services = mindscape({neo4j_driver_config: my_graphenedb_config});

const server = express();

server.set('port', (process.env.PORT || 3000));

server.use(logger('dev'));

server.use(bodyParser.json());

server.use(bodyParser.urlencoded({extended: true}));

server.use(express.static(path.join(__dirname, 'dist'))); 


const session_options = {
  cookie: {
    maxAge: 172800000,
    //secure: true,
  },
  genid: (req) => {
    return uuid();
  },
  resave: true,
  rolling: true,
  saveUninitialized: true,
  secret: 'keyboard canoli',
  //store: new redisStore(store_options),
  //unset: 'destory',
}

if (server.get('env') === 'production') {
  server.set('trust proxy', 1) // trust first proxy
  session_options.cookie.secure = true // serve secure cookies
}

server.use(session(session_options));


server.get('/api/inventory', (req, res) => {
  new Promise((resolve, reject) => {
    if (req.session.user_id == req.query.user_id) {
      resolve(req.session.user_id);
    }
    else {
      const { t, x, y, z } = req.query;
      const id = uuid();

      services.setFeature({ // create and return a new (anonymous) author
        user_id: id,
        note_by_id: {
          [id]: {
            properties:{
              id,
              author_id: id,
              create_t: t,
              create_x: x,
              create_y: y,
              create_z: z,
            },
          },
        },
        link_by_id: {},
      }).then(({user_id}) => {
          if (user_id) {
            req.session.user_id = user_id;
            resolve(req.session.user_id);
          }
          else {
            reject('failed to create new author for user');
          }
        });
    }
  }).then(user_id => {
      return services.getInventory(user_id);
    })
    .then(state => {
      res.status(200).json({data: state});
    })
    .catch(err => {
      req.status(500).json({data: err.message});
    });
});

server.put('/api/feature', (req, res) => {
  new Promise((resolve, reject) => {
    if (req.session.user_id == req.body.user_id) {
      resolve(req.body);
    }
    else {
      reject('invalid user id');
    }
  }).then(({user_id, note_by_id, link_by_id}) => {
      return services.setFeature({user_id, note_by_id, link_by_id});
    })
    .then(state => {
      res.status(200).json({data: state});
    })
    .catch(err => {
      res.status(500).json({data: err.message});
    });
});

server.listen(server.get('port'), () => {
  console.log('Server started: http://localhost:' + server.get('port') + '/');
});
