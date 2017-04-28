const assert = require('assert');

const mindscape = require('../services')
const service = mindscape();

const neo4j = require('neo4j-driver').v1;
const local_neo4j_config = {
  host: 'bolt://localhost:7687',
  user: 'neo4j',
  pass: 'o4jw4lru5H!d3',
};
const { host, user, pass } = local_neo4j_config;
const neo4j_driver = neo4j.driver(host, neo4j.auth.basic(user, pass));

const { NodeLabels, LinkTypes } = require('../src/types');

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

const user = {
  labels: [NodeLabels.Node, NodeLabels.User],
  properties: {
    id: 
  }
}

describe('Dish', () => {
  const session = neo4j_driver.session();
  const tx = session.beginTransaction();

  const vect = [0,1,2,3];

  describe('#init()', done => {
    it('should create a (user:Node:User), (root:Node), (user)<-[def:DEFINE]-(root), (user)-[pres:PRESENT]->(root)', () => {
      return service.init({tx, vect})
        .then(dish => {
          assert();

          done();
        })
        .catch(done);
    });
  });

  describe('#set()', () => {
    it('should save nodes and links', () => {
      return service.set({})
    });

    it('should save nodes w/o links', done => {

    });

    it('should save links w/o nodes', done => {

    });

    it('should coordinate nodes', done => {

    });


  });

  describe('get', () => {
    it('should query the graph, returning {user_id, node_by_id, link_by_id}')
  });

  tx.rollback();
  session.close();
});