import { useDispatch } from 'react-redux'
import action from '../request/action'
import { setTags } from '../store/tags'
import { setRoutes } from '../store/routes'
import { setBingPic } from '../store/bingPic'


export const fetchTags = async (dispatch) => {
  const tags = await action({
    path: '/tags/list',
  })
  dispatch(setTags(tags.data))
}

export const fetchRoutes = async (dispatch) => {
  const routes = await action({
    path: '/routes/list',
    params: {
      page:1,
      size:999
    },
  })
  dispatch(setRoutes(routes.data))
}

export const fetchBingPic = async (dispatch) => {
  const bingPic = await action({
    path: '/BingPic/bingPic',
  })
  dispatch(setBingPic(bingPic.data))
}

/**
 * Sends a streaming request to the deepseek test endpoint
 * @param content The content to send to the AI
 * @param onData Callback function that receives chunks of data as they arrive
 * @param onComplete Callback function called when the stream is complete
 * @param onError Callback function called when an error occurs
 */
export const streamDeepseekTest = async (
  content: string,
  onData: (chunk: string) => void,
  onComplete?: () => void,
  onError?: (error: any) => void
) => {
  try {
    const baseURL = process.env.NODE_ENV === 'development' ? '/api' : process.env.REACT_APP_URL_ENV as string;
    
    const response = await fetch(`${baseURL}/deepseek/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ content }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported in this browser.');
    }

    // Get a reader from the response body stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    // Read the stream
    let done = false;
    while (!done) {
      const result = await reader.read();
      done = result.done;
      
      if (done) {
        if (onComplete) onComplete();
      } else {
        // Decode the chunk and pass it to the callback
        const chunk = decoder.decode(result.value, { stream: true });
        onData(chunk);
      }
    }
    
    return true;
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      console.error('Error in streamDeepseekTest:', error);
    }
    throw error;
  }
}