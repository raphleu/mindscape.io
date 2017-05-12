import { PropTypes } from 'prop-types';

export function Vector(props) {
  const { vect } = props;

  if (vect == null || vect.length === 0) {
    return null;
  }

  const time = new Date(vect[0]); 
  const space = vect.slice(1);

  return (
    <div className='Vector'>
      <div className='vect-0'>
        { 
          [
            time.getFullYear(),
            ('00' + (time.getMonth() + 1)).substr(-2, 2),
            ('00' + time.getDate()).substr(-2, 2),
            ('00' + time.getHours()).substr(-2, 2) + ('00' + time.getMinutes()).substr(-2, 2),
            ('00' + time.getSeconds()).substr(-2, 2),
          ].join('.')
        }
      </div>
      { 
        space.map((exp, i) => ( // exp stands for expression (of a value)
          <div key={'vect-'+(i+1)} className={'vect'+(i+1)}>
            { Math.trunc(exp * 1000) / 1000 }
          </div>
        ))
      }
    </div>
  );
}

Vector.propTypes = {
  vect: PropTypes.arrayOf(PropTypes.number).isRequired,
};