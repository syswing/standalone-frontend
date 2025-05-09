import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from '@mui/material'
import th2 from '../../../images/th2.jpeg'
import test1 from '../../../images/test1.jpg'
import action from '../../../request/action'
import { useDispatch, useSelector } from 'react-redux'
import { setBlogList } from '../../../store/blogList'
import { setBlogMd } from '../../../store/currentBlog'
import Masonry from '@mui/lab/Masonry'
import UpArticle from './UpArticle'
import { useNavigate, useOutlet, Outlet } from 'react-router-dom'
import dayjs from 'dayjs'
import ArticleTags from '../../../components/ArticleTags'
import { styled } from '@mui/material/styles'
import useWindowSize from 'hooks/useWindowSize'
import VisitArticle from './VisitArticle'
import CommentArticle from './CommentArticle'
import CommentList from './CommentList'

const Articles = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const outlet = useOutlet()

  const blogList = useSelector((state: any) => state.blogListReducer.blogList)
  const tags = useSelector((state: any) => state.tagsReducer.tags)

  const [showCommentsMap, setShowCommentsMap] = useState<{ [key: string]: boolean }>({})
  
  const toggleComments = (id: string) => {
    setShowCommentsMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  useEffect(() => {
    const fetchArticleList = async () => {
      const result = await action({
        path: '/adventure/list',
      })
      dispatch(setBlogList(result.data))
    }
    fetchArticleList()
  }, [])

  const size = useWindowSize()
  const divRef = React.useRef<any>(null)

  console.log('size: ', blogList)

  return (
    <>
      {outlet ? (
        <Outlet />
      ) : (
        <div
          ref={divRef}
          style={{
            height: (size.height ?? 0) - 40,
            overflowY: 'auto',
            marginRight: divRef.current?.scrollHeight > divRef.current?.clientHeight ? '-15px' : 0,
          }}
        >
          {Array.from(blogList).map((blog: any, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: 'transparent',
              }}
              className="mb-2 mr-4"
            >
              {size.width > 600 ? (
                <Grid container>
                  <Grid
                    item
                    xs={4}
                  >
                    <CardMedia
                      sx={{ height: 130, objectFit: 'cover' }}
                      component="img"
                      image={blog.main_pic_id ? `/api/picture/getPicById?id=${blog.main_pic_id}` : test1}
                      alt="green iguana"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={8}
                    className="glass"
                  >
                    <CardActionArea
                      onClick={() => {
                        dispatch(setBlogMd(blog))
                        navigate(`/articles/${blog.name}`)
                      }}
                    >
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                        >
                          {blog.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      {blog.tag && (
                        <ArticleTags
                          tags={tags}
                          artTags={blog.tag}
                        />
                      )}
                      <UpArticle
                        up={blog.up}
                        id={blog.id}
                      />
                      <VisitArticle visit={blog.visit} />
                      <CommentArticle
                        id={blog.id}
                        comment={blog.commentCount}
                        showComments={() => toggleComments(blog.id)}
                      />
                      <Typography
                        className="mr-2"
                        style={{ marginLeft: 'auto' }}
                      >
                        {dayjs(blog.create_at).format('YYYY-MM-DD')}
                      </Typography>
                    </CardActions>
                  </Grid>
                </Grid>
              ) : (
                <div className="glass">
                  <CardActionArea
                    onClick={() => {
                      dispatch(setBlogMd(blog))
                      navigate(`/articles/${blog.name}`)
                    }}
                  >
                    <CardMedia
                      sx={{ height: 130, objectFit: 'cover' }}
                      component="img"
                      image={blog.main_pic_id ? `/api/picture/getPicById?id=${blog.main_pic_id}` : test1}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                      >
                        {blog.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    {blog.tag && (
                      <ArticleTags
                        tags={tags}
                        artTags={blog.tag}
                      />
                    )}
                    <UpArticle
                      up={blog.up}
                      id={blog.id}
                    />
                    <VisitArticle visit={blog.visit} />
                    <CommentArticle
                      id={blog.id}
                      comment={blog.commentCount}
                      showComments={() => toggleComments(blog.id)}
                    />
                    <Typography
                      className="mr-2"
                      style={{ marginLeft: 'auto' }}
                    >
                      {dayjs(blog.create_at).format('YYYY-MM-DD')}
                    </Typography>
                  </CardActions>
                </div>
              )}
              {showCommentsMap[blog.id] && <CommentList blog={blog} />}
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

export default Articles
