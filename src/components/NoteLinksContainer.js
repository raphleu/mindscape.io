import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class NoteLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show_in_defs: true,
      show_out_defs: true,
    };

    this.toggleShowInDefs = this.toggleshowInDefs.bind(this);
    this.toggleShowOutDefs = this.toggleshowOutDefs.bind(this);
  }

  toggleShowInDefs() {
    const { show_in_defs } = this.state;
    this.setState({show_in_defs: !show_in_defs});
  }

  toggleShowOutDefs() {
    const { show_out_defs } = this.state;
    this.setState({show_out_defs: !show_out_defs});
  }

  render() {
    const { user, path, note, write, reads, links } = this.props;
    const { show_in_defs, show_out_defs } = this.state;

    const style = {
      main: {
        display: 'block',
        margin: 2,
        marginTop: 0,
        backgroundColor: 'white',
      },
      section: {
        margin: 2,
        border: '1px solid lavender',
        padding: 2,
      },
      label: {
        borderBottom: '1px: solid lavender',
        color: 'darkturquoise',
      },
      buttons: {
        display: 'block',
      },
      button: {
        display: 'inline-block',
        margin: 2,
        border: '1px solid darkgrey',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        cursor: 'pointer',
      },
      button_content: {
        border: '1px solid azure',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        padding: 2,
        backgroundColor: 'white',
        color: 'darkgrey',
      },
      link: {
        border: '1px solid lavender',
      }
    };

    style.factor_button = Object.assign({}, style.button);
    style.product_button = Object.assign({}, style.button);
    style.all_button = Object.assign({}, style.button);

    // TODO select DEFINE arrow
    // TODO select PRESENT arrow? maybe not, PRESENT are 1 to 1 with Notes per User!
    return (
      <div className='notelinks' style={style.main}>
        current note details
      </div>
    );
  }
}

NoteLinks.propTypes = {
  user: PropTypes.object.isRequired,
  main_path: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export const NoteLinksContainer = connect((state, ownProps) => {
  const { note_by_id } = state;
  const { main_path } = ownProps;


})(NoteLinks);