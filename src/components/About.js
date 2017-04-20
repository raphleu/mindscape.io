// TODO import README

export function About(props) {
  return (
    <div id='about' style={{
      display: 'inline-block',
      margin: 2,
      border: '1px solid steelblue',
      borderTopRightRadius: 4,
      borderBottomLeftRadius: 4,
    }}>
      <div id='info' style={{
        border: '1px solid azure',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        padding: '6px 8px',
        backgroundColor: 'white',
      }}>
        Read and write a web of posts where you can nest posts within one another.
        <br />
        Check out the code @ 
        <a href='https://github.com/geometerJones/mindscape.io'>https://github.com/geometerJones/mindscape.io</a>
        <br />
        Register to play! 
      </div>
    </div>
  );
}
