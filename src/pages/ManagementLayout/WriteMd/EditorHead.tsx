import React from 'react'

const EditorHead = React.forwardRef((props: any, ref: any) => {
  const InputStyle = {
    flexShrink: 0,
    width: "100%",
    padding: "0 80px 10px 40px",
    marginBottom: 0,
    border: "none",
    fontSize: "30px",
    fontWeight: 400,
    lineHeight: "30px",
    boxShadow: "none",
    color: "#595959",
    backgroundColor: "transparent",
    outline: "none",
    borderRadius: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as any,
  };
  return <input onChange={props.onChange} ref={ref} style={InputStyle} />;
});

export default EditorHead
