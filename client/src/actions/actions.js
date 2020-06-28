import axios from 'axios';

import history from './../history';

//handle async errors for user request
const factoryFunction = fn => {
  return dispatch => {
    dispatch({ type: 'LOADING_START' });
    fn(dispatch)
      .catch(err => {
        const { message, statusCode } = err.response.data;
        dispatch({
          type: 'CREATE_ERROR',
          payload: {
            message: message || 'fail',
            statusCode: statusCode || 500
          }
        });

        history.push('/error');
        dispatch({ type: 'LOADING_STOP' });
      })
      .then(() => {
        dispatch({ type: 'LOADING_STOP' });
      });
  };
};

//set Token in localStorage
const setToken = () => {
  sessionStorage.setItem('jwt', 'loggedIn');
};

//user actions
export const signUpUser = data => {
  return factoryFunction(async dispatch => {
    const formData = new FormData();
    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    const response = await axios.post(`/api/users/register`, formData);
    setToken();
    dispatch({ type: 'REGISTER_USER', payload: response.data.user });
    history.push('/dashboard');
  });
};

export const logInUser = formData => {
  return factoryFunction(async dispatch => {
    const response = await axios.post(`/api/users/login`, formData);
    setToken();
    history.push('/dashboard');
    dispatch({ type: 'SET_CURRENTUSER', payload: response.data });
  });
};

export const logOut = () => {
  return factoryFunction(async dispatch => {
    const response = await axios.get('/api/users/logout');
    if (response.status === 200) dispatch({ type: 'LOG_OUT' });
    history.push('/');
  });
};

export const getCurrentUserAndStatus = () => {
  return factoryFunction(async dispatch => {
    const response = await axios.get(`/api/users/loggedIn`, {
      withCredentials: true
    });

    if (response.data.user) {
      setToken();
      dispatch({ type: 'SET_CURRENTUSER', payload: response.data });
    } else {
      dispatch({ type: 'LOG_OUT' });
    }
  });
};

export const getUsers = () => {
  return factoryFunction(async dispatch => {
    const response = await axios.get('/api/users');
    dispatch({ type: 'GET_USERS', payload: response.data.data });
  });
};

export const getUser = id => {
  return factoryFunction(async dispatch => {
    const response = await axios.get(`/api/users/${id}`);
    dispatch({ type: 'GET_USER', payload: response.data.data });
  });
};

export const editUser = (data, userId) => {
  return factoryFunction(async dispatch => {
    const formData = new FormData();
    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    const response = await axios.patch(`/api/users/${userId}`, formData);
    dispatch({ type: 'EDIT_USER', payload: response.data.updatedUser });
  });
};

export const getAdmin = () => {
  return factoryFunction(async dispatch => {
    const response = await axios.get('/api/users/admin');
    dispatch({ type: 'GET_ADMIN', payload: response.data.admin });
  });
};

export const getEmployers = () => {
  return factoryFunction(async dispatch => {
    const response = await axios.get('/api/users/employers');
    dispatch({ type: 'GET_EMPLOYERS', payload: response.data });
  });
};

export const editPassword = (data, userId) => {
  return factoryFunction(async dispatch => {
    const response = await axios.patch(
      `/api/users/updatePassword/${userId}`,
      data
    );

    dispatch({ type: 'EDIT_USER', payload: response.data.updatedUser });
  });
};
export const createJob = job => {
  return factoryFunction(async dispatch => {
    let formData = new FormData();
    for (let [key, value] of Object.entries(job)) {
      formData.append(key, value);
    }
    const response = await axios.post('/api/jobs/', formData);
    dispatch({ type: 'ADD_JOB', payload: response.data });
  });
};

export const getJobs = () => {
  return factoryFunction(async dispatch => {
    const response = await axios.get('/api/jobs');
    dispatch({ type: 'GET_JOBS', payload: response.data });
  });
};

export const getJob = jobId => {
  return factoryFunction(async dispatch => {
    const response = await axios.get(`/api/jobs/${jobId}`);
    dispatch({ type: 'GET_JOB', payload: response.data });
    // history.push(`/jobs/edit/${jobId}`);
    history.push(`/jobs/${jobId}`);
  });
};

export const searchJobs = query => {
  return factoryFunction(async dispatch => {
    const response = await axios.get(`/api/jobs/search?query=${query}`);

    dispatch({ type: 'GET_JOBS', payload: response.data });
    // history.push('/jobs', 'SEARCH_STATE');
  });
};

export const createApplication = jobId => {
  return factoryFunction(async dispatch => {
    await axios.post(`/api/jobs/${jobId}/applications`);
  });
};

export const editJob = (data, id) => {
  return factoryFunction(async dispatch => {
    const formData = new FormData();
    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    const response = await axios.patch(`/api/jobs/${id}`, formData);

    dispatch({ type: 'EDIT_JOB', payload: response.data });
    history.push('/dashboard');
  });
};

export const deleteJob = id => {
  return factoryFunction(async dispatch => {
    const response = await axios.delete(`/api/jobs/${id}`);
    if (response.status === 200) {
      dispatch({ type: 'DELETE_JOB', payload: id });
    }
  });
};

export const getTrendingJobs = () => {
  return factoryFunction(async dispatch => {
    const response = await axios.get('/api/jobs/trending');
    dispatch({ type: 'GET_TRENDING_JOBS', payload: response.data });
  });
};

export const createCategory = category => {
  return factoryFunction(async dispatch => {
    const formData = new FormData();
    for (let [key, value] of Object.entries(category)) {
      formData.append(key, value);
    }
    const response = await axios.post('/api/categories/', formData);

    dispatch({ type: 'CREATE_CATEGORY', payload: response.data });
  });
};

export const getJobCategories = () => {
  return factoryFunction(async dispatch => {
    const response = await axios.get('/api/jobs/categories');
    dispatch({
      type: 'SET_JOB_CATEGORIES',
      payload: response.data
    });
  });
};
export const getJobsByCategory = categoryId => {
  return factoryFunction(async dispatch => {
    const response = await axios.get(`/api/categories/${categoryId}`);
    dispatch({ type: 'SET_ACTIVE_CATEGORY', payload: response.data });
  });
};

export const downloadResume = userId => {
  return factoryFunction(async dispatch => {
    const response = await axios.get(`/api/users/${userId}/downloadResume`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));

    const fileType = response.headers['content-type'].split('/')[1];
    const link = document.createElement('a');
    link.href = url;
    const getExtension = () => {
      switch (fileType) {
        case 'msword':
          return 'doc';
        case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
          return 'docx';
        case 'vnd.oasis.opendocument.text':
          return 'odt';
        default:
          return fileType;
      }
    };
    link.setAttribute('download', `resume.${getExtension()}`);
    document.body.appendChild(link);
    link.click();
  });
};
