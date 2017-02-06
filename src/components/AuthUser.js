import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { logOut } from '../actions';

export class AuthUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };

    this.toggleEditing = this.toggleEditing.bind(this);
  }

  toggleEditing() {
    this.setState({
      editing: !this.state.editing,
    });
  }

  render() {
    const { user } = this.props;
    const { editing } = this.state;

    const style = {
      user: {
        display: 'inline-block',
        padding: 4,
        border: '1px solid lavender',
        margin: 4,
      },
      row: {
        display: 'table-row',
      },
      cell: {
        display: 'table-cell',
        padding: 2,
      },
    };

  // TODO logout anonymous-user

    const data = {
      id: user.id,
      name: user.name_text,
      registered: user.registered && user.hash_text,
    };

    const rows = Object.keys(data).map(key => {
      return
        <div style={style.row}>
          <div style={style.cell}>
            {key}
          </div>
          <div style={style.cell}>
            {data[key]}
          </div>
        </div>
      ;
    });

    // TODO login anonymous-user 

    return (
      <div className='user-panel' style={style.user}>
        {rows}
      </div>
    );
  }
}

AuthUser.propTypes = {
  user: PropTypes.object,
}
