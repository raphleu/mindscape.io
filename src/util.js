
export function getLocalState() {
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

export function setLocalState(state) {
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

export function getHeaders(user_id) {
  const {user_ids, token_by_id} = getLocalState();

  const tokens = user_id
    ? [token_by_id[user_id]]
    : user_ids.map(user_id => token_by_id[user_id]);

  return new Headers({
    'Content-Type': 'application/json',
    'tokens': JSON.stringify(tokens),
  });
}

export function getSuperReads(state, read_id) {
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

export function filterSubReadId(read, removal_id) {
  return Object.assign({}, read, {
    properties: Object.assign({}, read.properties, {
      sub_read_ids: read.properties.sub_read_ids.filter(sub_read_id => sub_read_id !== removal_id),
    }),
  })
}


export function dropNote(props, monitor, component, position_mode) {
     if (monitor.didDrop() || !(monitor.canDrop())) {
      return; // drop was handled by child dropTarget
    }
    const item = monitor.getItem();

    // Determine mouse position
    const targetClientRect = findDOMNode(component).getBoundingClientRect();

    const cursorClientOffset = monitor.getClientOffset();
    const cursorY = cursorClientOffset.y - targetClientRect.top;
    const cursorX = cursorClientOffset.x - targetClientRect.left;

    const targetMiddleY = (targetClientRect.bottom - targetClientRect.top) / 2;

    // collect relationships to edit
    const edit_relationships = [];

    // remove the item from super_read
    const super_read = merge({}, item.reads[1]);
    super_read.properties.sub_read_ids = super_read.properties.sub_read_ids.filter(read_id => (read_id !== item.reads[0].id));

    // push item onto next super_read
    let next_super_read;
    if (props.reads[1].id === item.reads[1].id) {
      // super_read doesn't change
      next_super_read = super_read;
    }
    else {
      edit_relationships.push(super_read);

      next_super_read = merge({}, props.reads[1]);
    }
    const drop_index = next_super_read.properties.sub_read_ids.indexOf(props.read[0].id);
    const next_index = (cursorY < targetMiddleY)
      ? drop_index
      : drop_index + 1;
    next_super_read.properties.sub_read_ids.splice(next_index, 0, item.reads[0].id);
    edit_relationships.push(next_super_read);

    // update item read
    const read = merge({}, item.reads[0], {
      properties: {
        position_mode: PositionModes.SEQUENCE,
        super_read_id: props.reads[1].id,
        x: 0,
        y: 0,
        //TODO change read.x,y to animate arrow movement?
      },
    });
    edit_relationships.push(read);

    console.log(edit_relationships);

    props.editRelationships(edit_relationships, 'Move note into note');
}