import React ,{useEffect, useMemo} from 'react';
import './App.css';
import { useRoutes } from 'react-router-dom';
import routes from './routes/routes'
import { useDispatch } from 'react-redux';
import { fetchTags,fetchRoutes,fetchBingPic } from './hooks/useApi';
const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    fetchTags(dispatch);
    fetchRoutes(dispatch);
    fetchBingPic(dispatch);
  }, []);
  let element = useRoutes(routes)
  return element
}

export default App;
