const assert = require('assert');

const mindscape = require('../services')
const service = mindscape();

const uuid = require('uuid/v4');

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

describe('Dish', () => {
  describe('#seed()', () => {
    const session = neo4j_driver.session();
    const tx = session.beginTransaction();
    const vect = [0,1,2,3];
    const user_id = uuid();

    let result;

    before(() => {
      return service.seed({tx, vect, user_id}).then(dish => {
        result = dish;
      });
    });

    after(() => {
      tx.rollback();
      session.close();
    })

    it('should create 2 nodes', () => {
      assert(Object.keys(result.node_by_id).length === 2);
    })

    it('should create 2 links', () => {
      assert(Object.keys(result.link_by_id).length === 2);
    })
  });

  describe('#set()', () => {
    it('should save nodes and links', () => {

    });

    it('should save nodes w/o links', () => {

    });

    it('should save links w/o nodes', () => {

    });

    it('should coordinate nodes', () => {

    });


  });

  describe('get', () => {
    it('should query the graph, returning {user_id, node_by_id, link_by_id}')
  });
});