const mindscape = require('./services/index.js');
const express = require('express');
const morgan = require('morgan');
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

server.use(morgan('dev'));

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

server.post('/api/init', (req, res) => {
  new Promise((resolve, reject) => {
      if (req.session.user_id === req.body.user_id) {
        resolve(req.session.user_id);
      }
      else {
        reject('invalid user_id');
      }
    })
    .then(user_id => {
      return services.getPresence(user_id);
    })
    .then(state => {
      res.status(200).json({data: state});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({data: err.message});
    });
});

server.post('/api/register', (req, res) => {
  const { t, x, y, z } = req.body;

  services.getNewAuthor({t, x, y, z})
    .then(({user_id}) => {
      // TODO use prev user_id for logout action?
      req.session.user_id = user_id;
      resolve(req.session.user_id);
    })
    .then(user_id => {
      return services.getPresence(user_id);
    })
    .then(state => {
      res.status(200).json({data: state});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({data: err.message});
    });
});

server.post('/api/login', (req, res) => {
  new Promise((resolve, reject) => {
      if (req.session.user_id === req.body.user_id) {
        resolve(req.session.user_id);
      }
      else {
        reject('invalid user_id');
      }
    })
    .then(logout_user_id => {
      // TODO user prev_user_id for logout action?
      const {name, pass} = req.body;

      return Promise.resolve(services.getAuthorId({name, pass}))
        .catch(error => {
          res.status(400).json({data: error.message});
        });
    })
    .then(({user_id}) => {
      if (user_id) {
        services.getPresence(user_id)
          .then(state => {
            res.status(200).json({data: state});
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({data: err.message});
    })
});

server.post('/api/logout', (req, res) => {
  new Promise((resolve, reject) => {
      if (req.session.user_id === req.body.user_id) {
        resolve(req.session.user_id);
      }
      else {
        reject('invalid user_id');
      }
    })
    .then(logout_user_id => {
      // TODO user prev_user_id for logout action?
      const {t, x, y, z} = req.body;

      return services.getNewAuthor({t, x, y, z})
        .then(({user_id}) => {
          req.session.user_id = user_id;
          return req.session.user_id;
        });
    })
    .then(user_id => {
      return services.getPresence(user_id);
    })
    .then(state => {
      res.status(200).json({data: state});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({data: err.message});
    });
});

server.post('/api/graph', (req, res) => {
  new Promise((resolve, reject) => {
      if (req.session.user_id === req.body.user_id) {
        resolve(req.body);
      }
      else {
        reject('invalid user_id');
      }
    })
    .then(({user_id, post_by_id, link_by_id}) => {
      return services.setGraph({user_id, post_by_id, link_by_id});
    })
    .then(state => {
      res.status(200).json({data: state});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({data: err.message});
    });
});

server.listen(server.get('port'), () => {
  console.log('Server started: http://localhost:' + server.get('port') + '/');
});
