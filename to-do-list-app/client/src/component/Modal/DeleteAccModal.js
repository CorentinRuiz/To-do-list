import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Axios from 'axios'
import './css/DeleteAccModal.css'
import '../object/css/DarkMode.css'

function DeleteAccModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const deleteAccount = async () => {
       await  Axios.post('http://localhost:3001/api/account/delete',{id : props.id }).then((res)=>{
            document.location.reload();
            Axios.post('http://localhost:3001/logout');
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
            <Button variant="danger" onClick={handleShow} > 
                Delete account
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton className={isDarkModeEnabled()}>
                    <Modal.Title>Are you sure ?</Modal.Title>
                </Modal.Header>
                <Modal.Body className={isDarkModeEnabled()}>
                <Button variant="danger" id="btnDeleteAccount"onClick={deleteAccount}>
                    Yes
                </Button>
                <Button variant="success" id="btnValidateDeleteAccount" onClick={handleClose} className={isDarkModeEnabled()}>
                    No
                </Button>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DeleteAccModal
