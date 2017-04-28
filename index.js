const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const neo4j = require('neo4j-driver').v1;

const path = require('path');
const uuid = require('uuid/v4');

const service = require('./services/index.js')();

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
      if (data.error) {
        console.log(data.error);
        res.status(400).json({data});
      }
      else {
        res.status(200).json({data});
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({data: err});
    });
  };
}

const neo4j_configs = {
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
};// TODO: don't post this publicly, someone might mess with it-- but really no one cares right now, you don't even have any users man, so whatever-- but really, don't post it lol, maybe someone will look at your old commits and hack youuuuu; ok, i'll remember...

const { host, user, pass } = neo4j_configs['my_graphenedb'];
const neo4j_driver = neo4j.driver(host, neo4j.auth.basic(user, pass));

server.post('/api/register', respond((req, res) => {
  const { user_id } = req.session;
  const { vect } = req.body;

  console.log('register');

  const session = neo4j_driver.session();
  const tx = session.beginTransaction();

  return Promise.resolve(user_id)
    .then(user_id => {
      if (user_id != null) {
        return service.logout({tx, user_id, vect});  
      }
      return {};
    })
    .then(() => {
      return service.init({tx, vect})
    })
    .then(dish => {
      tx.commit();
      session.close();
      
      req.session.user_id = dish.user_id;
      
      return dish;
    });
}));

server.post('/api/resume', respond((req, res) => {
  const { user_id } = req.session;
  const { vect } = req.body;

  console.log('resume');

  if (user_id != null) {
    const session = neo4j_driver.session();
    const tx = session.beginTransaction();

    return service.get({tx, user_id, vect})
      .then(dish => {
        tx.commit();
        session.close();

        return dish;
      });
  }
  else {
    return {};
  }
}));

server.post('/api/set', respond((req, res) => {
  const { user_id } = req.session;
  const { vect, node_by_id, link_by_id } = req.body;

  console.log('dish');

  const session = neo4j_driver.session();
  const tx = session.beginTransaction();

  return service.set({tx, user_id, vect, node_by_id, link_by_id})
    .then(dish => {
      tx.commit();
      session.close();

      return dish;
    });
}));

server.post('/api/sign', respond((req, res) => {
  const { user_id } = req.session;
  const { vect, pass, edit_pass } = req.body;

  console.log('sign');

  const session = neo4j_driver.session();
  const tx = session.beginTransaction();

  return service.sign({tx, user_id, vect, pass, edit_pass})
    .then(dish => {
      tx.commit();
      session.close();

      return dish;
    });
}));

server.post('/api/logout', respond((req, res) => {
  const { user_id } = req.session;
  const { vect } = req.body;

  console.log('logout');

  const session = neo4j_driver.session();
  const tx = session.beginTransaction();

  return service.logout({user_id, vect})
    .then(dish => {
      tx.commit();
      session.close();

      return dish;
    });
}));

server.post('/api/login', respond((req, res) => {
  const { user_id } = req.session;
  const { vect, name, pass } = req.body;

  console.log('login');

  const session = neo4j_driver.session();
  const tx = session.beginTransaction();

  return Promise.resolve(user_id)
    .then(user_id => {
      if (user_id != null) {
        return service.logout({user_id, vect});
      }
      return {};
    })
    .then(() => {
      return service.login({vect, name, pass})
        .then(({ user_id }) => {
          if (user_id) {
            req.session.user_id = user_id;

            return service.get({user_id, vect})
              .then(dish => {
                tx.commit();
                session.close();

                return dish;
              });
          }
          else {
            tx.commit();
            session.close();

            return {}; // login failed
          }
        });
    });
}));

server.listen(server.get('port'), () => {
  console.log('Server started: http://localhost:' + server.get('port') + '/');
});
