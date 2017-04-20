import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { edit } from '../actions';

class UserEditorName extends React.Component {
  constructor(props) {
    super(props);

    const { user } = props;

    this.state = {
      name: user.properties.exp || '',
    }

    this.edit = this.edit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  edit() {
    const { getVect, user, dispatch, reset } = this.props;
    const { name } = this.state;

    dispatch(edit({
      vect: getVect(),
      user,
      name,
    }));

    reset();
  }

  handleChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  render() {
    const { user, reset } = this.props;
    const { name } = this.state;

    return (
      <div id='userEditorName' style={{}}>
        <div>
          <input className='name item' 
            type='text'
            value={name}
            onChange={this.handleChange}
            placeholder={'name'}
          />
        </div>
        <div className='cancel button' onClick={reset}>
          <div className='content'>
            cancel
          </div>
        </div>
        <div className='dispatch button' onClick={this.edit}>
          <div className='content'>
            edit!
          </div>
        </div>
      </div>
    );
  }
}

UserEditorName.propTypes = {
  getVect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
};

export const UserEditorName_Out = connect()(UserEditorName);