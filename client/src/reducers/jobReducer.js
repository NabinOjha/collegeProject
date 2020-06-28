const INITIAL_STATE = {
  jobs: [],
  trendingJobs: [],
  category: [],
  currentJob: null,
  activeCategory: null
};

const jobsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    case 'GET_JOBS':
      return { ...state, jobs: action.payload };
    case 'EDIT_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job => {
          if (job._id === action.payload._id) {
            return action.payload;
          } else return job;
        }),
        trendingJobs: state.trendingJobs.map(job => {
          if (job._id === action.payload._id) {
            return action.payload;
          } else return job;
        })
      };
    case 'GET_TRENDING_JOBS':
      return { ...state, trendingJobs: action.payload };
    case 'SET_JOB_CATEGORIES':
      return { ...state, category: action.payload };
    case 'GET_JOB':
      return { ...state, currentJob: action.payload };
    case 'CREATE_CATEGORY':
      return { ...state, category: [...state.category, action.payload] };
    case 'SET_ACTIVE_CATEGORY':
      return { ...state, activeCategory: action.payload };
    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter(job => job._id !== action.payload),
        trendingJobs: state.trendingJobs.filter(
          job => job._id !== action.payload
        )
      };

    default:
      return state;
  }
};

export default jobsReducer;
