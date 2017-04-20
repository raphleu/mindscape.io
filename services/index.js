const { NodeLabels, LinkTypes } = require('../src/types');
const { authentication } = require('./authentication');

const now = require('lodash').now;
const uuid = require('uuid/v4');

const neo4j = require('neo4j-driver').v1;

// neo4j graph database url
module.exports = function({neo4j_driver_config}) {
  const { host, user, pass } = neo4j_driver_config;
  const neo4j_driver = neo4j.driver(host, neo4j.auth.basic(user, pass));

  return {
    getPresentation,
    setGraph,
    getNewUser,
    logoutUser,
    editUser,
    getUserId,
  };


  function queryGraph({ user_id, query, params }) {
    return new Promise((resolve, reject) => {
      const state = {
        user_id,
        node_by_id: {},
        link_by_id: {},
      };
      let record_count = 0;

      const session = neo4j_driver.session();

      session.run(query, params).subscribe({
        onNext: record => {
          record.forEach((val, key, rec) => {
            if (val && val.labels) {
              state.node_by_id[val.properties.id] = val;
            }
            else if (val && val.type) {
              state.link_by_id[val.properties.id] = val;
            }
          });
          record_count++;
        },
        onCompleted: metadata => {
          session.close();
          resolve(state);
          //console.log('metadata', metadata);
          console.log('state', state.user_id, state.node_by_id, state.link_by_id);
          //console.log('record_count', record_count);
        },
        onError: err => {
          reject(err);
        },
      });
    });
  }

  function getPresentation({ vect, user_id }) {
    console.log('getPresentation', vect, user_id);
    if (vect == null || user_id == null) {
      return Promise.resolve({});
    }

    const params = {
      vect,
      user_id,
    };

    const query = `
      MATCH (user:Node:User {id: {user_id}})
      SET user.commit_vect = {vect}
      WITH user
      MATCH (user)-[:PRESENT* {hide_vect: [], user_id: {user_id}}]->(node:Node)
      OPTIONAL MATCH (node)-[link:DEFINE|PRESENT]-(node2:Node)
      RETURN
        user,
        node,
        link,
        node2
    `;

    return queryGraph({user_id, query, params});
  }

  function setGraph({ user_id, node_by_id, link_by_id }) {
    console.log('setGraph', user_id, node_by_id, link_by_id);
    // setGraph sets the graph specified in params (links must connect existing nodes)
    // setGraph has a sideeffect where
    //   when you commit a node, the node DEFINEs into the coordinate Nodes corresponding with the commit_vect
    //   to commit a node, we need a node.commit_vect object (outside the properties, to show that this commit is fresh)
    if (user_id == null) {
      return Promise.resolve({});
    }

    const params = {
      user_id,
      nodes: Object.keys(node_by_id || {}).map(node_id => node_by_id[node_id]),
      links: Object.keys(link_by_id || {}).map(link_id => link_by_id[link_id]),
      o_id: uuid(), // for initial coordination
    };

    const query = `
      UNWIND CASE WHEN {nodes} = [] THEN [NULL] ELSE {nodes} END AS node
      MERGE (n:Node {id: node.properties.id})
      ON CREATE SET
        n.init_vect = [timestamp(), 0, 0, 0],
        n.edit_vect = [],
        n.hide_vect = [],
        n.commit_vect = [],
        n.user_id = {user_id},
        n.exp = ''
      FOREACH (has_permission IN CASE WHEN n.user_id = {user_id} THEN [1] ELSE [] END |
        FOREACH (set_hide_vect IN CASE WHEN node.properties.hide_vect IS NOT NULL THEN [1] ELSE [] END |
          SET n.hide_vect = node.properties.hide_vect
        )
        FOREACH (not_committed IN CASE WHEN n.commit_vect = [] THEN [1] ELSE [] END |
          SET n += node.properties
        )
        FOREACH (is_user IN CASE WHEN n.id = n.user_id THEN [1] ELSE [] END |
          SET n:User
        )
        FOREACH (do_coordination IN CASE WHEN node.coord_vect IS NOT NULL THEN [1] ELSE [] END |
          MERGE (o:Node:User:Coord)
          ON CREATE SET
            o.init_vect = [timestamp(), 0, 0, 0],
            o.edit_vect = [],
            o.commit_vect = [],
            o.hide_vect = [],
            o.id = {o_id},
            o.user_id = {o_id},
            o.exp = 'Coordinator Node\nthe origin/root of the coordinate tree'
          FOREACH (i IN range(0, length(node.coords)) |
            MERGE (c:Node:Coord {i: i, exp: node.coords[i]['exp']})
            ON CREATE SET
              c.init_vect = [timestamp(), 0, 0, 0],
              c.edit_vect = [],
              c.commit_vect = [],
              c.hide_vect = [],
              c.id = node.coords[i]['node_id'],
              c.user_id = o.id
            CREATE (c)<-[d:DEFINE]-(n)
            SET
              d.init_vect = [timestamp(), 0, 0, 0],
              d.select_vect = [],
              d.edit_vect = [],
              d.hide_vect = [],
              d.id = node.coords[i]['def_id'],
              d.user_id = o.id,
              d.end_id = c.id,
              d.in_index = NULL,
              d.start_id = n.id,
              d.out_index = NULL
          )
        )
      )
      WITH node
      UNWIND CASE WHEN {links} = [] THEN [NULL] ELSE {links} END AS link
      MATCH (start:Node {id: link.properties.start_id}), (end:Node {id: link.properties.end_id})
      FOREACH (is_define IN CASE WHEN link.type = 'DEFINE' THEN [1] ELSE [] END |
        MERGE (end)<-[d:DEFINE {id: link.properties.id}]-(start)
        ON CREATE SET
          d.init_vect = [timestamp(), 0 , 0, 0],
          d.select_vect = [],
          d.edit_vect = [],
          d.hide_vect = [],
          d.user_id = {user_id}
        FOREACH (has_permission IN CASE WHEN d.user_id = {user_id} THEN [1] ELSE [] END |
          SET d += link.properties
        )
      )
      FOREACH (is_present IN CASE WHEN link.type = 'PRESENT' THEN [1] ELSE [] END |
        MERGE (start)-[p:PRESENT {id: link.properties.id}]->(end)
        ON CREATE SET
          p.init_vect = [timestamp(), 0 , 0, 0],
          p.select_vect = [],
          p.edit_vect = [],
          p.hide_vect = [],
          p.user_id = {user_id},
          p.enlist = true,
          p.vect = [0, 0, 0, 0],
          p.open = true,
          p.list = true
        FOREACH (has_permission IN CASE WHEN p.user_id = {user_id} THEN [1] ELSE [] END |
          SET p += link.properties
        )
      )
      WITH
        node,
        link
      MATCH
        ()-[l:DEFINE|PRESENT {id: link.properties.id}]->(),
        (n:Node {id: node.properties.id})-[l2:DEFINE|PRESENT]-(n2:Node)
      RETURN 
        l,
        l2,
        n,
        n2
    `;

    return queryGraph({user_id, query, params})
  }

  function getNewUser({ vect }) {
    console.log('getNewUser', vect);
    const user_id = uuid();
    const def_id = uuid();
    const pres_id = uuid();
    const root_id = uuid();

    return setGraph({ // init and return a new (anonymous) author
      user_id,
      node_by_id: {
        [user_id]: {
          labels: [NodeLabels.Node, NodeLabels.User],
          properties: {
            init_vect: vect,
            id: user_id,
          },
        },
        [root_id]: {
          labels: [NodeLabels.Node],
          properties: {
            init_vect: vect,
            id: root_id,
          },
        },
      },
      link_by_id: {
        [def_id]: {
          type: LinkTypes.DEFINE,
          properties: {
            init_vect: vect,
            id: def_id,
            end_id: user_id,
            in_index: 0,
            start_id: root_id,
            out_index: 0,
          },
        },
        [pres_id]: {
          type: LinkTypes.PRESENT,
          properties: {
            init_vect: vect,
            id: pres_id,
            start_id: user_id,
            out_index: 0,
            end_id: root_id,
            in_index: 0,
            list: false,
          },
        },
      },
    });
  }

  function logoutUser({ vect, user_id }) {
    console.log('logoutUser', vect, user_id);
    return setGraph({
      user_id,
      node_by_id: {
        [user_id]: {
          properties: {
            hide_vect: vect,
          },
        },
      },
    });
  }

  function editUser({ vect, user_id, edit_name, edit_email, edit_pass }) {
    console.log('editUser', vect, user_id);

    return Promise.resolve(edit_pass ? authentication.hashPass(edit_pass) : null)
    .then(hash => {
      const properties = {
        edit_vect: vect,
        exp: edit_name,
        email: edit_email,
      };
      if (hash) {
        properties.hash = hash;
      }

      return setGraph({
        user_id,
        node_by_id: {
          [user_id]: {
            properties,
          },
        },
      });
    });
  }

  function getUserId({ vect, name, pass }) {
    console.log('getUserId', vect, name, pass);
    return new Promise((resolve, reject) => {
      const params = {
        name,
        pass,
      };

      const query = `
        MATCH (user:Node:User {exp: {name}})
        RETURN user
      `

      let user;
      const session = neo4j_driver.session()

      session.run(query, params).subscribe({
        onNext: record => {
          user = record.get('user');
        },
        onCompleted: metadata => {
          console.log(metadata);
          if (user) {
            const { id, hash } = user.properties;
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
                  resolve({user_id: null});
                }
              });
            }
          }
          else {
            resolve({user_id: null});
          }
        },
        onError: err => {
          reject(err);
        }
      })
    })
  }

}

