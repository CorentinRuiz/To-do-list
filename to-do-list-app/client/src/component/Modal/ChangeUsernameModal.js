import React, {useState} from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './css/ChangePassModal.css'
import Axios from 'axios'
import '../object/css/DarkMode.css'

export default function ChangeUsernameModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [newUsername, setNewUsername] = useState("");

    const changeUsername = async () => {
        Axios.post('http://localhost:3001/update/username', { id: props.id, username: newUsername }).then((res) => {
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
        <div onClick={()=>{
            handleShow();
        }} > 
           Change
       </div>

       <Modal show={show} onHide={handleClose} centered>
           <Modal.Header closeButton className={isDarkModeEnabled()}>
               <Modal.Title>Change Username</Modal.Title>
           </Modal.Header>
           <Modal.Body className={isDarkModeEnabled()}>
           <div id="passChangeContainer">
               <label id="actualPassLabel" class="inputPad"> New Username: </label>
               <input id="settingActualPassword" class="inputPad" type="text" autocomplete="off" onChange={(e)=>{
                   setNewUsername(e.target.value);
               }}></input>
           </div>
           <Button id="btnSaveNewPass" variant="" onClick={changeUsername} >Save changes</Button>
           </Modal.Body>
       </Modal>
   </div>
    )
}


