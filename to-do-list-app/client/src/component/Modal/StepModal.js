import React, { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Icon from "react-hero-icon"
import Axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './css/StepModal.css'
import '../object/css/DarkMode.css'

export default function StepModal(props) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [nameStep, setName] = useState("");

    const isDarkModeEnabled = () => {
        if (document.body.classList.contains('darkModeEnabled')) 
        {
          return "darkMode";
        }
        else {
          return "lightMode";
        }
      }

    const submitStep = () => {
        if (nameStep === "") {
            toast.error('Invalid Name', { position: toast.POSITION.TOP_CENTER });
        }
        else {
            Axios.post('http://localhost:3001/api/step/insert', { nameStep : nameStep, nameCat : props.nameCat,nameTask: props.nameTask, userId: props.userId }).then(() => {
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
        <div>
            <Button variant="" id="addStep" onClick={handleShow}>
            <Icon icon="plus" type="solid" className="addStepPlus" />
            Add Step
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton className={isDarkModeEnabled()}>
                    <Modal.Title id="ModalTitle">Create a step</Modal.Title>
                </Modal.Header>
                <Modal.Body className={isDarkModeEnabled()}>
                    <div id="globalDivForAddStepModal">
                        <label htmlFor="name" id="labelStepName" >Step name :</label> {/* task name HMI. */}
                        <input type="text" name="name" id="stepName" minLength="2" maxLength="20" size="20" autoComplete="off" required onChange={(e) => {
                            setName(e.target.value);
                        }} ></input>
                    </div>

                </Modal.Body>
                <Modal.Footer className={isDarkModeEnabled()}>
                    <Button onClick={submitStep} id="createButton">
                        Create
            </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
