/* eslint-disable no-debugger */
// assets
import { LoginOutlined, ProfileOutlined, LogoutOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  LogoutOutlined
};


let isLoginEnabled = localStorage.getItem('token');

const caselogin = [{
  id: 'logout1',
  title: 'Logout',
  type: 'item',
  url: '/logout',
  icon: icons.LogoutOutlined,
  target: true
}]

const caselogout = [{
  id: 'Login',
  title: 'Login',
  type: 'item',
  url: '/login',
  icon: icons.LoginOutlined,
  target: true
},
{
  id: 'registed1',
  title: 'Register',
  type: 'item',
  url: '/register',
  icon: icons.ProfileOutlined,
  target: true
}]

const auth = {
  id: 'authentication',
  title: 'Authentication',
  type: 'group',
  children: [
    isLoginEnabled
    && caselogin[0],
    !isLoginEnabled
    && caselogout[0],
    !isLoginEnabled
    && caselogout[1]
  ].filter(Boolean)   // remove falsy values (pages with condition false)
};

export default auth;
