import React from 'react';
import { PropTypes } from 'prop-types';
import { UserLogin_o } from './UserLogin_o';
import { UserSignature_o } from './UserSignature_o';
import { UserLogout_o } from './UserLogout_o';
import { Pres } from  './Pres';


export class User extends React.Component {
  constructor(props) {
    super(props);
  }

  render() { 
    console.log('User', this.props);
    const { fetching, auth_user, user, select_press } = this.props;

    const root_pres = select_press[0];

    return (auth_user && user && root_pres) 
      ? (
        <div id={'user-'+user.properties.id} className='User' style={{
          display: 'inline-block',
          margin: 2,
          border: '1px solid darkorchid',
          borderTopRightRadius: 4,
          borderBottomLeftRadius: 4,
        }}>
          <div className='content' style={{
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
          }}>
            <UserSignature_o auth_user={auth_user} user={user} />
            <UserLogout_o  auth_user={auth_user} />
            <Pres
              key={'note-'+root_pres.properties.end_id}
              path_press={[root_pres]}
              peer_press={[root_pres]}
              select_press={select_press}
            />
          </div>
        </div>
      )
      : (
        <div className='about' style={{
          display: 'inline-block',
          margin: 2,
          border: '1px solid steelblue',
          borderTopRightRadius: 4,
          borderBottomLeftRadius: 4,
        }}>
          <div className='content' style={{
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            padding: '6px 8px',
          }}>
            {
              fetching
                ? (
                  <div>
                    Loading...
                  </div>
                )
                : (
                  <div>
                    Read and write a web of posts where you can nest posts within one another.
                    <br />
                    Check out the code @ 
                    <a href='https://github.com/geometerJones/mindscape.io'>https://github.com/geometerJones/mindscape.io</a>
                    <UserLogin_o />  
                  </div>
                )
            }
          </div>
        </div>
      );
  }
}

User.propTypes = {
  fetching: PropTypes.bool,
  auth_user: PropTypes.object,
  user: PropTypes.object,
  select_press: PropTypes.arrayOf(PropTypes.object).isRequired,
};
