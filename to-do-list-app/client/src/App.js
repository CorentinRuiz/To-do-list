import React, { Component, useState, useEffect, useCallback, useMemo } from 'react';
import './App.css'
import Dashboard from './Page/Dashboard';
import LoginRegister from './Page/LoginRegister'
import Axios from 'axios'


export default function App() {
  const [loggedIn,setLoggedIn] = useState(false);
  const [userData,setUserData] = useState([]);
  Axios.defaults.withCredentials = true;

  useEffect(() => {
    Axios.get("http://localhost:3001/login").then((response) => {
      if (response.data.loggedIn === true) {
        setUserData(response.data.user[0]);  
          setLoggedIn(response.data.loggedIn);
      } 
      });
  }, []);



  return (
    <div id="appOrigin">
        {loggedIn ? <Dashboard userData={userData}/> : <LoginRegister />}
    </div>
  )
}




