import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { User } from './User';

class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };

    this.toggleActivation = this.toggleActivation.bind(this);
  }

  toggleActivation() {
    const active = this.state.active;
    this.setState({
      active: !active,
    });
  }

  render() {
    const { user_ids, token_by_id, node_by_id, logOut } = this.props;
    const { active } = this.state;

    const style = {
      auth: {
        display: 'inline-block',
        position: 'relative',
        border: '2px solid lavender',
        padding: 4,
      },
      accessor: {
        cursor: 'pointer',
      },
      content: {
        position: 'absolute',
        display: active ? 'block' : 'none',
      },
    };

    // TODO logout anonymous-user
    const users = user_ids.map(user_id => {
      const user = node_by_id[user_id];
      if (user == null) {
        return null;
      }
      else {
        return (
          <User 
            key={'user-'+user_id}
            user={user}
          />
        );
      }
    });

    return (
      <div className='auth' style={style.auth}>
         <div style={style.accessor} onClick={this.toggleActivation}>
           auth
         </div>
         <div style={style.content}>
           {users}
         </div>
      </div>
    );

  }
}

Auth.propTypes = {
  user_ids: PropTypes.arrayOf(PropTypes.number),
  token_by_id: PropTypes.object,
}

function getStateProps(state) {
  return {
    user_ids: state.user_ids,
    token_by_id: state.token_by_id,
    node_by_id: state.node_by_id,
  };
}
function getDispatchProps(dispatch) {
  return {

  };
}
export const AuthContainer = connect(getStateProps, getDispatchProps)(Auth);