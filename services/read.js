
const { PositionModes, DisplayModes, SequenceDirections } = require('../src/types.js');

module.exports = read;

function read(util) {
  return {
    setReads,
  };

  function setReads(reads) {
    console.log('setReads');
    const params = {
      reads,
    };
    const query = `
      UNWIND {reads} as read1
      MATCH 
        (user:Author)<-[read:READ]-(note:Note)
      WHERE
        id(read) = read1.id
      OPTIONAL MATCH
        (user)-[write:WRITE]->(note)
      SET
        read += read1.properties,
        read.final_time = timestamp(),
        write += read1.properties,
        write.final_time = timestamp()
      RETURN
        read
    `;
    return util.query(query, params)
      .then(reads => {
        return {
          relationship_by_id: reads.reduce(util.assignById, {})
        };
      });
  }
}
  
