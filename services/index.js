
const graphene_url = 'http://app56614688-dYRNeO:6pQjlv4oiV5HXJBrqZp8@hobby-giphgfjnbmnagbkepekepdnl.dbs.graphenedb.com:24789';
const db_url = require('url').parse(graphene_url);

const database = require('seraph')({
  server: db_url.protocol + '//' + db_url.host,
  user: db_url.auth.split(':')[0],
  pass: db_url.auth.split(':')[1]
});

const util = require('./util.js')(database);

const state = require('./state.js')(util);

// neo4j graph database url
module.exports = (function() {
  return {
    util,
    state,
  };
})();