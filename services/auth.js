const bcrypt = require('bcryptjs');

module.exports.authentication = (function() {
  return {
    hashPass,
    comparePass,
  };

  function hashPass(pass) {
    return new Promsie((resolve, reject) => {
      const saltRounds = 10;
      bcrypt.hash(pass, saltRounds, (err, hash) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(hash);
        }
      });
    });
  }

  function comparePass({pass, hash}) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(pass, hash, (err, is_match) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(is_match);
        }
      });
    });
  }
})();

