import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { setCurrent, setFrame } from '../actions';

import { NoteEditorContainer } from './NoteEditorContainer';

class NoteHead extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clicks: 0,
      click_timer: null,
    };

    this.handleClick = this.handleClick.bind(this);
    this.dispatchClicks = this.dispatchClicks.bind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    console.log('click');

    const { clicks, click_timer } = this.state;

    if (click_timer) {
      clearTimeout(click_timer);
    }

    this.setState({
      clicks: clicks + 1,
      click_timer: setTimeout(this.dispatchClicks, 500),
    });
  }

  dispatchClicks() {
    const { user, main_path, path, dispatch } = this.props;
    const { clicks } = this.state;

    if (clicks === 1) {
      dispatch(setCurrent({user, main_path, path}));
    }
    else if (clicks >= 2) {
      dispatch(setFrame({user, main_path, path}))
    }

    setState({
      clicks: 0,
      click_timer: null,
    });
  };

  render() {
    //console.log('render Note', this.props)
    const { user, path, note, handleClick } = props;

    const { current, out_index } = path[path.length - 1].properties;
    const { id, author_id, value, commit_t } = note.properties;

    return (
      <div id={'notehead-'+id} className='notehead' onClick={handleClick} style={{
        border: '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        minWidth: 200,
      }}>
        <div className='notehead-content' style={{
          position: 'relative',
          border: '2px solid azure',
          borderTopRightRadius: 4,
          borderBottomLeftRadius: 4,
          backgroundColor: 'white',
        }}>
          <div className='index' style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            color: (current === 1)
              ? 'darkturquoise' 
              : (id === author_id)
                ? 'darkorchid'
                : current ? 'steelblue' : 'lavender',
            margin: 2,
            marginLeft: 4,
          }}>
            { out_index }
          </div>
          <div className='value' style={{
            display: 'inline-block',
            margin: 2,
            border: commit_t ? 'none' : '1px solid darkorchid',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            padding: 2,
            backgroundColor: 'white',
            whiteSpace: 'nowrap',
          }}>
            {
              commit_t
                ? value
                : <NoteEditorContainer user={user} path={path} note={note} />
            }
          </div>
        </div>
      </div>
    );
  }

}

NoteHead.propTypes = {
  user: PropTypes.object.isRequired,
  path: PropTypes.arrayOf(PropTypes.object).isRequired,
  note: PropTypes.object.isRequired,
  handleClick: PropTypes.func,
};

export const NoteHeadContainer = connect()(NoteHead);