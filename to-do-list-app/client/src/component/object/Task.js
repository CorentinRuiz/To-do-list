import React, { Component } from 'react'
import './css/CategorySection.css'
import EditTaskModal from '../Modal/EditTaskModal'
import './css/Task.css'
import styles from './css/mystyle.module.css'
import Axios from 'axios'
import Step from './Step'
import StepModal from '../Modal/StepModal'
import Button from 'react-bootstrap/Button'
import Icon from "react-hero-icon"


export default class Task extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            starting_date: props.starting_date,
            due_date: props.due_date,
            task_description: props.task_description,
            progress: props.progress,
            name_category: props.name_category,
            userId: props.userId,
            steps: [],
            isDisplayed: props.isDisplayed
        }
    }

    getSteps = async () => {
        let data = await Axios.get('http://localhost:3001/api/step/get', { params: { nameCat: this.state.name_category, userId: this.state.userId, nameTask: this.state.name } }).then(({ data }) => data);
        this.setState({ steps: data })
    }


    displayProgress() {
        if (this.state.progress == 0.0) {
            this.state.progress = "Not started yet";
        }
        return this.state.progress;
    }


    hideShowBtnPlus() {
        if (this.state.isDisplayed == true) {

            return "none";
        }
        else {
            return "inline";
        }
    }

    hideShowBtnMinus() {

        if (this.state.isDisplayed == true) {
            return "inline";
        }
        else {
            return "none";
        }
    }

    hideOrShowDiv() {
        if (this.state.isDisplayed == false) {
            return "none";
        }
    }

    decreaseContentHeight(){
        if (this.state.isDisplayed == false) {
            return "40px";
        }
    }


    hideTask = async () => {

        const minusLogo = document.getElementById(this.state.name + this.state.name_category + "minusBtn");
        const plusLogo = document.getElementById(this.state.name + this.state.name_category + "plusBtn");
        let div = [];
        div = document.getElementsByClassName(this.state.name + this.state.name_category + "displayDiv");
        const container = document.getElementById(this.state.name + this.state.name_category + "containerTk");
        const editBtn = document.getElementById(this.state.name + this.state.name_category + "edit"); 
        const divAlert = document.getElementById(this.state.name + this.state.name_category + "dateAlert");

        if (this.state.isDisplayed == true) {

            this.state.isDisplayed = false;
            await Axios.post('http://localhost:3001/api/task/isDisplayed/update', { isDisplayed: this.state.isDisplayed, catName: this.state.name_category, taskName: this.state.name, userId: this.state.userId }).then(() => { });

            minusLogo.style.display = "none";
            plusLogo.style.display = "inline";

            div[0].style.display = "none";
            div[1].style.display = "none";
            container.style.height = "40px";
            editBtn.style.display ="none";
            if(divAlert.className == styles.dateAlertOnDisplayedGreen)
                divAlert.className = styles.dateAlertGreen;

            else if(divAlert.className == styles.dateAlertOnDisplayedRed)
                divAlert.className = styles.dateAlertRed;

            else if(divAlert.className == styles.dateAlertOnDisplayedOrange)
                divAlert.className = styles.dateAlertOrange;

            else if(divAlert.className == styles.warningAlertOnDisplayed)
                divAlert.className = styles.warningAlert;
        }
        else {

            this.state.isDisplayed = true;
            await Axios.post('http://localhost:3001/api/task/isDisplayed/update', { isDisplayed: this.state.isDisplayed, catName: this.state.name_category, taskName: this.state.name, userId: this.state.userId }).then(() => { });

            minusLogo.style.display = "inline";
            plusLogo.style.display = "none";

            div[0].style.display = "inline";
            div[1].style.display = "inline";
            container.style.height = "auto";
            editBtn.style.display ="inline";
            if(divAlert.className == styles.dateAlertGreen){
                divAlert.className = styles.dateAlertOnDisplayedGreen;
            }
            else if(divAlert.className == styles.dateAlertRed)
                divAlert.className = styles.dateAlertOnDisplayedRed;

            else if(divAlert.className == styles.dateAlertOrange)
                divAlert.className = styles.dateAlertOnDisplayedOrange;

            else if(divAlert.className == styles.warningAlert)
                divAlert.className = styles.warningAlertOnDisplayed;
        }
    }
 

    setPositionAndAlert() {
        if (this.state.progress == "Done")
            return "none";

        if (this.state.due_date != null) {
            const dateSplitDue = this.state.due_date.split('T');
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
            
            if(this.state.isDisplayed == false){
                if (diffDays >= 7)
                    return styles.dateAlertGreen;

                if (diffDays <= 1 && diffDays >= 0)
                    return styles.dateAlertRed;

                if (2 <= diffDays)
                    if (diffDays < 7)
                        return styles.dateAlertOrange;

                if(diffDays < 0){
                    return styles.warningAlert; //ALERT DUE DATE OVER
                }
            }   

            if (diffDays >= 7)
                return styles.dateAlertOnDisplayedGreen;

            if (diffDays <= 1 && diffDays >= 0)
                return styles.dateAlertOnDisplayedRed;

            if (2 <= diffDays)
                if (diffDays < 7)
                    return styles.dateAlertOnDisplayedOrange;

            if(diffDays < 0){
                return styles.warningAlertOnDisplayed;  //ALERT DUE DATE OVER 
            }

        }

    }
    setDoneIcon() {
        if (this.state.progress == "Done")
            return "inline";
        else
            return "none";
    }


    componentDidMount() {
        this.getSteps();
    }

    render() {
        return (
            <div id={this.state.name + this.state.name_category + "containerTk"} className="containerTasks" key={this.state.name} style={{height : this.decreaseContentHeight()}}>
                <Button id="buttonDecInc" variant="" onClick={(e) => {
                    this.hideTask()
                }}>
                    <div id="containerSvg">

                        <svg id={this.state.name + this.state.name_category + "plusBtn"} display={this.hideShowBtnPlus()} className="w-6 h-6 plusAndMinusBtn" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        <svg id={this.state.name + this.state.name_category + "minusBtn"} display={this.hideShowBtnMinus()} className="w-6 h-6 plusAndMinusBtn" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                    </div>

                </Button>

                <div className="eachTask">
                    {this.state.name}
                </div>
                <div className="containerProgressBar">
                    <div className="progressState">{this.displayProgress()}</div>
                </div>
                <div  id={this.state.name + this.state.name_category + "edit"}  className="editTaskButton"style={{ display: this.hideOrShowDiv() }}>
                    <EditTaskModal
                        name={this.state.name}
                        due_date={this.state.due_date}
                        nameCategory={this.state.name_category}
                        task_description={this.state.task_description}
                        progress={this.state.progress}
                        userId={this.state.userId}
                    />
                </div>
                <div id="allSteps" style={{ display: this.hideOrShowDiv() }} className={this.state.name + this.state.name_category + "displayDiv"}>
                    {
                        this.state.steps.map(step =>
                            <div key={step.stepText}>
                                <Step
                                    nameTask={this.state.name}
                                    name={step.stepText}
                                    userId={this.state.userId}
                                    nameCat={this.state.name_category}
                                />
                            </div>
                        )
                    }
                </div>
                <div id="addStepButton" style={{ display: this.hideOrShowDiv() }} className={this.state.name + this.state.name_category + "displayDiv"}>
                    <StepModal
                        nameCat={this.state.name_category}
                        nameTask={this.state.name}
                        userId={this.state.userId}
                    />
                </div>
                <div id={this.state.name + this.state.name_category + "dateAlert"} className={this.setPositionAndAlert()} >
                    <Icon icon="Check" style={{ display: this.setDoneIcon() }} id="doneAlert" type="solid" />
                </div>
            </div>
        )
    }
}
