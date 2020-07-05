export const REACT_APP_STATIC_IMAGE_PATH = `${window.location.protocol}//${
  window.location.hostname
}:${process.env.NODE_ENV === 'production' ? window.location.port : '5000'}/img`;
