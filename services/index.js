const { NodeLabels, LinkTypes } = require('../lib/types');
const { auth } = require('./auth');

const now = require('lodash').now;
const uuid = require('uuid/v4');

// neo4j graph database url
module.exports = function() {
  return {
    seed,
    set,
    get,
    login,
    logout,
  };

  function dishQuery({ tx, query, params }) {
    return new Promise((resolve, reject) => {
      const dish = {
        node_by_id: {},
        link_by_id: {},
      };

      tx.run(query, params).subscribe({
        onNext: record => {
          record.forEach(val => {
            if (val) {
              if (val.labels) {
                dish.node_by_id[val.properties.id] = val;
              }
              else if (val.type) {
                dish.link_by_id[val.properties.id] = val;
              }
            }
          });
        },
        onCompleted: metadata => {
          console.log('dish', dish);
          resolve(dish);
        },
        onError: error =>{
          reject(error);
        }
      });
    });
  }

  function seed({ tx, user_id, vect, google, facebook, pass }) {
    console.log('seed', user_id, vect);

    const root_id = uuid();

    const params = {
      user: {
        id: user_id,
        user_id,
        exp: '',
        init_v: vect,
        edit_v: [],
        commit_v: [],
        hide_v: [],
        google,
        facebook,
        pass,
      },
      root: {
        id: root_id,
        user_id,
        exp: '',
        init_v: vect,
        edit_v: [],
        commit_v: [],
        hide_v: [],
      },
      def: {
        id: uuid(),
        user_id,
        start_id: root_id,
        out_index: 0,
        end_id: user_id,
        in_index: 0,
        init_v: vect,
        edit_v: [],
        select_v: [],
        hide_v: [],
      },
      pres: {
        id: uuid(),
        user_id,
        start_id: user_id,
        out_index: 0,
        enlist: true,
        v: [0, 0, 0, 0],
        end_id: root_id,
        in_index: 0,
        open: true,
        list: false,
        init_v: vect,
        edit_v: [],
        select_v: [],
        hide_v: [],
      },
    };

    const query = `
      CREATE
        (user:Node:User),
        (root:Node:Root),
        (user)-[def:DEFINE]->(root),
        (user)-[pres:PRESENT]->(root)
      SET
        user = {user},
        root = {root},
        def = {def},
        pres = {pres}
      RETURN
        user,
        root,
        def,
        pres
    `;

    return dishQuery({tx, query, params});
  }

  function set({ tx, user_id, vect, node_by_id, link_by_id }) {
    console.log('set', user_id, node_by_id, link_by_id );
    // set sets the graph specified in params (links must connect existing nodes)
    // if node.coords.isArray(), then set node-DEFINE->coordinates
    // #set() requires a valid user_id; it cannot make users, those are made in #init()

    const params = {
      user_id,
      vect: vect || [now(), 0, 0, 0],
      nodes: Object.keys(node_by_id || {}).map(node_id => {
        //console.log(node_by_id[node_id].properties);
        return node_by_id[node_id];
      }),
      links: Object.keys(link_by_id || {}).map(link_id => {
        //console.log(link_by_id[link_id].properties);
        return link_by_id[link_id];
      }),
      o_id: uuid(), // origin_id, used only for inital coordination on this database
    };

    const query = `
      MATCH (u:Node:User {id:{user_id}})
      SET u.set_v = {vect}
      WITH u
      UNWIND CASE WHEN {nodes} = [] THEN [{properties:{id:''}}] ELSE {nodes} END AS node
      MERGE (n:Node {id:node.properties.id})
      ON CREATE SET
        n.user_id = {user_id},
        n.exp = '',
        n.raw = NULL,
        n.init_v = {vect},
        n.edit_v = [],
        n.commit_v = [],
        n.hide_v = []
      FOREACH (has_permission IN CASE WHEN n.user_id = {user_id} THEN [1] ELSE [] END |
        FOREACH (not_committed IN CASE WHEN n.commit_v = [] THEN [1] ELSE [] END |
          SET n += node.properties
        )
        FOREACH (set_hidden IN CASE WHEN node.properties.hide_v IS NOT NULL THEN [1] ELSE [] END |
          SET n.hide_v = node.properties.hide_v
        )
        FOREACH (do_coordination IN CASE WHEN node.coords IS NOT NULL THEN [1] ELSE [] END |
          MERGE (o:Node:User:Coord)
          ON CREATE SET
            o.id = {o_id},
            o.user_id = {o_id},
            o.exp = 'Origin\nroot of the coordinate tree',
            o.init_v = {vect},
            o.edit_v = [],
            o.commit_v = [],
            o.hide_v = []
          FOREACH (i IN range(0, length(node.coords)) |
            MERGE (o)-[d_oc:DEFINE]->(c:Node:Coord {i:i, exp:node.coords[i]['exp']})
            ON CREATE SET
              c.id = node.coords[i]['node_id'],
              c.user_id = o.id,
              c.init_v = {vect},
              c.edit_v = [],
              c.commit_v = [],
              c.hide_v = [],
              d_oc.id = node.coords[i]['def_oc_id'],
              d_oc.user_id = o.id,
              d_oc.end_id = o.id,
              d_oc.in_index = NULL,
              d_oc.start_id = c.id,
              d_oc.out_index = NULL,
              d_oc.init_v = {vect},
              d_oc.select_v = [],
              d_oc.edit_v = [],
              d_oc.hide_v = []
            CREATE (c)-[d_cn:DEFINE]->(n)
            SET
              d_cn.id = node.coords[i]['def_cn_id'],
              d_cn.user_id = o.id,
              d_cn.start_id = n.id,
              d_cn.out_index = NULL,
              d_cn.end_id = c.id,
              d_cn.in_index= NULL,
              d_cn.init_v = {vect},
              d_cn.select_v = [],
              d_cn.edit_v = [],
              d_cn.hide_v = []
          )
        )
      )
      WITH
        u,
        node
      UNWIND CASE WHEN {links} = [] THEN [{properties:{id:'', start_id:'', end_id:''}}] ELSE {links} END AS link
      MATCH
        (start:Node {id: link.properties.start_id}),
        (end:Node {id: link.properties.end_id})
      FOREACH (is_def IN CASE WHEN link.type = 'DEFINE' THEN [1] ELSE [] END |
        MERGE (start)-[d:DEFINE {id:link.properties.id, start_id:link.properties.start_id, end_id:link.properties.end_id}]->(end)
        ON CREATE SET
          d.user_id = {user_id},
          d.in_index = NULL,
          d.out_index = NULL,
          d.init_v = {vect},
          d.select_v = [],
          d.edit_v = [],
          d.hide_v = []
        FOREACH (has_permission IN CASE WHEN d.user_id = {user_id} THEN [1] ELSE [] END |
          SET d += link.properties
        )
      )
      FOREACH (is_pres IN CASE WHEN link.type = 'PRESENT' THEN [1] ELSE [] END |
        MERGE (start)-[p:PRESENT {id: link.properties.id, start_id: link.properties.start_id, end_id: link.properties.end_id}]->(end)
        ON CREATE SET
          p.user_id = {user_id},
          p.out_index = NULL,
          p.enlist = true,
          p.v = [0, 0, 0, 0],
          p.in_index = NULL,
          p.open = true,
          p.list = true,
          p.init_v = {vect},
          p.select_v = [],
          p.edit_v = [],
          p.hide_v = []
        FOREACH (has_permission IN CASE WHEN p.user_id = {user_id} THEN [1] ELSE [] END |
          SET p += link.properties
        )
      )
      WITH
        u,
        node,
        link
      OPTIONAL MATCH (n:Node {id:node.properties.id})
      WITH
        link,
        n
      OPTIONAL MATCH (n)-[n_l:DEFINE|PRESENT]-(n_l_n:Node)
      WITH
        link,
        n,
        n_l,
        n_l_n
      OPTIONAL MATCH (l_n1:Node)-[l:DEFINE|PRESENT {id:link.properties.id}]->(l_n2:Node)
      WITH
        n,
        n_l,
        n_l_n,
        l,
        l_n1,
        l_n2
      OPTIONAL MATCH (l_n1)-[l_n1_l:DEFINE|PRESENT]-(l_n1_l_n:Node)
      WITH
        n,
        n_l,
        n_l_n,
        l,
        l_n1,
        l_n1_l,
        l_n1_l_n,
        l_n2
      OPTIONAL MATCH (l_n2)-[l_n2_l:DEFINE|PRESENT]-(l_n2_l_n:Node)
      RETURN 
        n,
        n_l,
        n_l_n,
        l,
        l_n1,
        l_n1_l,
        l_n1_l_n,
        l_n2,
        l_n2_l,
        l_n2_l_n
    `;

    // TODO branch off traversing, need to load neighbors
    // TODO branch off coordinating, need to load coords
    return dishQuery({tx, query, params});
  }

  function get({ tx, user_id, vect }) {
    console.log('get', user_id, vect );

    const params = {
      user_id,
      vect: vect || [now(), 0, 0, 0],
    };

    const query = `
      MATCH (u:Node:User {id:{user_id}})
      SET u.get_v = {vect}
      WITH u
      MATCH (u)-[:PRESENT* {user_id:{user_id}, hide_v:[]}]->(n:Node)
      OPTIONAL MATCH (n)-[n_l:DEFINE|PRESENT]-(n_l_n:Node)
      RETURN
        u,
        n,
        n_l,
        n_l_n
    `;

    return dishQuery({tx, query, params});
  }

  function logout({ tx, user_id, vect }) {
    console.log('logout', user_id, vect);

    return set({
      tx,
      user_id,
      vect,
      node_by_id: {
        [user_id]: {
          properties: {
            id: user_id,
            logout_v: vect,
          },
        },
      },
    }).then(() => {
      return {};
    });
  }

  function login({ tx, user_id, vect }) {
    return set({
      tx,
      user_id,
      vect,
      node_by_id: {
        [user_id]: {
          properties: {
            id: user_id,
            login_v: vect,
          },
        },
      },
    }).then(() => {
      return get({tx, user_id, vect});
    });
  }
}
