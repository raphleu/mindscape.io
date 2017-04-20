const mindscape = require('./services/index.js');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const uuid = require('uuid/v4');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const graphenedb_config = {
  host: process.env.GRAPHENEDB_BOLT_URL,
  user: process.env.GRAPHENEDB_BOLT_USER,
  pass: process.env.GRAPHENEDB_BOLT_PASSWORD,
};

const my_graphenedb_config = {
  host: 'bolt://hobby-giphgfjnbmnagbkepekepdnl.dbs.graphenedb.com:24786',
  user: 'app56614688-dYRNeO',
  pass: '6pQjlv4oiV5HXJBrqZp8',
}; // TODO: don't post this publicly, someone might mess with it-- but really no one cares right now, you don't even have any users man, so whatever-- but really, don't post it lol, maybe someone will look at your old commits and hack youuuuu; ok, i'll remember...

const local_neo4j_config = {
  host: 'http://localhost:7474',
  user: 'neo4j',
  pass: 'o4jw4lru5H!d3',
};

const services = mindscape({neo4j_driver_config: my_graphenedb_config});

const server = express();

server.set('port', (process.env.PORT || 3000));

server.use(morgan('dev')); // logger

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.use(express.static(path.join(__dirname, 'dist'))); 


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

function respond(callback) {
  return (req, res) => {
    return Promise.resolve(callback(req, res))
    .then(data => {
      res.status(200).json({data});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({data: err});
    });
  };
}

server.post('/api/resume', respond((req, res) => {
  const { user_id } = req.session;
  const { vect } = req.body;
  console.log('resume');
  return services.getPresentation({vect, user_id});
}));

server.post('/api/register', respond((req, res) => {
  const { user_id } = req.session;
  const { vect } = req.body;
  console.log('register');
  return services.logoutUser({vect, user_id}).then(() => {
    return services.getNewUser({vect}).then(({ user_id }) => {
      req.session.user_id = user_id;
      return services.getPresentation({vect, user_id});
    });
  });
}));

server.post('/api/login', respond((req, res) => {
  const { user_id } = req.session;
  const { vect, name, pass } = req.body;
  console.log('login');
  return services.logoutUser({vect, user_id}).then(() => {
    return services.getUserId({vect, name, pass}).then(({ user_id }) => {
      if (user_id) {
        req.session.user_id = user_id;
        return services.getPresentation({vect, user_id})
      }
      else {
        return {}; // login failed
      }
    });
  });
}));

server.post('/api/logout', respond((req, res) => {
  const { user_id } = req.session;
  const { vect } = req.body;
  console.log('logout');
  return services.logoutUser({vect, user_id});
}));

server.post('/api/pass', respond((req, res) => {
  const { user_id } = req.session;
  const { vect, pass, edit_pass } = req.body;
  console.log('pass');

  return services.editUserPass({vect, user_id, pass, edit_pass});
}));

server.post('/api/graph', respond((req, res) => {
  const { user_id } = req.session;
  const { node_by_id, link_by_id } = req.body;
  console.log('graph');
  return services.setGraph({
    user_id,
    node_by_id,
    link_by_id,
  });
}));

server.listen(server.get('port'), () => {
  console.log('Server started: http://localhost:' + server.get('port') + '/');
});
