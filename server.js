// import server modules
const express = require('express');

const bodyParser = require('body-parser');

const logger = require('morgan');

const path = require('path');

const services = require('./services/index.js'); // import services (the database interface layer)

// run server
const app = express();

app.set('port', (process.env.PORT || 3000));

app.use(logger('dev'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'dist'))); 


app.use('/api/', (req, res, next) => {
  // decode tokens
  const tokens = JSON.parse(req.headers.tokens) || [];

  Promise.all(tokens.map(services.util.decodeToken)) // decode tokens
    .then(decodings => {
      return decodings.reduce((token_by_id, decoding) => {
        if (decoding.payload) {
          return Object.assign({}, token_by_id, 
            {
              [decoding.payload.author.id]: decoding.token,
            }
          );
        }
        else {
          return token_by_id;
        }
      }, {});
    })
    .then(token_by_id => {
      req.headers.token_by_id = token_by_id;
      next();
    });
});

app.post('/api/state/initialize', (req, res) => {
  const { token_by_id } = req.headers;
  const { user_ids } = req.body; // TODO use/remove these

  services.state.getState(token_by_id)
    .then(state => {
      res.status(200).json({data: state});
    })
    .catch(err => {
      res.status(500).json({data: err.message});
    });
});

app.post('/api/read', (req, res) => {
  const { token_by_id } = req.headers;
  const { reads } = req.body;

  const filtered_reads = reads.filter(read => token_by_id[read.end]);

  services.read.setReads(reads)
    .then(state => {
      res.status(200).json({data: state});
    })
    .catch(err => {
      res.status(500).json({data: err.message});
    });
});

/*
app.post('/api/state/login', (req, res) => {
  const { signature } = req.body;

  // get author using either (a) name + password, or (b) token
  services.author.getAuthor(signature, token, getCallback(res, (author) => {
    services.state.getState(author.id, token, getCallback(res));
  }));
});

app.post('/api/state/logout', (req, res) => {
  const { signature, token } = req.body;

  // get author using either (a) name + password, or (b) token
  services.author.getAuthor(signature, token, getCallback(res, (author) => {
    services.state.getState(author.id, token, getCallback(res));
  }));
});

app.post('/api/author', (req, res) => {
  const { token, author } = req.body;

  services.author.setAuthor(token, author, getCallback(res)); // TODO rename to editAuthor?
});

*/



app.listen(app.get('port'), () => {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
