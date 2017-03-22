const { NodeLabels, RelationshipTypes, NotePositions, NoteDisplays, NoteBodies } = require('../src/types');
const { authentication } = require('./authentication');

const now = require('lodash').now;
const uuid = require('uuid/v4');

const neo4j = require('neo4j-driver').v1;


// neo4j graph database url
module.exports = function({neo4j_driver_config}) {
  const { host, user, pass } = neo4j_driver_config;
  const neo4j_driver = neo4j.driver(host, neo4j.auth.basic(user, pass));

  return {
    setGraph,
    getNewAuthor,
    getAuthorId,
    getPresence,
  };

  function setGraph({user_id, note_by_id, link_by_id }) {
    console.log('setGraph', user_id, note_by_id, link_by_id);
    return new Promise((resolve, reject) => {
      const params = {
        user_id,
        notes: Object.keys(note_by_id || {}).map(id => note_by_id[id]),
        links: Object.keys(link_by_id || {}).map(id => link_by_id[id]),
        c_id: uuid(),
        t_id: uuid(),
        x_id: uuid(),
        y_id: uuid(),
        z_id: uuid(),
        d_tc_id: uuid(),
        d_xc_id: uuid(),
        d_yc_id: uuid(),
        d_zc_id: uuid(),
      };

      // to commit a note, we need a note.commit object with 4 uuid, one for each coordinate definition
      const query = `
        UNWIND {notes} AS note
        FOREACH (is_user_note IN CASE WHEN note.properties.author_id = {user_id} THEN [1] ELSE [] END|
          MERGE (n:Note {id: note.properties.id})
          SET
            n.delete_t = note.properties.delete_t,
            n.delete_x = note.properties.delete_x,
            n.delete_y = note.properties.delete_y,
            n.delete_z = note.properties.delete_z
          FOREACH (n_is_not_committed IN CASE WHEN n.commit_t IS NULL THEN [1] ELSE [] END |
            SET n += note.properties
            FOREACH (n_is_author IN CASE WHEN n.id = n.author_id THEN [1] ELSE [] END |
              SET n:Author
            )
            FOREACH (n_is_now_committed IN CASE WHEN n.commit_t IS NOT NULL THEN [1] ELSE [] END |
              MERGE (c:Note:Author:Coordinator)
                ON CREATE SET
                  c.id = {c_id},
                  c.author_id = {c_id},
                  c.create_t = n.commit_t,
                  c.create_x = n.commit_x,
                  c.create_y = n.commit_y,
                  c.create_z = n.commit_z
              MERGE (c)<-[d_tc:DEFINE]-(t:Note:T {value: (86400000 * floor(n.commit_t / 86400000))})
                ON CREATE SET
                  t.id = {t_id},
                  t.author_id = c.id,
                  t.create_t = n.commit_t,
                  t.create_x = n.commit_x,
                  t.create_y = n.commit_y,
                  t.create_z = n.commit_z,
                  d_tc.id = {d_tc_id},
                  d_tc.author_id = c.id,
                  d_tc.create_t = n.commit_t,
                  d_tc.create_x = n.commit_x,
                  d_tc.create_y = n.commit_y,
                  d_tc.create_z = n.commit_z
              MERGE (c)<-[d_xc:DEFINE]-(x:Note:X {value: round(n.commit_x)})
                ON CREATE SET
                  x.id = {x_id},
                  x.author_id = c.id,
                  x.create_t = n.commit_t,
                  x.create_x = n.commit_x,
                  x.create_y = n.commit_y,
                  x.create_z = n.commit_z,
                  d_xc.id = {d_xc_id},
                  d_xc.author_id = c.id,
                  d_xc.create_t = n.commit_t,
                  d_xc.create_x = n.commit_x,
                  d_xc.create_y = n.commit_y,
                  d_xc.create_z = n.commit_z
              MERGE (c)<-[d_yc:DEFINE]-(y:Note:Y {value: round(n.commit_y)})
                ON CREATE SET
                  y.id = {y_id},
                  y.author_id = c.id,
                  y.create_t = n.commit_t,
                  y.create_x = n.commit_x,
                  y.create_y = n.commit_y,
                  y.create_z = n.commit_z,
                  d_yc.id = {d_yc_id},
                  d_yc.author_id = c.id,
                  d_yc.create_t = n.commit_t,
                  d_yc.create_x = n.commit_x,
                  d_yc.create_y = n.commit_y,
                  d_yc.create_z = n.commit_z
              MERGE (c)<-[d_zc:DEFINE]-(z:Note:Z {value: round(n.commit_z)})
                ON CREATE SET
                  z.id = {z_id},
                  z.author_id = c.id,
                  z.create_t = n.commit_t,
                  z.create_x = n.commit_x,
                  z.create_y = n.commit_y,
                  z.create_z = n.commit_z,
                  d_zc.id = {d_zc_id},
                  d_zc.author_id = c.id,
                  d_zc.create_t = n.commit_t,
                  d_zc.create_x = n.commit_x,
                  d_zc.create_y = n.commit_y,
                  d_zc.create_z = n.commit_z
              CREATE
                (t)<-[d_nt:DEFINE]-(n),
                (x)<-[d_nx:DEFINE]-(n),
                (y)<-[d_ny:DEFINE]-(n),
                (z)<-[d_nz:DEFINE]-(n)
              SET
                d_nt.id = note.d_nt_id,
                d_nt.author_id = c.id,
                d_nt.create_t = n.commit_t,
                d_nt.create_x = n.commit_x,
                d_nt.create_y = n.commit_y,
                d_nt.create_z = n.commit_z,
                d_nx.id = note.d_nx_id,
                d_nx.author_id = c.id,
                d_nx.create_t = n.commit_t,
                d_nx.create_x = n.commit_x,
                d_nx.create_y = n.commit_y,
                d_nx.create_z = n.commit_z,
                d_ny.id = note.d_ny_id,
                d_ny.author_id = c.id,
                d_ny.create_t = n.commit_t,
                d_ny.create_x = n.commit_x,
                d_ny.create_y = n.commit_y,
                d_ny.create_z = n.commit_z,
                d_nz.id = note.d_nz_id,
                d_nz.author_id = c.id,
                d_nz.create_t = n.commit_t,
                d_nz.create_x = n.commit_x,
                d_nz.create_y = n.commit_y,
                d_nz.create_z = n.commit_z
            )
          )
        )
        WITH note
        MATCH (n:Note {id: note.properties.id})
        OPTIONAL MATCH
          (t:Note:T)<-[d_nt:DEFINE]-(n),
          (x:Note:X)<-[d_nx:DEFINE]-(n),
          (y:Note:Y)<-[d_ny:DEFINE]-(n),
          (z:Note:Z)<-[d_nz:DEFINE]-(n)
        WITH
          n,
          t,
          x,
          y,
          z,
          d_nt,
          d_nx,
          d_ny,
          d_nz
        UNWIND {links} AS link
        MATCH (n1:Note {id: link.properties.start_id}), (n2:Note {id: link.properties.end_id})
        FOREACH (is_user_link IN CASE WHEN link.properties.author_id = {user_id} THEN [1] ELSE [] END |
          FOREACH (is_define IN CASE WHEN link.type = 'DEFINE' THEN [1] ELSE [] END |
            MERGE (n1)-[l:DEFINE {id: link.properties.id}]->(n2)
            SET l += link.properties
          )
          FOREACH (is_present IN CASE WHEN link.type = 'PRESENT' THEN [1] ELSE [] END |
            MERGE (n1)-[l:PRESENT {id: link.properties.id}]->(n2)
            SET l += link.properties
          )
        )
        WITH
          n,
          t,
          x,
          y,
          z,
          d_nt,
          d_nx,
          d_ny,
          d_nz,
          link
        MATCH ()-[l:DEFINE|PRESENT {id: link.properties.id}]->()
        RETURN
          n,
          t,
          x,
          y,
          z,
          d_nt,
          d_nx,
          d_ny,
          d_nz,
          l
      `;

      const state = {
        user_id,
        note_by_id: {},
        link_by_id: {},
      };

      let record_count = 0;

      neo4j_driver.session()
        .run(query, params)
        .subscribe({
          onNext: record => {
            record_count++;

            const n = record.get('n');
            state.note_by_id[n.properties.id] = n;

            const t = record.get('t');
            state.note_by_id[t.properties.id] = t;

            const x = record.get('x');
            state.note_by_id[x.properties.id] = x;

            const y = record.get('y');
            state.note_by_id[y.properties.id] = y;

            const z = record.get('z');
            state.note_by_id[z.properties.id] = z;

            const d_nt = record.get('d_nt');
            state.link_by_id[d_nt.properties.id] = d_nt;

            const d_nx = record.get('d_nx');
            state.link_by_id[d_nx.properties.id] = d_nx;

            const d_ny = record.get('d_ny');
            state.link_by_id[d_ny.properties.id] = d_ny;

            const d_nz = record.get('d_nz');
            state.link_by_id[z.properties.id] = d_nz;

            const l = record.get('l');
            state.link_by_id[l.properties.id] = l;
          },
          onCompleted: metadata => {
            console.log('record_count', record_count);
            console.log(metadata);
            session.close();
            resolve(state);
          },
          onError: err => {
            reject(err);
          },
        });
    });
  }

  function getNewAuthor({t, x, y, z}) {
    console.log('getNewAuthor', t, x, y, z);
    const author_id = uuid();
    const present_id = uuid();

    return setGraph({ // create and return a new (anonymous) author
      user_id: author_id,
      note_by_id: {
        [author_id]: {
          properties:{
            id: author_id,
            author_id,
            value: author_id,
            create_t: t,
            create_x: x,
            create_y: y,
            create_z: z,
          },
        },
      },
      link_by_id: {
        [present_id]: {
          properties: {
            id: present_id,
            start_id: author_id,
            end_id: author_id,
            author_id,
            out_index: 0,
            in_index: 0,
            current: 1, // if a PRESENT is on the current_path (of PRESENTs) from Author to current_Note (the selected Note), this is the index (min = 1) from the current_Note; here, we indicate the Author is the current_Note
            frame: 1, // if a PRESENT is on the frame_path (of PRESENTs) form Author to frame_Note (the maximized Note), this is the index (min = 1) from the frame_Note; here, we indicate that the Author is the frame_Note
            position: NotePositions.STATIC,
            x: 0,
            y: 0,
            display: NoteDisplays.BODY,
            body: NoteBodies.PLANE,
            create_t: t,
            create_x: x,
            create_y: y,
            create_z: z,
          },
        },
      },
    });
  }

  function getAuthorId({name, pass}) {
    return new Promise((resolve, reject) => {
      const params = {
        name,
        pass,
      };

      const query = `
        MATCH (a:Note:Author {value: {name}})
        RETURN a
      `

      let user;
      neo4j_driver.session()
        .run(query, params)
        .subscribe({
          onNext: record => {
            a = record.get('a');
          },
          onCompleted: metadata => {
            console.log(metadata);
            if (a) {
              const { id, hash } = a.properties;
              if (pass == null && hash == null) {
                resolve({user_id: id});
              }
              else if (pass != null && hash != null) {
                authentication.comparePassword({pass, hash})
                  .then(is_match => {
                    if (is_match) {
                      resolve({user_id: id});
                    }
                    else {
                      reject(new Error('invalid pass'));
                    }
                  });
              }
            }
            else {
              reject(new Error('no user with that name'));
            }
          },
          onError: err => {
            reject(err);
          }
        })
    })
  }

  function getPresence(user_id) {
    return new Promise((resolve, reject) => {
      const params = {
        user_id
      };
      const query = `
        MATCH ()-[:PRESENT {author_id: {user_id}}]->(note:Note)
        OPTIONAL MATCH (note)-[link:DEFINE|PRESENT]-(note2:Note)
        RETURN
          note,
          link,
          note2
      `;

      const state = {
        user_id,
        note_by_id: {},
        link_by_id: {},
      };

      let record_count = 0;

      neo4j_driver.session()
        .run(query, params)
        .subscribe({
          onNext: record => {
            record_count++;

            const note = record.get('note');
            state.note_by_id[note.properties.id] = note;

            const link = record.get('link');
            state.link_by_id[link.properties.id] = link;

            const note2 = record.get('note2');
            state.note_by_id[note2.properties.id] = note2;
          },
          onCompleted: metadata => {
            console.log('record_count', record_count);
            console.log(metadata);
            session.close();
            resolve(state);
          },
          onError: err => {
            reject(err)
          },
        });
    });
  }


}

