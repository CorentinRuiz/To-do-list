import React, { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Axios from 'axios'
import Icon from "react-hero-icon"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import './css/TaskModal.css'
import '../object/css/DarkMode.css'

export default function TaskModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    var DateOfTheDay = new Date();
    var DateOfTheDayString;

    DateOfTheDay.setDate(DateOfTheDay.getDate());

    DateOfTheDayString = (DateOfTheDay.getFullYear() + '-'
        + ('0' + (DateOfTheDay.getMonth() + 1)).slice(-2) + '-'
        + ('0' + DateOfTheDay.getDate()).slice(-2));

    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [startingDate, setStartingDate] = useState(DateOfTheDayString);
    const [dueDate, setDueDate] = useState(null);

    const isDarkModeEnabled = () => {
        if (document.body.classList.contains('darkModeEnabled')) 
        {
          return "darkMode";
        }
        else {
          return "lightMode";
        }
      }

    const submitTask = () => {
        if (name === "") {
            toast.error('Invalid Name', { position: toast.POSITION.TOP_CENTER });
        }
        else {
            Axios.post('http://localhost:3001/api/task/insert', { name: name, description: description, startingDate: startingDate, dueDate: dueDate, progress: "0.0", nameCat: props.nameCategory, userId: props.userId }).then(() => {
                document.location.reload();
            }
            ).catch((error) => {
                if (error.response) {
                    toast.error('Task already exist', { position: toast.POSITION.TOP_CENTER });
                }
            });
        }
    }

    return (
        <>
            <Button variant="" id="addStep" onClick={handleShow}>
                <Icon icon="plus-circle" type="solid" className="addStepPlus" />
                Add Task
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton className={isDarkModeEnabled()}>
                    <Modal.Title id="ModalTitle">Create a new task</Modal.Title>
                </Modal.Header>
                <Modal.Body className={isDarkModeEnabled()}>
                    <div id="globalDivForCreateTask">
                        <label htmlFor="name" id="labelTaskName" >Task name :</label> {/* task name HMI. */}
                        <input type="text" name="name" id="taskName" minLength="2" maxLength="20" size="20" autoComplete="off" required onChange={(e) => {
                            setName(e.target.value);
                        }} ></input>

                        <label htmlFor="startingDate" id="labelStartingDate">Starting date :</label>{/* starting date HMI. */}
                        <input type="date" name="startingDate" defaultValue={startingDate} id="startingDate" required onChange={(e) => {
                            setStartingDate(e.target.value);
                        }}></input>

                        <label htmlFor="dueDate" id="labelDueDate">Due date : </label>{/* due date HMI. */}
                        <input type="date" name="dueDate" id="dueDate" required onChange={(e) => {
                            setDueDate(e.target.value);
                        }}></input>

                        <label htmlFor="addTaskDescription" id="labelAddTaskDescription">Add task description : </label>{/* add task description HMI. */}
                        <textarea name="addTaskDescription" value={description} id="addTaskDescription" required onChange={(e) => {
                            setDescription(e.target.value);
                        }}> </textarea>
                    </div>

                </Modal.Body>
                <Modal.Footer className={isDarkModeEnabled()}>
                    <Button onClick={submitTask} id="createButton">
                        Create
            </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
