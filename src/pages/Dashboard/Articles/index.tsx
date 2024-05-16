import React, { useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import th2 from "../../../images/th2.jpeg";
import test1 from "../../../images/test1.jpg";
import action from "../../../request/action";
import { useDispatch, useSelector } from "react-redux";
import { setBlogList } from "../../../store/blogList";
import { setBlogMd } from "../../../store/currentBlog";
import Masonry from "@mui/lab/Masonry";
import UpArticle from "./UpArticle";
import { useNavigate, useOutlet, Outlet } from "react-router-dom";
import dayjs from "dayjs";
import ArticleTags from "../../../components/ArticleTags";
import { styled } from "@mui/material/styles";

const Articles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const outlet = useOutlet();

  const blogList = useSelector((state: any) => state.blogListReducer.blogList);
  const tags = useSelector((state: any) => state.tagsReducer.tags);

  useEffect(() => {
    const fetchArticleList = async () => {
      const result = await action({
        path: "/adventure/list",
      });
      dispatch(setBlogList(result.data));
    };
    fetchArticleList();
  }, []);

  return (
    <>
      {outlet ? (
        <Outlet />
      ) : (
        <div>
          {Array.from(blogList).map((blog: any, index) => (
            <Card className="mb-2">
              <Grid container>
                <Grid item xs={4}>
                  <CardMedia component="img" image={test1} alt="green iguana" />
                </Grid>
                <Grid item xs={8}>
                  <CardActionArea
                    onClick={() => {
                      dispatch(setBlogMd(blog));
                      navigate(`/articles/${blog.name}`);
                    }}
                  >
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {blog.name}
                      </Typography>
                      {blog.tag && (
                        <ArticleTags tags={tags} artTags={blog.tag} />
                      )}
                      <UpArticle up={blog.up} id={blog.id} />
                      <Typography style={{ marginLeft: "auto" }}>
                        {dayjs(blog.create_at).format("YYYY-MM-DD")}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Grid>
              </Grid>

              {/* <CardActions>
                <UpArticle up={blog.up} id={blog.id} />
                <Typography style={{ marginLeft: "auto" }}>
                  {dayjs(blog.create_at).format("YYYY-MM-DD")}
                </Typography>
              </CardActions> */}
            </Card>
          ))}
          {/* <Grid
            container
            className="article-container"
            style={{
              // backdropFilter: "blur(8px)",
              // background: "rgba(255, 255, 255, 0.1)",
              // backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          > */}
          {/* <Masonry columns={3} spacing={2}> */}
          {/* {Array.from(blogList).map((blog: any, index) => (
                <div style={{
                  float:'left',
                  marginRight:10,
                  marginBottom:10
                }}>
                  <Card sx={{ maxWidth: 300 }}>
                    <CardActionArea
                      onClick={() => {
                        dispatch(setBlogMd(blog));
                        navigate(`/articles/${blog.name}`);
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={th2}
                        alt="green iguana"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {blog.name}
                        </Typography>
                        {blog.tag && (
                          <ArticleTags tags={tags} artTags={blog.tag} />
                        )}
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <UpArticle up={blog.up} id={blog.id} />
                      <Typography style={{ marginLeft: "auto" }}>
                        {dayjs(blog.create_at).format("YYYY-MM-DD")}
                      </Typography>
                    </CardActions>
                  </Card>
                </div>
              ))} */}
          {/* </Masonry> */}
          {/* </Grid> */}
        </div>
      )}
    </>
  );
};

export default Articles;
