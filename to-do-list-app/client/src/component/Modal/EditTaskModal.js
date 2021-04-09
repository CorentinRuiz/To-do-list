import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'
import Icon from "react-hero-icon"
import Axios from 'axios'
import './css/EditTaskModal.css'
import Comment from '../object/Comment';
import CommentForm from '../other/CommentForm'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
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


    var DateOfTheDay = new Date();
    var DateOfTheDayString;

    DateOfTheDay.setDate(DateOfTheDay.getDate());

    DateOfTheDayString = (DateOfTheDay.getFullYear() + '-'
        + ('0' + (DateOfTheDay.getMonth() + 1)).slice(-2) + '-'
        + ('0' + DateOfTheDay.getDate()).slice(-2));

    const [name, setName] = useState(props.name);
    const [due_date, setDueDate] = useState(dueDateGoodValue);
    const [task_description, setTaskDescription] = useState(props.task_description);
    const [progress, setProgress] = useState(props.progress);
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([]);

    const editTask = () => {
        if (name === "") {
            toast.error('Invalid Task Name', { position: toast.POSITION.TOP_CENTER });
        }
        else {
            Axios.post('http://localhost:3001/api/task/update', { name: name, dueDate: due_date, progress: progress, description: task_description, oldnametask: props.name, nameCat: props.nameCategory, userId: props.userId }).then(() => {
                document.location.reload();
            }
            ).catch((error) => {
                if (error.response) {
                    toast.error('Task already exist', { position: toast.POSITION.TOP_CENTER });
                }
            });

        }
    }
    const DeleteTask = async () => {
        await Axios.post('http://localhost:3001/api/task/delete', { name: props.name, nameCat: props.nameCategory, userId: props.userId })
            .then(() => { document.location.reload(); });
    }

    const ArchiveTask = async () => {
        await Axios.post('http://localhost:3001/api/task/update/archive', { name: name, nameCat: props.nameCategory, userId: props.userId }).then(() => {
            document.location.reload();
        })
    }


    const getComment = async () => {
        const { data } = await Axios.get('http://localhost:3001/api/comment/get', { params: { nameCat: props.nameCategory, nameTask: props.name, userId: props.userId } });
        setCommentList(data);
    }



    const sendComment = async () => {
        if (comment == "") { toast.error("Comment can't be empty ", { position: toast.POSITION.TOP_CENTER }); }
        else {
            await Axios.post('http://localhost:3001/api/comment/insert', { name: props.name, comment: comment, nameCat: props.nameCategory, userId: props.userId, date: DateOfTheDayString });
            getComment();
            setComment("");
        }
    }

    const checkOrNot = (e) => {
        if (e == progress) {
            return "green";
        }
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
                <Icon icon="pencil" type="solid" className="editTask" />
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton id="modalEditTaskHeader" className={isDarkModeEnabled()}>
                    <Modal.Title id="ModalTitle">My task</Modal.Title>
                </Modal.Header>
                <Modal.Body className={isDarkModeEnabled()}>
                    <Tabs defaultActiveKey="MyTask">
                        <Tab eventKey="MyTask" title="Edit task">
                            <div id="globalDivForEditTaskModal">
                                <label htmlFor="name" id="labelTaskName">Task name : </label>
                                <input type="text" name="name" id="TaskName" minLength="2" maxLength="20" size="20" value={name} required autoComplete="off" onChange={(e) =>
                                    setName(e.target.value)
                                }></input>

                                <label htmlFor="dueDate" id="labelTaskDueDate">Due date : </label>
                                <input type="date" id="TaskDueDate" name="dueDate" value={ due_date} required onChange={(e) =>
                                    setDueDate(e.target.value)
                                } ></input>

                                <label htmlFor="taskDescription" id="labelTaskDescription">Task description : </label>
                                <textarea name="taskDescription" id="TaskDescription" value={task_description} required onChange={(e) =>
                                    setTaskDescription(e.target.value)
                                }></textarea>


                                <label id="labelProgress">Add your progression :</label>

                                <div id="labelForDemo2">

                                    <input type="radio" className="btn-check" name="options" id="option1" onClick={
                                        (e) => {
                                            setProgress("Not started yet");
                                        }} />
                                    <label className="btn btn-secondary labelState" id="Not started yet" style={{ backgroundColor: checkOrNot("Not started yet") }} htmlFor="option1">Not started yet</label><br></br>

                                    <input type="radio" className="btn-check" name="options" id="option2" onClick={
                                        (e) => {
                                            setProgress("In progress");
                                        }} />
                                    <label className="btn btn-secondary labelState" id="In progress" style={{ backgroundColor: checkOrNot("In progress") }} htmlFor="option2">In progress </label><br></br>

                                    <input type="radio" className="btn-check" name="options" id="option4" onClick={
                                        (e) => {
                                            setProgress("Done");
                                        }} />
                                    <label className="btn btn-secondary labelState" id="Done" style={{ backgroundColor: checkOrNot("Done") }} htmlFor="option4" >Done</label>

                                </div>

                            </div>
                            <Button id="submitEditTask" variant="" onClick={editTask}>
                            Edit
                        </Button>
                        </Tab>

                        <Tab eventKey="commentTask" title="Task's comments">
                            <div id="displayComments">
                            <label htmlFor="comment" id="labelComment">Comment on this task :</label>
                            <CommentForm id="comment"
                                comment={comment}
                                setComment={setComment}
                                sendComment={sendComment}
                            />
                            <div id="DisplayComment">
                                {commentList.map(comment =>
                                    <div key={comment.id}>
                                        <Comment
                                            id={comment.id}
                                            body={comment.commentBody}
                                            delete={deleteComment}
                                            userId={comment.userId}
                                            date={comment.date_comment}
                                        />
                                    </div>
                                )}
                            </div>
                            </div>
                        </Tab>

                    </Tabs>
                </Modal.Body>
                <Modal.Footer id="modalFooter" className={isDarkModeEnabled()}>
                    <Button className="deleteTaskButton" variant="primaryDelete" onClick={DeleteTask}>
                        <Icon icon="trash" type="solid" className="deleteButton" />
                    </Button>
                    <Button className="deleteTaskButton" variant="primaryDelete" onClick={ArchiveTask}>
                        <Icon icon="Archive" type="solid" className="deleteButton" />
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}
