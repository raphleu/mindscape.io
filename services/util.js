const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const jwt_secret = 'ieatbats';

module.exports = function(seraph_instance) {
  return {
    // utility
    assignUnitToState,
    assignById,
    // database
    query,
    // password 
    hashPassword,
    comparePassword,
    // token
    encodeToken,
    decodeToken,
  };
  
  function assignUnitToState(state, unit) {
    return Object.assign({}, state, {
      node_by_id: Object.assign({}, state.node_by_id, {
        [unit.note.id]: Object.assign({}, unit.note, {
          write_id: unit.write.id,
          read_ids: unit.reads.map(read => read.id),
          link_ids: unit.links.map(link => link.id),                  
        }),
      }),
      relationship_by_id: Object.assign({}, state.relationship_by_id,
        {
          [unit.write.id]: unit.write,
        },
        unit.reads.reduce(assignById, {}),
        unit.links.reduce(assignById, {})
      ),
    });
  }

  function assignById(object, item) { // use this as the callBack in an array.reduce() call
    return Object.assign({}, object, {
      [item.id]: item
    });
  }

  function query(query, params, verbose = false) {
    return new Promise((accept, reject) => {
      if (verbose) {
        console.log('query start', query, params);
      }
      seraph_instance.query(query, params, (err, results) => {
        if (verbose) {
          console.log('query finish', err, results);
        }
        if (err) {
          reject(err)
        }
        else {
          accept(results);
        }
      });
    });
  }

  function hashPassword(password, next) {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, next);
  }

  function comparePassword(password, hash, next) {
    bcrypt.compare(password, hash, next);
  }

  function encodeToken(author) {
    return new Promise((accept, reject) => {
      const payload = {
        author: author,
        time: Date.now(),
      };

      const options = {
        //expiresIn: '2 days'
      };

      jwt.sign(payload, jwt_secret, options, (err, token) => {
        if (err) {
          reject(err);
        }
        else {
          accept(token);
        }
      });
    });
  }

  function decodeToken(token, verbose = false) {
    return new Promise((accept, reject) => {
      const options = {};

      jwt.verify(token, jwt_secret, options, (err, payload) => {
        if (err) {
          if (verbose) {
            console.log('token not decoded:\n', token, '\n', payload ,'\n', err && err.message);
          }

          accept({
            token,
          })
        }
        else {
          if (verbose) {
            console.log('token decoded:\n', token, '\n', payload);
          }

          accept({
            token,
            payload,
          });
        }
      });
    });
  };
}
