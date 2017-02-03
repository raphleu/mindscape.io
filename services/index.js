const url = require('url');
const seraph = require('seraph');

const graphene_url = 'http://app56614688-dYRNeO:6pQjlv4oiV5HXJBrqZp8@hobby-giphgfjnbmnagbkepekepdnl.dbs.graphenedb.com:24789';

const state = require('./state.js');
const read = require('./read.js')

let util = require('./util.js');

// neo4j graph database url
module.exports = (function() {
  // create a seraph instance 
  const db_url = url.parse(graphene_url);
  const database = seraph({
    server: db_url.protocol + '//' + db_url.host,
    user: db_url.auth.split(':')[0],
    pass: db_url.auth.split(':')[1]
  });

/* TODO pass these as args into author, state, etc?
  const mindscape_service_id = 0;
  const anonymous_author_id = 1;*/

  util = util(database);

  return {
    util,
    state: state(util),
    read: read(util),
  };
})();