import React ,{useEffect, useMemo} from 'react';
import './App.css';
import { useRoutes } from 'react-router-dom';
import routes from './routes/routes'
import action from './request/action';
import { useDispatch } from 'react-redux';
import { setTags } from "../src/store/tags";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await action({
        path: "/tags/list",
      });
      dispatch(setTags(tags.data));
    };
    fetchTags();
  }, []);
  let element = useRoutes(routes)
  return element
}

export default App;
