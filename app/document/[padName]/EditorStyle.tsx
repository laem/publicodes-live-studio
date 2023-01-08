import styled from 'styled-components'
export default styled.div`
  #monaco-editor {
    width: 100%;
    height: 600px;
    border: 1px solid #ccc;
  }

  .yRemoteSelectionHead {
    position: absolute;
    border-left: orange solid 2px;
    border-top: orange solid 2px;
    border-bottom: orange solid 2px;
    height: 100%;
    box-sizing: border-box;
  }
  .yRemoteSelectionHead::after {
    position: absolute;
    content: ' ';
    border: 3px solid orange;
    border-radius: 4px;
    left: -4px;
    top: -5px;
  }

  ${(props) =>
    props.users.map(
      ({ id, color }) => `

  .yRemoteSelection-${id} {
    border-bottom: 2px dashed ${color}
  }
  .yRemoteSelectionHead-${id} {
    border-left: ${color} solid 2px;
    border-top:  ${color} solid 2px;
    border-bottom: ${color}  solid 2px;
  }
  .yRemoteSelectionHead-${id}::after {
    border: 3px solid ${color};
  }
   
`
    )}
`
