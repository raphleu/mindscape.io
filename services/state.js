
const { PositionModes, DisplayModes, SequenceDirections } = require('../src/types.js');

module.exports = state;

function state(util) {
  return {
    getState,
  };

  function getState(token_by_id) {
    return Promise.resolve(token_by_id)
      .then(token_by_id => { // get new Author if we don't have any valid tokens
        console.log('token_by_id', token_by_id)
        if (Object.keys(token_by_id).length > 0) {
          return token_by_id;
        }
        else {
          return newAuthor()
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
      .then(token_by_id => { // before we getState, add bonus notes to users' reading notes
        const author_ids = Object.keys(token_by_id).map(parseInt);

        return getBonusNoteIds()
          .then(bonus_note_ids => addUserReadNotes(author_ids, bonus_note_ids))
          .then(reads => token_by_id); // we still need token_by_id 
      })
      .then(token_by_id => { // get the state, built out of users and their reading
        const author_ids = Object.keys(token_by_id).map(parseInt);

        return getUserReadNotes(author_ids)
          .then(result => {
            const {users, units} = result;

            const initial_state = {
              user_ids: author_ids,
              token_by_id,
              node_by_id: users.reduce(util.assignById, {}),
              relationship_by_id: {},
            };

            return units.reduce((state, unit) => {
              return Object.assign({}, state,
                {
                  node_by_id: Object.assign({}, state.node_by_id,
                    {
                      [unit.node.id]: Object.assign({}, 
                        unit.node,
                        {
                          write_id: unit.write.id,
                          read_ids: unit.reads.map(read => read.id),
                          link_ids: unit.links.map(link => link.id),                  
                        }
                      ),
                    }
                  ),
                  relationship_by_id: Object.assign({}, state.relationship_by_id,
                    {
                      [unit.write.id]: unit.write,
                    },
                    unit.reads.reduce(util.assignById, {}),
                    unit.links.reduce(util.assignById, {})
                  ),
                }
              );
            }, initial_state);
          });
      });
  }

  function newAuthor() {
    console.log('newAuthor');
    const params = {
      author_props: {
        name_text: 'anonymous',
        registered: false,
      },
      root_props: {
        position_text: 'root',
        momentum_text: null,
      },
      read_props: {
        super_read_id: null,
        position_mode: PositionModes.SEQUENCE,
        x: 0,
        y: 0,
        display_mode: DisplayModes.PLANE,
        plane_radius: 800,
        sub_read_ids: [],
        sequence_direction: SequenceDirections.DOWN,
      },
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
        write += {read_props},
        write.initial_time = timestamp(),
        read += {read_props},
        read.initial_time = timestamp()
      RETURN 
        author,
        note
    `;
    return util.query(query, params)
      .then(results => results[0].author);
  }

  function getUserReadNotes(author_ids) {
    console.log('getUserReadNotes');
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
      OPTIONAL MATCH
        (note)<-[link:LINK]-(:Note)
      WITH
        collect(DISTINCT user) AS users,
        note,
        write,
        collect(read) AS reads,
        collect(link) AS links
      RETURN
        users,
        collect({
          node: note,
          write: write,
          reads: reads,
          links: links
        }) AS units      
    `;

    return util.query(query, params)
      .then(results => {
        console.log(results);
        return results[0]
      });
  }

  function addUserReadNotes(author_ids, note_ids) {
    console.log('addUserReadNotes');
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

  function getBonusNoteIds() {
    console.log('getBonusNoteIds');
    return Promise.resolve([
      12, /* current time note id */
      33, /* current space note id */ 
    ]);
  }
}
  
