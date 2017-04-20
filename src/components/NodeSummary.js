export function NodeSummary(props) {
  const { user, node } = props;

  const has_permission = (node.properties.user_id === user.properties.id);

  return (
    <div className='nodeSummary'>
      <div>
        <div>
          id
        </div>
        <div>
          {
            node.properties.id
          }
        </div>
        <div>
          exp
        </div>
        <div>
          {
            node.properties.exp.split('\n')[0]
          }
        </div>
      </div>
    </div> 
  );
}