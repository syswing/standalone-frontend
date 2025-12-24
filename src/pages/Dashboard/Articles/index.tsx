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
      const result2 = await action({
        path: '/MD/mdList',
      })

      dispatch(setBlogList([
        ...result.data,
        ...result2.data
      ])) 
    }
    fetchArticleList()
  }, [])

  return (
    <>
      {outlet ? (
        <Outlet />
      ) : (
        <div>
          {Array.from(blogList).map((blog: any, index) => (
            <Card
              key={index}
              sx={{
                backgroundColor: 'transparent',
              }}
              className="mb-2 mr-4"
            >
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
                >
                  <CardActionArea
                    onClick={() => {
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
                  </CardActions>
                </Grid>
              </Grid>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

export default Articles
