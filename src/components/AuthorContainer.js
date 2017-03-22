import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions';

import { NoteContainer } from  './NoteContainer';

class Author extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logout: false,
    };
    this.startLogout = this.startLogout.bind(this);
    this.cancelLogout = this.cancelLogout.bind(this);
    this.finishLogout = this.finishLogout.bind(this);
  }

  startLogout() {
    this.setState({logout: true});
  }
  cancelLogout() {
    this.setState({logout: false});
  }
  finishLogout() {
    const { user, dispatch } = this.props;
    dispatch(logout(user));
  }

  render() {
    const { user } = this.props;
    return (
      <div id={'author-'+user.properties.id} className='author'>
        {
          logout
            ? (
              <div className='logout'>
                <div>
                  are you sure you want to logout?
                </div>
                <div className='cancel-logout' onClick={this.cancelLogout} style={style.button}>
                  cancel
                </div>
                <div className='finish-logout' onClick={this.finishLogout} style={style.button}>
                  logout!
                </div>
              </div>
            )
            : (
              <div className='start-logout' onClick={this.startLogout} style={style.logout_button}>
                <div style={style.button_content}>
                  logout
                </div>
              </div>
            )
        }
        <div>modify user name, password, email, OAuth, settings</div>
        <NoteContainer
          key={'note-'+user.properties.id}
          user={user}
          main_path={main_path}
          path={main_path.slice(0,1)}
          peer_user_pres={main_path.slice(0,1)}
        />
      </div>
    );
  }
}

Author.propTypes = {
  user: PropTypes.object.isRequired,
  main_path: PropTypes.arrayOf(PropTypes.object),
}

export const AuthorContainer = connect()(Author)



