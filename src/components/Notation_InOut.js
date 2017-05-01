import React, { PropTypes } from 'react';
import { Dashboard } from './Dashboard';
import { User } from './User';

import { connect } from 'react-redux';
import { resume } from '../actions';

import { LinkTypes } from '../types';

class Notation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { getVect, user, root_pres, select_press, select_node } = this.props;

    // sync up header and notation to use the same positioning strategy
    return (
      <div id='notation' style={{
        display: 'block',
        whiteSpace: 'nowrap',
      }}>
        <Dashboard
          getVect={getVect}
          user={user}
          select_press={select_press}
          select_node={select_node}
        />
        <User
          getVect={getVect}
          user={user}
          select_press={select_press}
        />
      </div>
    );
  }
}

Notation.propTypes = {
  getVect: PropTypes.func.isRequired,
  auth_user: PropTypes.object,
  user: PropTypes.object,
  select_press: PropTypes.arrayOf(PropTypes.object), 
  select_node: PropTypes.object,
};

export const Notation_InOut = connect(state => {
  const { auth_user, node_by_id, link_by_id, link_by_id_by_start_id } = state;

  if (auth_user == null) {
    return {
      auth_user: null,
      user: null,
      select_press: [],
      select_node: null,
    };
  }

  const user_id = auth_user.uid;

  let root_pres;
  Object.keys(link_by_id_by_start_id[user_id]).some(link_id => { 
    root_pres = link_by_id[link_id]; 
    return true;
  }); // assumes user will only have DEFINE from root, PRESENT to root; then link out must be root_pres

  const select_press = [root_pres];
  let select_node;
  while (select_node == null) {
    const pres = select_press[select_press.length - 1];

    const did_push_pres = Object.keys(link_by_id_by_start_id[pres.properties.end_id]).some(link_id => {
      const link = link_by_id[link_id];

      if (
        link.properties.select_v[0] === pres.properties.select_v[0] && // select path press will have identical select_v
        link.type === LinkTypes.PRESENT
      ) {
        select_press.push(link);
        return true;
      }
      return false;
    });

    if (!did_push_pres) {
      select_node = node_by_id[pres.properties.end_id] || {};
    }
  }

  return {
    auth_user,
    user: node_by_id[user_id],
    select_press,
    select_node,
  };
})(Notation);