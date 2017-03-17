import { NodeLabels, RelationshipTypes } from '../src/types';

import { authentication } from './authentication';

const now = require('lodash').now;
const uuid = require('uuid/v4');

const neo4j = require('neo4j-neo4j_driver').v1;


// neo4j graph database url
module.exports = function({neo4j_driver_config}) {
  const neo4j_driver = neo4j.neo4j_driver(neo4j_driver_config);

  return {
    setFeature,
    getInventory,
  };

  function setFeature({user_id, note_by_id, link_by_id }) {
    return Promise((resolve, reject) => {
      const params = {
        user_id,
        notes: Object.keys(note_by_id || {}).map(id => note_by_id[id]),
        links: Object.keys(link_by_id || {}).map(id => link_by_id[id]),
        mindscape_id: uuid(),
        t_id: uuid(),
        x_id: uuid(),
        y_id: uuid(),
        z_id: uuid(),
        w_t_id: uuid(),
        w_x_id: uuid(),
        w_y_id: uuid(),
        w_z_id: uuid(),
        w_nt_id: uuid(),
        w_nx_id: uuid(),
        w_ny_id: uuid(),
        w_nz_id: uuid(),
      };

      const query = `
        UNWIND {notes} AS note
        FOREACH (is_user_note IN CASE WHEN (note.properties.author_id = {user_id}) THEN [1] ELSE [] |
          MERGE (n:Note {id: note.properties.id})
          SET
            n.delete_t = note.properties.delete_t,
            n.delete_x = note.properties.delete_x,
            n.delete_y = note.properties.delete_y,
            n.delete_z = note.properties.delete_z
          FOREACH (n_is_not_committed IN CASE WHEN n.commit_t IS NULL) THEN [1] ELSE [] |
            SET n += note.properties
            FOREACH (n_is_author IN CASE WHEN (n.id = n.author_id) THEN [1] ELSE [] |
              SET n:Author
            )
            FOREACH (n_is_now_committed IN CASE WHEN (n.commit_t IS NOT NULL) THEN [1] ELSE [] |
              MERGE (mindscape:Note:Author:Coordinator)
                ON CREATE SET
                  mindscape.id = {mindscape_id},
                  mindscape.author_id = {mindscape_id},
                  mindscape.create_t = n.commit_t,
                  mindscape.create_x = n.commit_x,
                  mindscape.create_y = n.commit_y,
                  mindscape.create_z = n.commit_z
              MERGE (mindscape)<-[w_t:WRITE]-(t:Note:T {value: (86400000 * floor(n.commit_t / 86400000))})
                ON CREATE SET
                  t.id = {t_id},
                  t.author_id = mindscape.id,
                  t.create_t = n.commit_t,
                  t.create_x = n.commit_x,
                  t.create_y = n.commit_y,
                  t.create_z = n.commit_z
                  w_t.id = {w_t_id},
                  w_t.author_id = mindscape.id,
                  w_t.create_t = n.commit_t,
                  w_t.create_x = n.commit_x,
                  w_t.create_y = n.commit_y,
                  w_t.create_z = n.commit_z
              MERGE (mindscape)<-[w_x:WRITE]-(x:Note:X {value: round(n.commit_x)})
                ON CREATE SET
                  x.id = {x_id},
                  x.author_id = mindscape.id,
                  x.create_t = n.commit_t,
                  x.create_x = n.commit_x,
                  x.create_y = n.commit_y,
                  x.create_z = n.commit_z,
                  w_x.id = {w_x_id},
                  w_x.author_id = mindscape.id,
                  w_x.create_t = n.commit_t,
                  w_x.create_x = n.commit_x,
                  w_x.create_y = n.commit_y,
                  w_x.create_z = n.commit_z
              MERGE (mindscape)<-[w_y:WRITE]-(y:Note:Y {value: round(n.commit_y)})
                ON CREATE SET
                  y.id = {y_id},
                  y.author_id = mindscape.id,
                  y.create_t = n.commit_t,
                  y.create_x = n.commit_x,
                  y.create_y = n.commit_y,
                  y.create_z = n.commit_z,
                  w_y.id = {w_y_id},
                  w_y.author_id = mindscape.id,
                  w_y.create_t = n.commit_t,
                  w_y.create_x = n.commit_x,
                  w_y.create_y = n.commit_y,
                  w_y.create_z = n.commit_z
              MERGE (mindscape)<-[w_z:WRITE]-(z:Note:Z {value: round(n.commit_z)})
                ON CREATE SET
                  z.id = {z_id},
                  z.author_id = mindscape.id,
                  z.create_t = n.commit_t,
                  z.create_x = n.commit_x,
                  z.create_y = n.commit_y,
                  z.create_z = n.commit_z,
                  w_z.id = {w_z_id},
                  w_z.author_id = mindscape.id,
                  w_z.create_t = n.commit_t,
                  w_z.create_x = n.commit_x,
                  w_z.create_y = n.commit_y,
                  w_z.create_z = n.commit_z
              CREATE
                (t)<-[w_nt:WRITE]-(n),
                (x)<-[w_nx:WRITE]-(n),
                (y)<-[w_ny:WRITE]-(n),
                (z)<-[w_nz:WRITE]-(n)
              SET
                w_nt.id = {w_nt_id},
                w_nt.author_id = mindscape.id,
                w_nt.create_t = n.commit_t,
                w_nt.create_x = n.commit_x,
                w_nt.create_y = n.commit_y,
                w_nt.create_z = n.commit_z,
                w_nx.id = {w_nx_id},
                w_nx.author_id = mindscape.id,
                w_nx.create_t = n.commit_t,
                w_nx.create_x = n.commit_x,
                w_nx.create_y = n.commit_y,
                w_nx.create_z = n.commit_z,
                w_ny.id = {w_ny_id},
                w_ny.author_id = mindscape.id,
                w_ny.create_t = n.commit_t,
                w_ny.create_x = n.commit_x,
                w_ny.create_y = n.commit_y,
                w_ny.create_z = n.commit_z,
                w_nz.id = {w_nz_id},
                w_nz.author_id = mindscape.id,
                w_nz.create_t = n.commit_t,
                w_nz.create_x = n.commit_x,
                w_nz.create_y = n.commit_y,
                w_nz.create_z = n.commit_z
            )
          )
        )
        MATCH (n:Note {id: note.properties.id})
        OPTIONAL MATCH
          (t)<-[w_nt:WRITE]-(n),
          (x)<-[w_nx:WRITE]-(n),
          (y)<-[w_ny:WRITE]-(n),
          (z)<-[w_nz:WRITE]-(n)
        WITH
          n,
          t,
          x,
          y,
          z,
          w_nt,
          w_nx,
          w_ny,
          w_nz
        UNWIND {links} AS link
        FOREACH (is_user_link IN CASE WHEN link.properties.author_id = {user_id} THEN [1] ELSE [] END |
          MATCH (n1:Note {id: link.properties.start_id}), (n2:Note {id: link.properties.end_id})
          FOREACH (is_current IN CASE WHEN link.type = 'CURRENT'
          FOREACH (is_write IN CASE WHEN link.type = 'WRITE' THEN [1] ELSE [] END |
            MERGE (n1)-[w:WRITE {id: link.properties.id}]->(n2)
            SET w += link.properties
          )
          FOREACH (is_read IN CASE WHEN link.type = 'READ' THEN [1] ELSE [] END |
            MERGE (n1)-[r:READ {id: link.properties.id}]->(n2)
            SET r += link.properties
          )
        )
        MATCH ()-[l:WRITE|READ {id: link.properties.id}]->()
        RETURN
          n,
          t,
          x,
          y,
          z,
          w_nt,
          w_nx,
          w_ny,
          w_nz,
          l
      `;

      const state = {
        user_id,
        note_by_id: {},
        link_by_id: {},
      };

      let record_count = 0;

      neo4j_driver.session
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

            const w_nt = record.get('w_nt');
            state.link_by_id[w_nt.properties.id] = w_nt;

            const w_nx = record.get('w_nx');
            state.link_by_id[w_nx.properties.id] = w_nx;

            const w_ny = record.get('w_ny');
            state.link_by_id[w_ny.properties.id] = w_ny;

            const w_nz = record.get('w_nz');
            state.link_by_id[z.properties.id] = w_nz;

            const l = record.get('l');
            state.link_by_id[l.properties.id] = l;
          },
          onCompleted: metadata => {
            console.log('record_count', record_count);
            console.log(metadata);
            session.close();
            resolve(state);
          },
          onError: error => {
            console.error(error);
            reject(error)
          },
        });
  }

  function getInventory(user_id) {
    return new Promise((resolve, reject) => {
      const params = {
        user_id
      };
      const query = `
        MATCH (user:Note:Author {id: {user_id}})
        OPTIONAL MATCH ()-[:READ {author_id: {user_id}}]->(note:Note)
        OPTIONAL MATCH (note)-[link:WRITE|READ]-(note2:Note)
        RETURN
          user,
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

      neo4j_driver.session
        .run(query, params)
        .subscribe({
          onNext: record => {
            record_count++;

            const user = record.get('user');
            state.note_by_id[user.properties.id] = user;

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
          onError: error => {
            console.error(error);
            reject(error)
          },
        });
    });
  }

}

