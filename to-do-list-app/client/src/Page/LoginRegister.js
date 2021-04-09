import React, { useEffect, useState } from "react";
import Axios from "axios";
import { toast } from 'react-toastify'
import Icon from "react-hero-icon"
import Logo from "../component/Element/LogoCHECKIT.png"
import Button from 'react-bootstrap/Button'
import './css/LoginRegister.css'



function LoginRegister() {
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [confirmPassReg, setConfirmPassReg] = useState("")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");


  Axios.defaults.withCredentials = true;
  const checkPassword = (password) => {
    
    if (password.length < 8) {
      toast.error("Your password is too small (8 car needed)", { position: toast.POSITION.TOP_CENTER })
      return false;
    }
    else if (password != confirmPassReg) {
      toast.error("You did not enter the same password", { position: toast.POSITION.TOP_CENTER })
      return false;
    } else {
      let countMaj = 0;
      let countNumber = 0;

      for (let letter of password) {
        if (letter == letter.toUpperCase()) {
          countMaj++;
        }
        if (isNaN(parseInt(letter)) == false) {
          countNumber++;
        }
      }
      if (countMaj == 0) {
        toast.error("You don't have a uppercase character in your password ", { position: toast.POSITION.TOP_CENTER })
        return false;
      }
      else if (countNumber == 0) {
        toast.error("You don't have a number in your password ", { position: toast.POSITION.TOP_CENTER })
        return false;
      }
      else {
        return true;
      }
    }

  }

  const register = () => {
    if(usernameReg === "" || passwordReg == "" || confirmPassReg == ""){
      toast.error("Some text field is empty", { position: toast.POSITION.TOP_CENTER });
    }
    else if (checkPassword(passwordReg)) {
      if(checkEmail(email)){
      Axios.post("http://localhost:3001/register", {
        username: usernameReg,
        password: passwordReg,
        email : email
      }).then((response) => {
        console.log(response);
        if (response.data.message) {
          toast.error(response.data.message, { position: toast.POSITION.TOP_CENTER });

        } else {
          toast("Successful creation, Welcome to CHECKIT ", { position: toast.POSITION.TOP_CENTER });
          document.location.reload();
        }
      
      });
    }else{
      toast.error("email is incorrect", { position: toast.POSITION.TOP_CENTER });
    } 
  }

  };

  const login = () => {
    if(username == "" || password == ""){
      return;
    }
    else{
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        toast.error(response.data.message , { position: toast.POSITION.TOP_CENTER });
      } else {
        document.location.reload();
      }
    });
  }
  };


  const signUpMethod = () => {
    document.querySelector(".container").classList.add("sign-up-mode");
  }

  const signInMethod = () => {
    document.querySelector(".container").classList.remove("sign-up-mode");
  }

  const checkEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">


          <div className="sign-in-form">
          <img className="logoCHECKIT2" src={Logo} alt="Error Loading logo"></img>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
            <i><Icon icon="User" type="solid" className="logoUser"></Icon></i> 
                <input type="text" placeholder="Username" onChange={(e) => { setUsername(e.target.value);}}/>
            </div>
            <div className="input-field">
            <i><Icon icon="LockClosed" type="solid" className="logoUser"></Icon></i> 
                <input type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value);}}/>
            </div>
            <Button  className ="butLog" onClick={login}> <div className="txtBut">Login</div> </Button>

          </div>


          <div className="sign-up-form">
            <img className="logoCHECKIT2" src={Logo} alt="Error Loading logo"></img>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
            <i><Icon icon="User" type="solid" className="logoUser"></Icon></i> 
                <input type="text" placeholder="Username" onChange={(e) => { setUsernameReg(e.target.value);  }}/>
            </div>
            <div className="input-field">
            <i><Icon icon="At-Symbol" type="solid" className="logoUser"></Icon></i> 
                <input type="email" placeholder="Email" onChange={(e) => {setEmail(e.target.value);}}/>
            </div>
            <p id="passWordTxt">Your password must contain 8 characters including a capital letter and a number.</p>
            <div className="input-field">
            <i><Icon icon="LockClosed" type="solid" className="logoUser"></Icon></i> 
                <input type="password" placeholder="Password" onChange={(e) => {setPasswordReg(e.target.value);}}/>
            </div>
            <div className="input-field">
            <i><Icon icon="LockClosed" type="solid" className="logoUser"></Icon></i> 
                <input type="password" placeholder="Confirm password" onChange={(e) => {setConfirmPassReg(e.target.value);}}/>
            </div>
            <Button  className ="butLog" onClick={register}> <div className="txtBut">Sign up</div> </Button>
            
          </div>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
          <img className="logCHECKIT" src={Logo} alt="Error Loading logo"></img>
            <h3>New here ?</h3>
            <p>
              CHECKIT will help you to plan your daily tasks ! Stop getting bored and start planning your week !
            </p>
            <button className="buttonSign"  onClick={signUpMethod}>
             <div className="txtButDone"> Sign up</div>
            </button>
          </div>
          
        </div>
        <div className="panel right-panel">
          <div className="content">
          <img className="logCHECKIT" src={Logo} alt="Error Loading logo"></img>
            <h3>One of us ?</h3>
            <p>
              Get logged in ! CHECKIT is waiting you !
            </p>
            <button className="buttonSign"  onClick={signInMethod}>
            <div className="txtButDone">Sign in </div>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default LoginRegister
