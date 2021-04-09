import React, { useState, Component } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Icon from "react-hero-icon"
import Axios from 'axios'
import './css/TaskBoard.css'
import '../object/css/DarkMode.css'


export default class TaskBoard extends Component {
  constructor(props){
    super(props)
    this.state = {
      show : false,
      id : props.id,
      outdatedTaskList: [],
      goodTaskList : [],
      soonExpireTaskList : [],
      oneWeekTaskList : [],
      
    }
  }

  isDarkModeEnabled = () => {
    if (document.body.classList.contains('darkModeEnabled')) 
    {
      return "darkMode";
    }
    else {
      return "lightMode";
    }
  }

  getStateTask = async () =>{
    await Axios.get('http://localhost:3001/get/forTaskBoard', { params:{ userId : this.state.id} }).then( res =>{
      this.setState({goodTaskList: res.data.TabGoodTask});
      this.setState({oneWeekTaskList: res.data.TabOneWeekTask});
      this.setState({outdatedTaskList: res.data.TabOutdatedTask});
      this.setState({soonExpireTaskList: res.data.TabExpireSoonTask});
      
  });
  }
  handleClose = () => this.setState({show : false});

  handleShow = () => this.setState({show : true});

  daysRemaining = (due) =>{
    if (due != null) {
      const dateSplitDue = due.split('T');
      let due_date = dateSplitDue[0];
      let splitDateDue = due_date.split('-');
      let yearDueDate = splitDateDue[0];
      let monthDueDate = splitDateDue[1];
      let dayDueDate = splitDateDue[2];

      let newDate = new Date()


      let datefinal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      dayDueDate = parseInt(dayDueDate, 10) + 1;

      if (dayDueDate < 10) {
          dayDueDate = '0' + dayDueDate.toString();
      }
      else if (dayDueDate > datefinal[parseInt(monthDueDate) - 1]) {
          dayDueDate = '01'

          if (monthDueDate == 12) {
              monthDueDate = '01'
              yearDueDate = (parseInt(yearDueDate) + 1).toString()
          } else {
              monthDueDate = '0' + (parseInt(monthDueDate) + 1).toString()
          }
      }
      else dayDueDate = dayDueDate.toString();



      let dueDate = new Date("" + monthDueDate + "/" + dayDueDate + "/" + yearDueDate + "");
      var timeDiff = dueDate.getTime() - newDate.getTime();
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if(diffDays < 0){
        return Math.abs(diffDays);
      }
      return diffDays;
    }
    else{
      return "no due date"
    }
  }

  componentDidMount(){
    this.getStateTask();
  }

  render() {
    let goodTaskListDisp = []
    let oneWeekTaskListDisp = []
    let soonExpireTaskListDisp = []
    let outdatedTaskListDisp = []
   
   
    for(let task of this.state.goodTaskList){
      if(task != null){
        goodTaskListDisp.push(<li key={task.taskName + task.nameCategory }> {task.taskName} from the category : {task.nameCategory}, days remaining : {this.daysRemaining(task.due_date)}</li>)
      }
    } 
    
    for(let task of this.state.soonExpireTaskList){
      if(task!= null){
        soonExpireTaskListDisp.push(<li key={task.taskName + task.nameCategory }>{task.taskName} from the category : {task.nameCategory}, days remaining : {this.daysRemaining(task.due_date)}</li>)
      }
    }
    for(let task of this.state.oneWeekTaskList){
      if( task != null){
        oneWeekTaskListDisp.push(<li key={task.taskName + task.nameCategory }>{task.taskName} from the category : {task.nameCategory}, days remaining : {this.daysRemaining(task.due_date)}</li>)
      }
    }
    
    for(let task of this.state.outdatedTaskList){
      if(task != null){
        if(task.progressTask != "Done"){
          outdatedTaskListDisp.push(<li key={task.taskName + task.nameCategory }>{task.taskName} from the category : {task.nameCategory}, days overdated : {this.daysRemaining(task.due_date)} </li>)
        } 
      }
    }
  

    return (
      <>
      <Button id="btnTaskBoard" variant="primaryInformation" onClick={this.handleShow} >
      <Icon icon="clipboard-list" type="solid" className="TaskBoardIcon" />
    </Button>

    <Modal show={this.state.show} onHide={this.handleClose} centered>
      <Modal.Header closeButton className={this.isDarkModeEnabled()}>
        <Modal.Title id="ModalTitleTaskBoard">Task Board</Modal.Title>
      </Modal.Header>
      <Modal.Body className={this.isDarkModeEnabled()}>
           <div className="titleTask">
           <h5 >Soon expire task</h5> <div id="redAlert"></div>
           <ul>
              {soonExpireTaskListDisp}
           </ul></div>
           <div className="titleTask"> 
           <h5>More than one week task</h5><div id="greenAlert"></div>
           <ul>
             {goodTaskListDisp}
             </ul>
           </div>
           <div className="titleTask">  
           <h5>Less than one week task</h5><div id="orangeAlert"> </div>
           <ul>
             {oneWeekTaskListDisp}
            </ul></div>
            <div className="titleTask">
             <h5>Outdated task</h5> <div id="warningAlert"></div>
           <ul>
             {outdatedTaskListDisp}
             </ul>
           </div>
      </Modal.Body>
    </Modal>
     </>
    )
  }
}

