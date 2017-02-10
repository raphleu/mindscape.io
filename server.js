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

      const verbose = true;
      if (verbose) {
        console.log(req.headers);
        console.log(req.body);
      }
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

app.post('/api/state/update', (req, res) => {
  const { token_by_id } = req.headers;
  let { author, update } = req.body;

  if (token_by_id[author.id] == null) {
    res.status(401).json({data: 'Permission denied.'})
  }
 
  const { node_by_id, relationship_by_id } = update;

  const authors = [];
  const notes = [];
  if (node_by_id) {
    Object.keys(node_by_id).forEach(id => {
      const node = node_by_id[id];
      if (id === author.id) {
        authors.push(node);
      }
      else {
        notes.push(node);
      }
    });   
  }

  const writes = [];
  const reads = [];
  const links = [];
  if (relationship_by_id) {
    Object.keys(relationship_by_id).forEach(id => {
      const relationship = relationship_by_id[id];
      if (relationship.type === 'WRITE') {
        writes.push(relationship);
      }
      else if (relationship.type === 'READ') {
        reads.push(relationship);
      }
      else if (relationship.type === 'LINK') {
        links.push(relationship);
      }
    });
  }

  const updates = [
    services.state.setAuthors(authors),
    services.state.setNotes(author, notes),
    services.state.setReads(author, reads),
  ];

  Promise.all(updates)
    .then(states => {
      return states.reduce((state, item) => Object.assign({}, state, {
        node_by_id: Object.assign({}, state.node_by_id, item.node_by_id),
        relationship_by_id: Object.assign({}, state.relationship_by_id, item.relationship_by_id),
      }), {});
    })
    .then(state => {
      res.status(200).json({data: state});
    })
    .catch(err => {
      res.status(500).json({data: err.message});
    });
});

app.post('/api/state/commit', (req, res) => {
  const { token_by_id } = req.headers;
  let { author, units } = req.body;

  if (token_by_id[author.id] == null) {
    res.status(500).json({data: 'Permission denied'});
  }

  services.state.commitNotes(author, units)
    .then(state => {
      res.status(200).json({data: state});
    })
    .catch(err => {
      res.status(500).json({data: err.message});
    });
})

app.post('/api/state/delete', (req, res) => {
  const { token_by_id } = req.headers;
  let { author, units } = req.body;

  if (token_by_id[author.id] == null) {
    res.status(500).json({data: 'Permission denied'});
  }

  services.state.deleteNotes(author, units)
    .then(state => {
      res.status(200).json({data: state});
    })
    .catch(err => {
      res.status(500).json({data: err.message});
    });
})

app.listen(app.get('port'), () => {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
