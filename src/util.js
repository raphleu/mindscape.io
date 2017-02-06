module.exports = (function() {
  return  {
    getLocalState,
    setLocalState,
    getHeaders,
    getSuperReads,
  };


  function getLocalState() {
    const user_ids = JSON.parse(localStorage.getItem('user_ids')) || [];

    const token_by_id = {};
    user_ids.forEach(user_id => {
      const token = localStorage.getItem('token-'+user_id);
      token_by_id[user_id] = token;
    });

    const state = {
      user_ids,
      token_by_id,
    };

    return state;
  }

  function setLocalState(state) {
    // TODO validate state?
    if (state.user_ids) {
      localStorage.setItem('user_ids', JSON.stringify(state.user_ids));
    }
    if (state.token_by_id) {
      Object.keys(state.token_by_id).forEach(user_id => {
        localStorage.setItem('token-'+user_id, state.token_by_id[user_id]);
      });
    }
  }

  function getHeaders(user_id) {
    const {user_ids, token_by_id} = getLocalState();

    const tokens = user_id
      ? [token_by_id[user_id]]
      : user_ids.map(user_id => token_by_id[user_id]);

    return new Headers({
      'Content-Type': 'application/json',
      'tokens': JSON.stringify(tokens),
    });
  }

  function getSuperReads(state, read_id) {
    // returns a list of super_reads, starting with read with read_id

    const reads = getReads(state, read_id, []);
    return reads;

    function getReads(state, read_id, reads) {
      const read = state.relationship_by_id[read_id];

      if (read == null) {
        return reads;
      }

      return getReads(state, read.properties.super_read_id, [...reads, read]);
    };
  }
})();

