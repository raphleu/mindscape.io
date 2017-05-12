export function NodeSummary(props) {
  const { user, node } = props;

  const permitted = node.properties.user_id === user.properties.id;

  return (
    <div className='NodeSummary' style={{
      margin: 2,
      border: permitted ? '1px solid steelblue' : '1px solid lavender'
    }}>
      <div className='content'>
        <div>
          { node.properties.id }
        </div>
        <div>
          { node.properties.exp }
        </div>
      </div>
    </div> 
  );
}