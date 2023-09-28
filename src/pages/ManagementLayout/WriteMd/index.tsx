import React from "react";
import Grid from "@mui/material/Grid";
import PreviewContent from "./PreviewContent";
import EditorBar from "./EditorBar";
import action from "../../../request/action";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import EditorHead from "./EditorHead";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default () => {
  const titleRef = React.useRef(null) as any;
  const textRef = React.useRef(null) as any;
  const [previewHead, setPreviewHead] = React.useState("");
  const [mdContent, setMdContent] = React.useState("");
  const [open, setOpen] = React.useState(false);

  return (
    <Grid
      container
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      <Grid item xs={6}>
        <EditorHead
          ref={titleRef}
          onChange={() => {
            setPreviewHead(titleRef.current?.value || "");
          }}
        />
        <EditorBar
          textRef={textRef}
          setMdContent={setMdContent}
          onConfirm={async (articleTags) => {
            const res = (await action({
              path: "/adventure/add",
              params: {
                tag: articleTags.map((item: any) => item.id).join(","),
                name: previewHead,
                content: mdContent,
              },
            })) as any;
            if (res.result === 0) {
               setOpen(true);
            }
          }}
        />
        <textarea
          ref={textRef}
          style={{
            width: "100%",
            flex: 1,
            padding: "40px 40px 80px",
            marginBottom: 0,
            resize: "none",
            color: "#333",
            backgroundColor: "transparent",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "30px",
            border: "none",
            outline: "none",
            overflow: "auto",
          }}
          onChange={() => {
            setMdContent(textRef.current?.value || "");
          }}
        ></textarea>
      </Grid>
      <Grid item xs={6}>
        <div
          style={{
            position: "relative",
            height: "100%",
            overflowY: "auto",
            padding: "40px 40px 80px",
            fontSize: "16px",
            lineHeight: 1.75,
          }}
        >
          <h1
            style={{
              marginBottom: "20px",
              fontSize: "26px",
              color: "inherit",
            }}
          >
            {previewHead}
          </h1>
          <PreviewContent mdContent={mdContent} />
        </div>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          发布成功
        </Alert>
      </Snackbar>
    </Grid>
  );
};
