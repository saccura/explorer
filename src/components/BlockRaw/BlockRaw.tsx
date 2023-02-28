import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import Editor from "@monaco-editor/react";

interface IProps {
  block: any;
}

const BlockRaw: React.FC<IProps> = (props) => {
  const history = useHistory();
  const { block } = props;

  return (
    <div>
      <Button
        onClick={() => {
          history.push(`/block/${block.hash}`);
        }}
        style={{ position: "absolute", right: "30px", top: "75px", zIndex: 1, textTransform: "none", color: "#3772FF" }}
      >View Block</Button>
      <Editor
        options={{
          minimap: {
            enabled: false,
          },
          wordWrap: "on",
          lineNumbers: "off",
          wrappingIndent: "deepIndent",
          readOnly: true,
          showFoldingControls: "always",
        }}
        //theme={darkMode.value ? "dark" : "light"}
        width="100vw"
        height="93vh"
        language="json"
        value={JSON.stringify(block, null, 4)}
      />
    </div>
  );
};

export default BlockRaw;
