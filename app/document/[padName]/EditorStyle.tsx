import styled from 'styled-components'
export default styled.div`
  #monaco-editor {
    width: 100%;
    height: 600px;
    border: 1px solid #ccc;
  }
  .yRemoteSelection {
    background-color: rgb(250, 129, 0, 0.5);
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
`
