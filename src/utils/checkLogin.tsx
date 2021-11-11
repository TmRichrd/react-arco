export default () => {
  return localStorage.getItem('userStatus') === 'login' && localStorage.getItem('arco-userinfo');
};
