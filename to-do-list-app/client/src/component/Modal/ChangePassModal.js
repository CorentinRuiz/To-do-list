import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './css/ChangePassModal.css'
import '../object/css/DarkMode.css'

import Axios from 'axios'

function ChangePassModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [actualPassword,setActualPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [confirmNewPassword,setConfirmNewPassword] = useState("");

    const isDarkModeEnabled = () => {
      if (document.body.classList.contains('darkModeEnabled')) 
      {
        return "darkMode";
      }
      else {
        return "lightMode";
      }
    }

    const checkPassword = () => {
        if (newPassword.length < 8) {
          toast.error("Your password is too small (8 car needed)", { position: toast.POSITION.TOP_CENTER })
          return false;
        }
        else if (newPassword != confirmNewPassword) {
          toast.error("You did not enter the same password", { position: toast.POSITION.TOP_CENTER })
          return false;
        } else {
          let countMaj = 0;
          let countNumber = 0;
    
          for (let letter of newPassword) {
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

      const sendChange = () =>{
              if(checkPassword()){
              Axios.post('http://localhost:3001/api/updatePassword',{id : props.userInfo.id, newPassword : newPassword, actualPassword : actualPassword}).then((res)=>{
                    if(res.data.Message){
                        toast.error(res.data.Message, { position: toast.POSITION.TOP_CENTER })
                    }else{
                        toast("Your password is update", { position: toast.POSITION.TOP_CENTER });
                    }
              })
            }
      }

    return (
        <div>
             <label id ='changePass'variant="danger" onClick={()=>{
                 handleShow();
             }} > 
                Change password
            </label>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton  className={isDarkModeEnabled()}>
                    <Modal.Title>Change your password</Modal.Title>
                </Modal.Header>
                <Modal.Body className={isDarkModeEnabled()}>
                <div id="passChangeContainer">
                    <label id="actualPassLabel" class="inputPad"> Actual password : </label>
                    <input id="settingActualPassword" class="inputPad" type="password" onChange={(e)=>{
                        setActualPassword(e.target.value);
                    }}></input>
                    <label id="newPassLabel" class="inputPad"> New password : </label>
                    <input id="settingNewPassword" type="password" class="inputPad" onChange={(e)=>{
                        setNewPassword(e.target.value);
                    }}></input>
                    <label id="confirmPassLabel" class="inputPad"> Confirm password :</label>
                    <input id="settingConfirmNewPassword" class="inputPad" type="password"onChange={(e)=>{
                        setConfirmNewPassword(e.target.value);
                    }}></input>
                </div>
                <Button id="btnSaveNewPass" variant="" onClick={sendChange} >Save changes</Button>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ChangePassModal
