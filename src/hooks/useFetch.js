import { useEffect, useReducer } from 'react';

const initialState = {
  loading: true,
  error: null,
  data: null,
};

function fetchReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { loading: false, error: null, data: action.payload };
    case 'FETCH_ERROR':
      return { loading: false, error: action.payload, data: null };
    default:
      return state;
  }
}

export function useFetch(fetcher, deps) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      dispatch({ type: 'FETCH_START' });
      try {
        const data = await fetcher(controller.signal);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        if (error.name === 'AbortError') return;
        dispatch({ type: 'FETCH_ERROR', payload: error.message });
      }
    }

    load();

    return () => controller.abort();
    // The caller decides which inputs should trigger a new request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}