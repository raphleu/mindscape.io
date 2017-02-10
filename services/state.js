
const { Relationships, Defaults, Displays, Directions, Positions } = require('../src/types.js');

module.exports = state;

function state(util) {
  return {
    getState,
    setAuthors,
    setReads,
    setNotes,
    commitNotes,
    deleteNotes,
  };

  function getState(token_by_id) {
    return Promise.resolve(token_by_id)
      .then(token_by_id => {
        // new Author if we don't have any valid tokens
        console.log('token_by_id', token_by_id)
        if (Object.keys(token_by_id).length > 0) {
          return token_by_id;
        }
        else {
          return addAuthor()
            .then(author => {
              return util.encodeToken(author)
                .then(token => {
                  return {
                    [author.id]: token
                  };
                });
            });
        }
      })
      .then(token_by_id => {
        // add bonus notes to users' reading notes
        const author_ids = Object.keys(token_by_id).map(parseInt);

        return getBonusNoteIds()
          .then(bonus_note_ids => addReads(author_ids, bonus_note_ids))
          .then(reads => token_by_id); // we still need token_by_id 
      })
      .then(token_by_id => {
        // get the state
        const author_ids = Object.keys(token_by_id).map(parseInt);

        return getUsersUnits(author_ids)
          .then(result => {
            const {users, units} = result;

            const initial_state = {
              user_ids: author_ids,
              token_by_id,
              node_by_id: users.reduce(util.assignById, {}),
              relationship_by_id: {},
            };

            return units.reduce(util.assignUnitToState, initial_state);
          });
      });
  }

  function addAuthor() {
    console.log('addAuthor');
    const params = {
      author_props: {
        name_text: 'anonymous',
        registered: false,
      },
      root_props: {
        position_text: 'root',
        momentum_text: null,
      },
      write_props: Object.assign({}, Defaults.READ.properties, {
        display: Displays.PLANE,
      }),
    };
    const query = `
      CREATE
        (author:Author)-[write:WRITE]->(note:Note:Root),
        (author)<-[read:READ]-(note)
      SET
        author += {author_props},
        author.root_read_id = id(read),
        author.frame_read_id = id(read),
        author.initial_time = timestamp(),
        note += {root_props},
        note.initial_time = timestamp(),
        write += {write_props},
        write.initial_time = timestamp(),
        read += {write_props},
        read.initial_time = timestamp()
      RETURN 
        author,
        note
    `;
    return util.query(query, params, true)
      .then(results => results[0].author);
  }

  function getBonusNoteIds() {
    console.log('getBonusNoteIds');
    return Promise.resolve([
      12, /* current time note id */
      33, /* current space note id */ 
    ]);
  }

  function addReads(author_ids, note_ids) {
    console.log('addReads');
    const params = {
      author_ids,
      note_ids
    };
    const query = `
      MATCH
        (user:Author)<-[frame_read:READ]-(:Note),
        (note:Note)<-[write:WRITE]-(:Author)
      WHERE
        id(user) IN {author_ids} AND
        id(frame_read) = user.frame_read_id AND
        id(note) IN {note_ids} 
      MERGE
        (user)<-[read:READ]-(note)
      ON CREATE SET
        frame_read.sub_read_ids = frame_read.sub_read_ids + id(read),
        frame_read.final_time = timestamp(),
        read = write,
        read.super_read_id = id(frame_read),
        read.sub_read_ids = [],
        read.initial_time = timestamp(),
        read.final_time = null
      ON MATCH SET
        read.final_time = timestamp()
      RETURN
        read
    `;
    return util.query(query, params);
  }
  // TODO figure out the best way to get the node labels onto the nodes
  function getUsersUnits(author_ids) {
    console.log('getUsersUnits');
    const params = {
      author_ids,
    };
    const query = `
      MATCH
        (user:Author)<-[:READ]-(note:Note)<-[write:WRITE]-(:Author)
      WHERE
        id(user) IN {author_ids}
      MATCH
        (note)-[read:READ]->(:Author)
      WITH
        collect(DISTINCT user) AS users,
        note,
        write,
        collect(read) AS reads
      OPTIONAL MATCH
        (note)-[link:LINK]-(:Note)
      WITH
        users,
        note,
        write,
        reads,
        collect(link) AS links
      RETURN
        users,
        collect({
          note: note,
          write: write,
          reads: reads,
          links: links
        }) AS units      
    `;

    return util.query(query, params, true)
      .then(results => {
        return results[0]
      });
  }

  function setAuthors(authors = []) {
    if (authors.length === 0) {
      return Promise.resolve({});
    }
    console.log('setAuthors');
    const params = {
      authors
    };
    const query = `
      UNWIND
        {authors} AS author2
      MATCH
        (author:Author)
      WHERE
        id(author) = author2.id
      SET
        author += author2
      RETURN
        author
    `;
    return util.query(query, params)
      .then(authors => {
        return {
          node_by_id: authors.reduce(util.assignById, {})
        };
      });
  }

  function setReads(author, reads = []) {
    // write holds a copy of the og author's read, so set that too
    if (reads.length === 0) {
      return Promise.resolve({});
    }
    console.log('setReads');

    const params = {
      user_id: author.id,
      reads,
    };
    const query = `
      MATCH (user:Author)
      WHERE id(user) = {user_id}
      WITH
        user
      UNWIND {reads} as read2
      MATCH (user)<-[read:READ]-(note:Note)
      WHERE id(read) = read2.id
      OPTIONAL MATCH (user)-[write:WRITE]->(note)
      SET
        read += read2.properties,
        read.final_time = timestamp(),
        write += read2.properties,
        write.final_time = timestamp()
      RETURN
        read
    `;
    return util.query(query, params)
      .then(reads => {
        return {
          relationship_by_id: reads.reduce(util.assignById, {}),
        };
      });
  }

  function setNotes(author, notes = []) {
    if (notes.length === 0) {
      return Promise.resolve({});
    }
    console.log('setNotes');

    const params = {
      user_id: author.id,
      notes,
    };
    const query = `
      MATCH (user:Author) WHERE id(user) = {user_id}
      WITH
        user
      UNWIND
        {notes} as note2
      MATCH
        (user)<-[:READ]-(note:Note)
      WHERE
        id(note) = note2.id
      SET
        note.position_text = note2.position_text,
        note.momentum_text = note2.momentum_text,
        note.final_time = timestamp()
      RETURN
        note
    `;
    return util.query(query, params)
      .then(notes => {
        return {
          node_by_id: notes.reduce(util.assignById, {}),
        };
      });
  }

  function commitNotes(author, units) {
    console.log('commitNotes');

    const params = {
      user_id: author.id,
      units,
    };
    const query = `
      MATCH (user:Author) WHERE id(user) = {user_id}
      WITH
        user
      UNWIND
        {units} AS unit
      MATCH
        (user)<-[super_read:READ]-(:Note)
      WHERE
        id(super_read) = unit.read.properties.super_read_id
      CREATE
        (user)-[write:WRITE]->(note:Note),
        (user)<-[read:READ]-(note)
      SET
        user.current_read_id = id(read),
        super_read.sub_read_ids = [id(read)] + super_read.sub_read_ids,
        note.position_text = unit.note.position_text,
        note.momentum_text = unit.note.momentum_text,
        note.initial_time = timestamp(),
        write += unit.read.properties,
        write.initial_time = timestamp(),
        read += unit.read.properties,
        read.initial_time = timestamp()
      RETURN
        user,
        collect(super_read) AS super_reads,
        collect({
          note: note,
          write: write,
          reads: [read],
          links: []
        }) AS units
    `;
    return util.query(query, params, true)
      .then(results => {
        const initial_state = {
          node_by_id: {
            [results[0].user.id]: results[0].user,
          },
          relationship_by_id: results[0].super_reads.reduce(util.assignById, {}),
        };
        return results[0].units.reduce(util.assignUnitToState, initial_state);
      });
  }

  function deleteNotes(author, units) {
    console.log('deleteNotes');

    const params = {
      user_id: author.id,
      units,
    };

    const query = `
      MATCH (user:Author) WHERE id(user) = {user_id}
      WITH
        user
      UNWIND
        {units} AS unit
      MATCH
        (user)-[write:WRITE]->(note:Note)
      WHERE
        id(note) = unit.note.id
      DETACH DELETE note
      OPTIONAL MATCH
        (user)<-[super_read:READ]-(:Note)
      WHERE
        id(super_read) = unit.read.properties.super_read_id
      SET
        super_read.sub_read_ids = filter(id IN super_read.sub_read_ids WHERE id <> unit.read.id)
      RETURN
        super_read
    `;
    return util.query(query, params, true)
      .then(super_reads => {
        return {
          relationship_by_id: super_reads.reduce(util.assignById, {}),
        };
      });
  }
}
  
