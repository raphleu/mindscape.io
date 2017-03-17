class Author extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logging_out: false,
      logging_in: false,
      login_name: '',
      login_pass: '',
    }

    this.startLogout = this.startLogout.bind(this);
    this.cancelLogout = this.cancelLogout.bind(this);
    this.commitLogout = this.commitLogout.bind(this);

    this.startLogin = this.startLogin.bind(this);
    this.cancelLogin = this.cancelLogin.bind(this);
    this.commitLogin = this.commitLogin.bind(this);
  }

  startLogout() {
    this.setState({ logging_out: true });
  }
  cancelLogin() {
    this.setState({ logging_out: false });
  }
  commitLogout() {
    const { user, dispatch } = this.props;

  }

  startLogin() {
    this.setState({
      logging_in: true,
    });
  }
  cancelLogin() {
    this.setState({
      logging_in: false,
      login_name: '',
      login_pass: '',
    });
  }
  commitLogin() {
    const { user, dispatch } = this.props;

  }

  render() {
    const { user } = this.props;
    const { logging_in } = this.state;
    
    return (
      <div id='author' style={{border: '1px solid lavender'}}>
        <div id='author-name'>
          { author.name ? author.name : 'anonymous'}
        </div>
        <div id='modify-author'>
          modify author details: name, password, email, phone, etc
        </div>
        {
          logging_out ? (
            <div id='logout-message'>
              {
                author.name ? `Are you sure you want to logout?` : `
                  You are about to logout from an anonymous author.
                  If you continue, you will lose control of this author.
                  To retain access to this authorship, modify the author to possess a name and password.
                `
              }
            </div>
            <div id='logout-cancel' onClick={this.cancelLogout}>
              cancel logout
            </div>
            <div id='logout-commit' onClick={this.commitLogout}>
              commit logout
            </div>
          ) : (
            <div id='logout-start' onClick={this.startLogout}>
              logout, i.e. login as new anonymous author
            </div>
          )
        }
        {
          logging_in ? (
            <input id='login-name' type='text' value={this.state.login_name} onChange={this.handleLoginNameChange} />
            <input id='login-pass' type='password' value={this.state.login_pass} onChange={this.handleLoginPassChange} />
            <div id='login-cancel' onClick={this.cancelLogin}>
              cancel login
            </div>
            <div id='login-commit' onClick={this.commitLogin}>
              commit login
            </div>
          ) : (
            <div id='login-start' onClick={this.startLogin}>
              login directly to named author
            </div>
          )
        }


      </div>
    );

  }
}

Author.propTypes = {
  user: PropTypes.object,
}