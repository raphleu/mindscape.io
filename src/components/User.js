import React from 'react';
import { UserLogoutor_Out } from './UserLogoutor_Out';
import { UserEditor } from './UserEditor';
import { Note } from  './Note';
import { About } from './About';

import { PropTypes } from 'prop-types';

export class User extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('User', this.props);

    const { getVect, user, select_press } = this.props;
    const style = {
      button: {
        border: '1px solid lavender',
        padding: 2,
      },
    };

    const root_pres = select_press[0];

    return (user && root_pres) 
      ? (
        <div id={'user-'+user.properties.id} className='user' style={{
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
            <UserEditor getVect={getVect} user={user} />
            <UserLogoutor_Out getVect={getVect} user={user} />
            <Note
              key={'note-'+root_pres.properties.end_id}
              getVect={getVect}
              user={user}
              path_press={[root_pres]}
              peer_press={[root_pres]}
              select_press={select_press}
            />
          </div>
        </div>
      )
      : (
        <About />
      );
  }
}

User.propTypes = {  
  getVect: PropTypes.func,
  user: PropTypes.object,
  select_press: PropTypes.arrayOf(PropTypes.object),
};
