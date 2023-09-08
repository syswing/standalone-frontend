import { Grid, Paper } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import "github-markdown-css/github-markdown.css";
import MarkdownToc from "./MarkdownToc";

export default () => {
  const currentBlog = useSelector(
    (state: any) => state.currentBlogReducer.currentBlog
  );

  return (
    <Grid container spacing={2}>
			{currentBlog.tocContent && <Grid item xs="auto" style={{
				width:"13em"
			}}>
        <MarkdownToc />
      </Grid>}
      
      <Grid item xs>
        <Paper elevation={4}>
          <div
            className="markdown-body"
            style={{
              padding: 20,
              marginBottom: 20,
            }}
            dangerouslySetInnerHTML={{ __html: currentBlog.md }}
          ></div>
        </Paper>
      </Grid>
    </Grid>
  );
};
