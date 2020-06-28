const INITIAL_STATE = {
  message: '',
  errorCode: null
};

const errorReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CREATE_ERROR':
      return {
        ...state,
        message: action.payload.message,
        errorCode: action.payload.statusCode
      };
    default:
      return state;
  }
};

export default errorReducer;
