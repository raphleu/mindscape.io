const bcrypt = require('bcryptjs');

export const authentication = (function() {
  return {
    hashPassword,
    comparePassword,
  };

  function hashPassword(password) {
    return new Promsie((resolve, reject) => {
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(hash);
        }
      });
    });
  }

  function comparePassword({password, hash}) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, is_match) => {
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

