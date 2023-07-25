import React, { useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import th2 from "../../../images/th2.jpeg";
import action from "../../../request/action";
import { useDispatch, useSelector } from "react-redux";
import { setBlogList } from "../../../store/blogList";
import { setBlogMd } from "../../../store/currentBlog";
import Masonry from "@mui/lab/Masonry";
import { setTags } from "../../../store/tags";
import SellIcon from "@mui/icons-material/Sell";
import UpArticle from "./UpArticle";
import { useNavigate, useOutlet, Outlet } from "react-router-dom";

const ArticleTags = ({ tags, artTags }) => {
  const artTagList = artTags?.split(",") || [];

  const ArticleTag = ({ label }) => {
    return <Chip icon={<SellIcon fontSize="small" />} label={label} />;
  };

  return (
    <Stack
      spacing={{ xs: 1, sm: 2 }}
      direction="row"
      useFlexGap
      flexWrap="wrap"
    >
      {artTagList.map((item, index) => {
        return <ArticleTag key={index} label={tags[item]?.ch} />;
      })}
    </Stack>
  );
};

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
    const fetchTags = async () => {
      const tags = await action({
        path: "/tags/list",
      });
      dispatch(setTags(tags.data));
    };
    fetchArticleList();
    fetchTags();
  }, []);

  return (
    <>
      {outlet ? (
        <Outlet />
      ) : (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Masonry columns={3} spacing={2}>
            {Array.from(blogList).map((blog: any, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea
                    onClick={() => {
                      dispatch(setBlogMd(blog))
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
                      <ArticleTags tags={tags} artTags={blog.tag} />
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <UpArticle up={blog.up} id={blog.id}/>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Masonry>
        </Grid>
      )}
    </>
  );
};

export default Articles;
