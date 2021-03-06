import React from 'react';
import { PropTypes } from 'prop-types';
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
    console.log('Notation', this.props);
    const { fetching, auth_user, user, select_press, select_node } = this.props;

    return (
      <div id='notation' style={{
        display: 'block',
        whiteSpace: 'nowrap',
      }}>
        <Dashboard
          auth_user={auth_user}
          user={user}
          select_press={select_press}
          select_node={select_node}
        />
        <User
          fetching={fetching}
          auth_user={auth_user}
          user={user}
          select_press={select_press}
        />
      </div>
    );
  }
}

Notation.propTypes = {
  auth_user: PropTypes.object,
  user: PropTypes.object,
  select_press: PropTypes.arrayOf(PropTypes.object), 
  select_node: PropTypes.object,
};

export const Notation_i = connect(state => {
  const { fetching, auth_user, node_by_id, link_by_id, link_by_id_by_start_id } = state;

  const user_id = auth_user.uid;
  const user = node_by_id[user_id];

  if (user_id == null || user == null) {
    return {
      fetching,
      auth_user,
      user,
      select_press: [],
      select_node: null,
    };
  }

  let root_pres;
  Object.keys(link_by_id_by_start_id[user_id]).some(link_id => { 
    root_pres = link_by_id[link_id]; 
    return true;
  }); // assumes user will only have DEFINE from root, PRESENT to root; then link out must be root_pres

  const select_press = [root_pres];
  let select_node;
  while (select_node == null) {
    const pres = select_press[select_press.length - 1];

    const did_push_pres = Object.keys(link_by_id_by_start_id[pres.properties.end_id] || {}).some(link_id => {
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
    fetching,
    auth_user,
    user,
    select_press,
    select_node,
  };
})(Notation);