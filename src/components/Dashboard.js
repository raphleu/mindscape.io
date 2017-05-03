import { PropTypes } from 'prop-types';

import { UserVector } from './UserVector';
import { UserRegistor_Out } from './UserRegistor_Out';
import { UserLoginor_Out } from './UserLoginor_Out';
import { UserLogoutor_Out } from './UserLogoutor_Out';
import { UserSignor_Out } from './UserSignor_Out';

import { NodeHidor_Out } from './NodeHidor_Out';
import { NodeCommitor_Out } from './NodeCommitor_Out';
import { NodeLinkor_InOut } from './NodeLinkor_InOut';

export function Dashboard(props) {
  console.log('Dashboard', props);
  const { getVect, auth_user, user, select_press, select_node } = props;

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
            <UserVector getVect={getVect} />
            <div>
              { auth_user.uid }
            </div>
            <div>
              { user && user.properties && user.properties.id }
            </div>
            {
              auth_user.uid
                ? (
                  <div>
                    <UserSignor_Out getVect={getVect} auth_user={auth_user} user={user} />
                    <UserLogoutor_Out getVect={getVect} auth_user={auth_user} />
                  </div>
                )
                : (
                  <div>
                    <UserRegistor_Out getVect={getVect} />
                    <UserLoginor_Out getVect={getVect} />
                  </div>
                )
            }
          </div>
          {
            select_node
              ? (
                <div style={{
                  margin: 2,
                  border: '1px solid darkturquoise',
                  padding: 2,
                }}>
                  SELECT
                  <NodeCommitor_Out
                    getVect={getVect}
                    node={select_node}
                  />
                  set add link cursor mode
                  <NodeLinkor_InOut
                    getVect={getVect}
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
  getVect: PropTypes.func,
  auth_user: PropTypes.object,
  user: PropTypes.object,
  root_pres: PropTypes.object,
  select_press: PropTypes.arrayOf(PropTypes.object), 
  select_node: PropTypes.object,
};
