import React, { useEffect, useState } from "react";
import { Button, Container, TextField } from "../../../../node_modules/@mui/material/index";
import { fetchPostData } from "client/client";
import { useNavigate } from "../../../../node_modules/react-router-dom/dist/index";

const AuthRegister = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({email : '', password : ''});
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    if(isLoggedIn){
      navigate('/');
      window.location.reload();
    }
  })

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

  const validatePassword = () => {
    return password.length >= 6 && password.length <= 255;
  }

  const handleLogin = () => {
    setErrors({ email : '', password : '' });
    console.log('Trying to login with : ', email);

    if(!validateEmail()){
      setErrors((prevErrors) => ({...prevErrors, email : 'Invalid Email format'}));
      return;
    }

    if(!validatePassword()){
      setErrors((prevErrors) => ({...prevErrors, password : 'Password must be atleast 6 characters'}));
      return;
    }

    fetchPostData("/auth/users/add", {email, password})
    .then(() => {
      setLoginError('');
      navigate('/login');
      window.location.reload();
    }).catch((error) => {
      console.error('Login error : ', error);
      setLoginError('An Error occured during login');
    })
  }

  return (
    <Container component="main" maxWidth = "xs">
      <TextField 
        variant="outlined"
        margin="normal"
        fullWidth
        label="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error = {!!errors.email}
        helperText={errors.email}
        />

      <TextField 
        variant="outlined"
        margin="normal"
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error = {!!errors.password}
        helperText={errors.password}
        />

      <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
        Register
      </Button>
      {loginError && <p style={{color : 'red'}}>{loginError}</p>}

    </Container>
  );
};

export default AuthRegister;
