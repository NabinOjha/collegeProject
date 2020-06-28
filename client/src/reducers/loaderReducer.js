const INITIAL_STATE = {
  loading: true
};

const loaderReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOADING_START':
      return { ...state, loading: true };
    case 'LOADING_STOP':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default loaderReducer;
