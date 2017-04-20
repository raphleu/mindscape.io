import { PropTypes } from 'prop-types';

export function UserVector(props) {
  const { getVect } = props;

  const vect = getVect();

  const time = new Date(vect[0]);

  const space = vect.slice(1);

  return (
    <div id='userVector'>
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

UserVector.propTypes = {
  getVect: PropTypes.func, 
};
