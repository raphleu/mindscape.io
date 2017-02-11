import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Displays, Positions } from '../types';

import { deleteNote } from '../actions';
 
class Current extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show_links: 'all',
    };

    this.handleDelete = this.handleDelete.bind(this);

    this.showLinks = this.showLinks.bind(this);
  }

  handleDelete(event) {
    if(confirm('delete this note?')) {
      const { user, note, path, dispatch } = this.props;

      dispatch(deleteNote(user, note, path[0]));
    }
  }
  showLinks(mode) {
    return (event) => {
      this.setState({
        show_links: mode,
      });    
    };
  }

  render() {
    const { user, path, note, write, reads, links } = this.props;
    const { show_links } = this.state;

    if (user == null) {
      return null;
    }

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
      button_liner: {
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

    style.factor_button = style.button;
    style.product_button = style.button;
    style.all_button = style.button;

    function activate(button_style) {
      Object.assign(button_style, {
        backgroundColor: 'azure'
      });
    }

    let displayed_links;

    if (show_links === 'all') {
      displayed_links = links;
      activate(style.all_button);
    }
    else {
      const factor_links = [];
      const product_links = [];
      links.forEach(link => {
        if (link.start === note.id) {
          product_links.push(link);
        }
        else {
          factor_links.push(link);
        }
      });

      if (show_links === 'factors') {
        displayed_links = factor_links;
        activate(style.factor_button);
      }
      else {
        displayed_links = product_links;
        activate(style.product_button);
      }
    }

    return (
      <div className='current' style={style.main}>
        CURRENT
        <div onClick={this.handleDelete}>
          delete
        </div>
        <div style={style.section} >
          <div style={style.label}>
            author_id
          </div>
          <div>
            {write && write.start || user.id}
          </div>
        </div>
        <div style={style.section} >
          <div style={style.label}>
            note_id
          </div>
          <div>
            {note.id}
          </div>
        </div>
        <div style={style.section} >
          <div style={style.label}>
            path
          </div>
          <div>
            {path.map(read => read.id).join(' < ')}
          </div>
        </div>
        <div style={style.section} >
          <div style={style.label}>
            read_count
          </div>
          <div>
            {reads.length}
          </div>
        </div>
        <div style={style.section} >
          <div style={style.label}>
            links
          </div>
          <div>
            <div style={style.buttons}>
              <div style={style.factor_button} onClick={this.showLinks('factors')}>
                factors
              </div>
              <div style={style.product_button} onClick={this.showLinks('products')}>
                products
              </div>
              <div style={style.all_button} onClick={this.showLinks('all')}>
                all
              </div>
            </div>
            {
              links.map(link => {
                return (
                  <div key={'link-'+link.id} style={style.link} > 
                    link
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

Current.propTypes = {
  user: PropTypes.object,
  path: PropTypes.arrayOf(PropTypes.object),
  note: PropTypes.object,
  write: PropTypes.object,
  reads: PropTypes.arrayOf(PropTypes.object),
  links: PropTypes.arrayOf(PropTypes.object),
};

function getStateProps(state) {
  const user = state.node_by_id[state.user_ids[0]];
  if (user == null) {
    return {};
  }

  const current_read = state.relationship_by_id[user.current_read_id];
  if (current_read == null) {
    return {};
  }

  const path = (function getPath(path, read) {
    if (read == null) {
      return path;
    }
    const super_read = state.relationship_by_id[read.properties.super_read_id];
    return getPath([...path, read], super_read);
  })([], current_read);

  const note = state.node_by_id[current_read.start];
  const write = state.relationship_by_id[note.write_id];
  const reads = note.read_ids.map(read_id => state.relationship_by_id[read_id]);
  const links = note.link_ids.map(link_id => state.relationship_by_id[link_id]);

  return {
    user,
    path,
    note,
    write,
    reads,
    links,
  };
}

export const CurrentContainer = connect(getStateProps)(Current);