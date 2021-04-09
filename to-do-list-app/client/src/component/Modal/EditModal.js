import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Axios from 'axios'
import Icon from "react-hero-icon"
import './css/editModal.css'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Task from '../object/Task'
import ArchivedTask from '../object/ArchivedTask'
import '../object/css/DarkMode.css'

toast.configure();
export default function EditModal(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState(props.name);
  const [color, setColor] = useState(props.color);


  const [archivedTasks, setArchivedTask] = useState([]);


  const getTasksArchived = async () => {
    let data = await Axios.get('http://localhost:3001/api/taskArchived/get', { params: { name: props.name, userId: props.userId } }).then(({ data }) => data);
    setArchivedTask(data)
  }

  const submitCategory = () => {
    if (name === "") {
      toast.error('Invalid Name', { position: toast.POSITION.TOP_CENTER });
    }
    else {
      Axios.post('http://localhost:3001/api/update', { name: name, color: color, oldname: props.name, userId: props.userId }).then(() => {
        document.location.reload();
      }
      ).catch((error) => {
        if (error.response) {
          toast.error('Category already exist', { position: toast.POSITION.TOP_CENTER });
        }
      });
    }
  }

  const alertNoArchTask = () => {
    if (archivedTasks.length == 0)
      return "inline"
    else if (archivedTasks.length !== 0)
      return "none"
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



  useEffect(() => {
    getTasksArchived();
  }, []);

  return (
    <>
      <Button variant="primaryEditCategory" id="editCatButton" onClick={handleShow} >
        <Icon icon="pencil-alt" type="solid" className="editCat" />
      </Button>

      <Modal show={show} onHide={handleClose} centered >
        <Modal.Header closeButton className={isDarkModeEnabled()}>
          <Modal.Title id="ModalTitle" >My Category</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkModeEnabled()}>
          <Tabs defaultActiveKey="MyCategory">
            <Tab eventKey="MyCategory" title="Edit category" >
              <div id="globalDivForCreateCategory">
                <label htmlFor="name" id="labelNameCat">Name of the category : </label>
                <input type="text" name="name" id="nameCat" minLength="2" maxLength="20" size="20" value={name} autoComplete="off" required onChange={(e) => {
                  setName(e.target.value);
                }}></input>

                <label htmlFor="chooseColor" id="labelChooseColor">Choose a color for the category : </label>
                <input type="color" id="chooseColor" name="chooseColor" value={color} required onChange={(e) => {
                  setColor(e.target.value);
                }}></input>
              </div>
              <Button onClick={submitCategory} id="submitEditCat" variant="">
                Edit
            </Button>
            </Tab>

            <Tab eventKey="archTask" title="Archived tasks">
              <div id="marge">
                <div id="alertNoArchTasks" style={{ display: alertNoArchTask() }}> You have no archived tasks...</div>
              </div>
              <div id="containerArchTask">
                {
                  archivedTasks.map(task =>
                    <div key={task.taskName}>
                      <ArchivedTask
                        name={task.taskName}
                        due_date={task.due_date}
                        task_description={task.taskDescription}
                        name_category={task.nameCategory}
                        userId={task.userId}
                      />
                    </div>
                  )
                }
              </div>

            </Tab>


          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
}


