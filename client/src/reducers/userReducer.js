const INITIAL_STATE = {
  users: [],
  currentUser: null,
  loggedIn: false,
  admin: null,
  openUser: null,
  employers: []
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'REGISTER_USER':
      return {
        ...state,
        currentUser: action.payload,
        loggedIn: true,
        role: action.payload.role,
        users: [...state.users, action.payload]
      };
    case 'SET_CURRENTUSER':
      return {
        ...state,
        currentUser: action.payload.user,
        loggedIn: true,
        role: action.payload.user.role
      };
    case 'GET_ADMIN':
      return {
        ...state,
        admin: action.payload
      };

    case 'EDIT_USER':
      return {
        ...state,
        currentUser: action.payload,
        users: state.users.map(user => {
          if (action.payload._id === user._id) {
            return action.payload;
          } else {
            return user;
          }
        })
      };
    case 'GET_USERS':
      return { ...state, users: action.payload };

    case 'GET_USER':
      return { ...state, openUser: action.payload };
    case 'GET_EMPLOYERS':
      return { ...state, employers: action.payload };
    case 'LOG_OUT':
      return { ...state, currentUser: null, loggedIn: false };
    default:
      return state;
  }
};

export default userReducer;
