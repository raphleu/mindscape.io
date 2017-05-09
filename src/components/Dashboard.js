import { PropTypes } from 'prop-types';

import { UserVector_i } from './UserVector_i';

import { NodeCommit_o } from './NodeCommit_o';
import { NodeHide_o } from './NodeHide_o';
import { NodeLink_io } from './NodeLink_io';

export function Dashboard(props) {
  console.log('Dashboard', props);
  const { auth_user, user, select_press, select_node } = props;

  return (
    <div id='dashboard' style={{
      display: 'inline-block',
      height: '100%'
    }}>
      <div id='dashboard-fill' style={{ width: 165 }} />
      <div id='dashboard-view' style={{
        zIndex: 8,
        display: 'inline-block',
        verticalAlign: 'top',
        position: 'fixed',
        top: 32,
        margin: 2,
        border: '1px solid steelblue',
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4,
      }}>
        <div id='dashboard-view-content' className='content' style={{
          position: 'relative',
          border: '1px solid azure',
          borderTopLeftRadius: 4,
          borderBottomRightRadius: 4,
          padding: 4,
          width: 152,
          backgroundColor: 'white',
          whiteSpace: 'normal',
          overflow: 'auto',
          textAlign: 'left',
        }}>
          <div style={{
            margin: 2,
            border: '1px solid darkorchid',
            padding: 2,
          }}>
            USER
            <UserVector_i />
            <div>
              { auth_user.uid }
            </div>
            <div>
              { user && user.properties && user.properties.id }
            </div>
          </div>
          {
            select_node
              ? (
                <div className='item' style={{border: '1px solid darkturquoise'}}>
                  SELECT
                  add init, edit? probably
                  <NodeCommit_o user={user} node={select_node} />
                  <NodeHide_o user={user} node={select_node} />
                  set add link cursor mode
                  <NodeLink_io
                    user={user}
                    path_press={select_press}
                    node={select_node} 
                  />
                </div>
              )
              : null
          }

        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  auth_user: PropTypes.object,
  user: PropTypes.object,
  select_press: PropTypes.arrayOf(PropTypes.object), 
  select_node: PropTypes.object,
};
