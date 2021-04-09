import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import './css/AboutModal.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Icon from "react-hero-icon"
import Category from "../Element/Category.mp4"
import createTask from '../Element/createTask.mp4'
import editTask from '../Element/editTask.mp4'
import step from '../Element/step.mp4'
import login from '../Element/login.mp4'
import notification from '../Element/notification.mp4'
import settings from '../Element/Settings.mp4'
import taskboard from '../Element/taskboard.mp4'
import archivedTask from '../Element/archivedTask.mp4'
import '../object/css/DarkMode.css'

export default function AboutModal() {
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        <>
            <Button id="btnAbout" variant="primaryInformation" onClick={handleShow}>
                <Icon icon="question-mark-circle" type="solid" className="information" />
            </Button>

            <Modal show={show} onHide={handleClose} centered >
                <Modal.Header closeButton id="modalHeader" className={isDarkModeEnabled()}>
                    <Modal.Title id="modalTitle" >CheckIt Tutorial</Modal.Title>
                </Modal.Header>
                <Modal.Body className={isDarkModeEnabled()}>
                    <div>
                            <div className="main">
                                <h2 id='title'>Create my category</h2>
                                {/*To create a category, click on the button "Create a category" in the main menu. You will have to complete the name section and choose a color
                                You can edit the color and the name of your category whenever you want.*/}
                                <div className="video">
                                    <video src={Category} type="video/mp4"  width="90%" height="60%" loop autoPlay controls></video>
                                </div>
                            </div>
                            <div className="main">
                                <h2 id='title'>Create my task</h2>
                                {/*To create a task, click on the "Add a task" button inside the category you want to add the task to.
                                Then, you will have to name the task, define a starting date and a due date and complete a short description(optional).*/}
                                <div className="video">
                                <video src={createTask} type="video/mp4" width="90%" height="60%" loop autoPlay controls></video>
                                </div>  
                            </div>
                            <div className="main">
                                <h2 id='title'>Edit my task</h2>
                                <div className="video">
                                    <video src={editTask} type="video/mp4"  width="90%" height="60%" loop autoPlay controls></video>
                                </div>
                            </div>
                            <div className="main">
                                <h2 id='title'>Create a step</h2>
                                <div className="video">
                                    <video src={step} type="video/mp4"  width="90%" height="60%" loop autoPlay controls></video>
                                </div>
                            </div> 
                            <div className="main">
                                <h2 id='title'>Notifications</h2>
                                <div className="video">
                                    <video src={notification} type="video/mp4"  width="90%" height="60%" loop autoPlay controls></video>
                                </div>
                            </div>  
                            <div className="main">
                                <h2 id='title'>Settings</h2>
                                <div className="video">
                                    <video src={settings} type="video/mp4"  width="90%" height="60%" loop autoPlay controls></video>
                                </div>
                            </div> 
                            <div className="main">
                                <h2 id='title'>My Task Board</h2>
                                <div className="video">
                                    <video src={taskboard} type="video/mp4"  width="90%" height="60%" loop autoPlay controls></video>
                                </div>
                            </div>   
                            <div className="main">
                                <h2 id='title'>Archived Task</h2>
                                <div className="video">
                                    <video src={archivedTask} type="video/mp4"  width="90%" height="60%" loop autoPlay controls></video>
                                </div>
                            </div>
                                

                    </div>

                </Modal.Body>
            </Modal>
        </>
    )
}