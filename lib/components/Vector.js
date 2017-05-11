import { PropTypes } from 'prop-types';

export function Vector(props) {
  var vect = props.vect;


  if (vect == null || vect.length === 0) {
    return null;
  }

  var time = new Date(vect[0]);
  var space = vect.slice(1);

  return React.createElement(
    'div',
    { className: 'Vector' },
    React.createElement(
      'div',
      { className: 'vect-0' },
      [time.getFullYear(), ('00' + (time.getMonth() + 1)).substr(-2, 2), ('00' + time.getDate()).substr(-2, 2), ('00' + time.getHours()).substr(-2, 2) + ('00' + time.getMinutes()).substr(-2, 2), ('00' + time.getSeconds()).substr(-2, 2)].join('.')
    ),
    space.map(function (exp, i) {
      return (// exp stands for expression (of a value)
        React.createElement(
          'div',
          { key: 'vect-' + (i + 1), className: 'vect' + (i + 1) },
          Math.trunc(exp * 1000) / 1000
        )
      );
    })
  );
}

Vector.propTypes = {
  vect: PropTypes.arrayOf(PropTypes.number).isRequired
};