import React from 'react';
import { UserEditorName_Out } from './UserEditorName_Out';
import { UserEditorEmail_Out } from './UserEditorEmail_Out';
import { UserEditorPass_Out } from './UserEditorPass_Out';

import { PropTypes } from 'prop-types';

export class UserEditor extends React.Component {
  constructor(props) {
    super(props);

    const { user } = this.props;

    this.state = {
      editting_name: false,
      editting_email: false,
      editting_pass: false,
    }
    
    this.startNameEdit = this.startNameEdit.bind(this);
    this.resetNameEdit = this.resetNameEdit.bind(this);

    this.startEmailEdit = this.startEmailEdit.bind(this);
    this.resetEmailEdit = this.resetEmailEdit.bind(this);

    this.startPassEdit = this.startPassEdit.bind(this);
    this.resetPassEdit = this.resetPassEdit.bind(this);
  }

  startNameEdit() {
    this.setState({
      editting_name: true
    });
  }
  resetNameEdit() {
    this.setState({
      editting_name: false,
    });
  }

  startEmailEdit() {
    this.setState({
      editting_email: true,
    });
  }
  resetEmailEdit() {
    this.setState({
      editting_email: false,
    });
  }

  startPassEdit() {
    this.setState({
      editting_pass: true
    });
  }
  resetPassEdit() {
    this.setState({
      editting_pass: false,
    });
  }

  render() {
    const { getVect, user } = this.props;
    const { editting_name, editting_email, editting_pass } = this.state;

    return (
      <div id='user-editor' style={{}}>
        <div>
          <div>name</div>
          {
            editting_name
              ? (
                <UserEditorName_Out getVect={getVect} user={user} reset={this.resetNameEdit} />
              )
              : (
                <div>
                  <div>{ user.properties.exp || 'anonymous' }</div>
                  <div className='editName button' onClick={this.startNameEdit}>
                    <div className='content'>
                      edit
                    </div>
                  </div>
                </div>
              )
          }
        </div>
        <div>
          <div>email</div>
          {
            editting_email
              ? (
                <UserEditorEmail_Out getVect={getVect} user={user} reset={this.resetEmailEdit} />
              )
              : (
                <div>
                  <div>{ user.properties.email || 'anemailous' }</div>
                  <div className='editEmail button' onClick={this.startEmailEdit}>
                    <div className='content'>
                      edit
                    </div>
                  </div>
                </div>
              )
          }
        </div>
        <div>
          {
            editting_pass
              ? (
                <UserEditorPass_Out getVect={getVect} user={user} reset={this.resetPassEdit} />
              )
              : (
                <div>
                  <div>pass</div>
                  <div className='editPass button' onClick={this.startPassEdit}>
                    <div className='content'>
                      edit
                    </div>
                  </div>
                </div>
              )
          }
        </div>
      </div>
    );
  }
}

UserEditor.propTypes = {
  getVect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};