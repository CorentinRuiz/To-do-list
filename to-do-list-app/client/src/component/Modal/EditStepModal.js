import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Icon from "react-hero-icon"
import './css/EditStepModal.css'
import Axios from 'axios'
import { toast } from 'react-toastify'
import Logo from '../Element/edit_step.svg'
import '../object/css/DarkMode.css'


export default function EditStepModal(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [name, setName] = useState(props.name);

    const DeleteStep = async () => {
        await Axios.post('http://localhost:3001/api/step/delete', { name: props.name, taskName:props.nameTask, userId : props.userId, catName : props.catName})
            .then(() => { document.location.reload(); });
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


    const editStep = () => {
        if (name === "") {
          toast.error('Invalid Step Name', { position: toast.POSITION.TOP_CENTER });
        }
        else {
          Axios.post('http://localhost:3001/api/step/update', {name: name, oldName: props.name, userId: props.userId, catName:props.catName, nameTask: props.nameTask}).then(() => {
            document.location.reload();
          }
          ).catch((error) => {
            if (error.response) {
              toast.error('Step already exist', { position: toast.POSITION.TOP_CENTER });
            }
          });
        }
      }

    return (
        <>
            <Button variant="primaryEdit" id="editStepButton" onClick={handleShow}>
            <img id="edit_img" src={Logo}></img>
            </Button>

            <Modal show={show} onHide={handleClose} centered className={isDarkModeEnabled()}>
                <Modal.Header closeButton >
                    <Modal.Title id="ModalTitle">Edit step</Modal.Title>
                </Modal.Header>
                <Modal.Body className={isDarkModeEnabled()}>
                    <div id="globalDivForEditStepModal">
                        <label htmlFor="name" id="labelStepName">New step name : </label>
                        <input type="text" name="name" id="stepName" value={name} minLength="2" maxLength="20" size="20" autoComplete="off" required onChange={(e) => {
                            setName(e.target.value);
                        }}></input>
                    </div>


                </Modal.Body>
                <Modal.Footer id="modalFooter" className={isDarkModeEnabled()}>
                    <Button className="deleteTaskButton" variant="primaryDelete" >
                        <Icon icon="trash" type="solid" className="deleteButton" onClick={DeleteStep}/>
                    </Button>
                    <Button id="submitStepEdit"  variant=""onClick={editStep} >
                        Edit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
