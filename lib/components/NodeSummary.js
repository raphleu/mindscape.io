export function NodeSummary(props) {
  var user = props.user,
      node = props.node;


  var permitted = node.properties.user_id === user.properties.id;

  return React.createElement(
    'div',
    { className: 'NodeSummary', style: {
        margin: 2,
        border: permitted ? '1px solid steelblue' : '1px solid lavender'
      } },
    React.createElement(
      'div',
      { className: 'content' },
      React.createElement(
        'div',
        null,
        node.properties.id
      ),
      React.createElement(
        'div',
        null,
        node.properties.exp
      )
    )
  );
}