import { Grid, Paper } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import "github-markdown-css/github-markdown.css";
import MarkdownToc from "./MarkdownToc";
import useWindowSize from "hooks/useWindowSize";

export default () => {
  const currentBlog = useSelector(
    (state: any) => state.currentBlogReducer.currentBlog
  );
  const divRef = React.useRef<any>(null)
  const size = useWindowSize()

  console.log('divRef',divRef.current)

  return (
    <Grid container spacing={2}>
      <Grid item xs  style={{
        overflow: 'hidden'
      }}>
        <Paper ref={divRef} elevation={4} className="glass" style={{
          height: size.height - 40,
          overflowY: 'auto',
          marginRight: divRef.current?.scrollHeight > divRef.current?.clientHeight ? "-15px" : 0,
        }}>
          <div
            className="markdown-body"
            style={{
              padding: 20,
              marginBottom: 20,
              minHeight:150,
              background:'transparent'
            }}
            dangerouslySetInnerHTML={{ __html: currentBlog.md }}
          ></div>
        </Paper>
      </Grid>
      {currentBlog.tocContent && <Grid item xs="auto" style={{
				width:"13em"
			}}>
        <MarkdownToc />
      </Grid>}
    </Grid>
  );
};
