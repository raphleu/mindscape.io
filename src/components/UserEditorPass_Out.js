import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { pass } from '../actions';

class UserEditorPass extends React.Component {
  constructor(props) {
    super(props);

    const { user } = this.props;

    this.state = {
      pass: '',
      edit_pass: '',
      edit_pass2: '',
    };

    this.pass = this.pass.bind(this);

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleEditPassChange = this.handleEditPassChange.bind(this);
    this.handleEditPass2Change = this.handleEditPass2Change.bind(this);
  }

  pass() {
    const { getVect, user, dispatch, reset } = this.props;
    const { pass, edit_pass, edit_pass2 } = this.state;

    if (edit_pass != edit_pass2) {
      console.alert('pass dont match yo');
      return;
    }

    dispatch(pass({
      vect: getVect(), 
      user,
      pass,
      edit_pass,
    }));

    reset();
  }

  handlePassChange(event) {
    this.setState({
      pass: event.target.value
    });
  }

  handleEditPassChange(event) {
    this.setState({
      edit_pass: event.target.value
    });
  }

  handleEditPass2Change(event) {
    this.setState({
      edit_pass2: event.target.value
    });

  }

  render() {
    const { user, reset } = this.props;
    const { pass, edit_pass, edit_pass2 } = this.state;

    return (
      <div id='userEditorPass' style={{}}>
        <div>
          <div>pass</div>
          <div>
            <input className='edit-pass item'
              type='password'
              value={pass}
              onChange={this.handlePassChange}
              placeholder={'pass'}
            />
          </div>
        </div>
        <div>
          <div>new pass</div>
          <div>
            <input className='edit-pass item'
              type='password'
              value={edit_pass}
              onChange={this.handleEditPassChange}
              placeholder={'new pass'}
            />
          </div>
        </div>
        <div>
          <div>new pass (again)</div>
          <div>
            <input className='edit-pass2 item'
              type='password'
              value={edit_pass2}
              onChange={this.handleEditPass2Change}
              placeholder={'new pass (again)'}
            />
          </div>
        </div>
        <div className='edit-cancel button' onClick={reset}>
          <div className='content'>
            cancel
          </div>
        </div>
        <div className='edit-dispatch button' onClick={this.pass}>
          <div className='content'>
            edit!
          </div>
        </div>
      </div>
    );
  }
}

UserEditorPass.propTypes = {
  getVect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
};

export const UserEditorPass_Out = connect()(UserEditorPass);