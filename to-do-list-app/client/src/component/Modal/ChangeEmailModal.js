import React, { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './css/ChangePassModal.css'
import Axios from 'axios'
import '../object/css/DarkMode.css'

export default function ChangeEmailModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [newEmail, setNewEmail] = useState("");

    const changeEmail = async () => {
        Axios.post('http://localhost:3001/update/Email', { id: props.id, username: newEmail }).then((res) => {
            if(!res.data.Message){
                toast("Your change is allow, you will see this change next login", {position : 'top-center'})
            }else{
                toast.error(res.data.Message, {position : 'top-center'})
            }
        });
    }
    const isDarkModeEnabled = () => {
        if (document.body.classList.contains('darkModeEnabled')) 
        {
          return "darkMode";
        }
        else {
          return "lightMode";
        }
      }

    return (
        <div>
        <label id ='changePass' variant="danger" onClick={()=>{
            handleShow();
        }} > 
           Change
       </label>

       <Modal show={show} onHide={handleClose} centered>
           <Modal.Header closeButton className={isDarkModeEnabled()}>
               <Modal.Title>Change Email</Modal.Title>
           </Modal.Header>
           <Modal.Body className={isDarkModeEnabled()}>
           <div id="passChangeContainer">
               <label id="actualPassLabel" class="inputPad"> New Email : </label>
               <input id="settingActualPassword" class="inputPad" type="text" autocomplete="off" onChange={(e)=>{
                   setNewEmail(e.target.value);
               }}></input>
           
           </div>
           <Button id="btnSaveNewPass" variant="" onClick={changeEmail} >Save changes</Button>
           </Modal.Body>
       </Modal>
   </div>
    )
}


