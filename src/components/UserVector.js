import React from 'react';
import { PropTypes } from 'prop-types';

export class UserVector extends React.Component {
  constructor(props) {
    super(props);

    const { getVect } = props;

    this.state = {
      vect: getVect(),
      timer_id: null,
    };

    this.updateVect = this.updateVect.bind(this);
  }

  updateVect() {
    const { getVect } = this.props;

    this.setState({
      vect: getVect(),
    });
  }

  componentDidMount() {
    this.setState({
      timer_id: setInterval(this.updateVect, 500),
    });
  }

  componentWillUnmount() {
    clearInterval(timer_id);
  }

  render() {
    const { vect } = this.state;

    const time = new Date(vect[0]);

    const space = vect.slice(1);

    return (
      <div id='userVector' style={{
        border: '1px solid lavender',
        padding: 2,
      }}>
        <div id='time'>
          { time.toString() }
        </div>
        <div id='space'>
          { 
            space.map((exp, i) => (
              <div key={'vect-'+(i+1)}>
                { exp }
              </div>
            ))
          }
        </div>
      </div>
    );
  }
 
}

UserVector.propTypes = {
  getVect: PropTypes.func, 
};
