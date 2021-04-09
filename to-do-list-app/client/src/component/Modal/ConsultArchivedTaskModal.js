import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import Icon from "react-hero-icon"
import Axios from 'axios'
import ArchivedComment from "../object/ArchivedComment"
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import './css/ConsultArchivedTaskModal.css'
import '../object/css/DarkMode.css'

export default function EditTaskModal(props) {
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

      let dueDateGoodValue;
      let datefinal = [31,28,31,30,31,30,31,31,30,31,30,31]
      if (props.due_date !== null) {
          const dueDateSplit = props.due_date.split('T');
          dueDateGoodValue = dueDateSplit[0];
          let splitDate = dueDateGoodValue.split('-');
          let year = splitDate[0];
          let month = splitDate[1];
          let day = splitDate[2];
  
          day = parseInt(day, 10);
          day = day + 1;
          if( day < 10){
              day = '0' + day.toString();
          }
          else if(day > datefinal[parseInt(month)-1]){
              day = '01'
              
              if(month == 12){
                  month= '01'
                  year = (parseInt(year) + 1).toString()
              }else{
                  month= '0'+(parseInt(month) + 1).toString()
              }
          }
          else day = day.toString();
          
         
  
          dueDateGoodValue = year + '-' + month + '-' + day;
          
  
      }
      else {
          dueDateGoodValue = undefined;
      }

    const [name, setName] = useState(props.name);
    const [due_date, setDueDate] = useState(dueDateGoodValue);
    const [task_description, setTaskDescription] = useState(props.task_description);
    const [commentList, setCommentList] = useState([]);

    const DeleteArchivedTask = async () => {
        await Axios.post('http://localhost:3001/api/task/delete', { name: props.name, nameCat: props.nameCategory, userId: props.userId })
            .then(() => { document.location.reload(); });
    }


    const getComment = async () => {
        const { data } = await Axios.get('http://localhost:3001/api/comment/get', { params: { nameCat: props.nameCategory, nameTask: props.name, userId: props.userId } });
        setCommentList(data);
    }

    useEffect(() => {
        getComment();
    }, []);

    const deleteComment = async (id) => {
        await Axios.post('http://localhost:3001/api/comment/delete', { id: id }).then(() => {
            getComment();
        });
    }

    return (
        <>
            <Button variant="" id="editTaskButton" onClick={handleShow}>
                <Icon icon="MenuAlt4" type="solid" className="editTaskArchived" />
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton id="modalEditTaskHeader" className={isDarkModeEnabled()}>
                    <Modal.Title id="ModalTitle">My archived task</Modal.Title>
                </Modal.Header>
                <Modal.Body className={isDarkModeEnabled()}>
                    <Tabs defaultActiveKey="My archived Task">
                        <Tab eventKey="My archived Task" title="My archived task">
                            <div id="globalDivForArchivedTasks">
                                <label htmlFor="name" id="labelTaskName">Task name : </label>
                                <input type="text" name="name" id="TaskName" minLength="2" maxLength="20" size="20" value={name} required autoComplete="off" onChange={(e) =>
                                    setName(e.target.value)
                                } disabled></input>

                                <label htmlFor="dueDate" id="labelTaskDueDate">Due date : </label>
                                <input type="date" id="TaskDueDate" name="dueDate" value={due_date} required onChange={(e) =>
                                    setDueDate(e.target.value)
                                } disabled></input>

                                <label htmlFor="taskDescription" id="labelTaskDescription">Task description : </label>
                                <textarea name="taskDescription" id="TaskDescription" value={task_description} required onChange={(e) =>
                                    setTaskDescription(e.target.value)
                                } disabled></textarea>
                            </div>
                        </Tab>

                        <Tab eventKey="archivedCommentTask" title="Task archived comments">
                            <div id="displayCommentsArchived">
                                {commentList.map(comment =>
                                    <div key={comment.id}>
                                        <ArchivedComment
                                            id={comment.id}
                                            body={comment.commentBody}
                                            delete={deleteComment}
                                            userId={comment.userId}
                                            date={comment.date_comment}
                                        />
                                    </div>
                                )}

                            </div>
                        </Tab>
                    </Tabs>


                </Modal.Body>
                <Modal.Footer id="modalFooter" className={isDarkModeEnabled()}>
                    <Button className="deleteTaskButton" variant="primaryDelete" onClick={DeleteArchivedTask}>
                        <Icon icon="trash" type="solid" className="deleteButton" />
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
