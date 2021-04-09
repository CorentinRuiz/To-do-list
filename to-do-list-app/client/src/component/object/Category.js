import React, { Component } from 'react'
import './css/CategorySection.css'
import EditModal from '../Modal/EditModal'
import Icon from "react-hero-icon"
import Button from 'react-bootstrap/Button'
import '../Modal/css/editModal.css'
import TaskModal from '../Modal/TaskModal'
import Axios from 'axios'
import Task from './Task'



export default class Category extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            color: props.color,
            tasks: [],
            userId: props.userId
        }
    }

    getTask = async () => {
        let data = await Axios.get('http://localhost:3001/api/task/get', { params: { name: this.state.name, userId: this.state.userId } }).then(({ data }) => data);
        this.setState({ tasks: data })
    }

    setNameColor = (color) => {
        let colorToSplit = color.substr(1, 6);
        const redlvl = parseInt(colorToSplit.slice(0, 2), 16);
        const greenlvl = parseInt(colorToSplit.slice(2, 4), 16);
        const bluelvl = parseInt(colorToSplit.slice(4, 6), 16);

        if (redlvl >= 0xdb || bluelvl >= 0xdb || greenlvl >= 0xdb) {
            if (redlvl === 0x00 && bluelvl === 0x00) {
                return "#FFFFFF";
            }
            else if (redlvl === 0x00 && greenlvl === 0x00) {
                return "#FFFFFF";
            }
            else if (bluelvl === 0x00 && greenlvl === 0x00) {
                return "#FFFFFF";
            }
            else if (redlvl <= 0x8C && bluelvl === 0xFF) {
                return "#FFFFFF";
            }
            else {
                return "#000000";
            }
        }
        else {
            return "#FFFFFF";
        }
    }

    componentDidMount(){
        this.getTask();
    }

    render() {
        return (
            <div id={this.state.name} className="catDis" style={{ backgroundColor: this.state.color }} key={this.state.name}>
                <div id="globalDivForCategory">
                    <div id="divTitleCat" style={{ borderColor: this.setNameColor(this.state.color) }}>
                        <p className="titleCat" style={{ color: this.setNameColor(this.state.color) }}>{this.state.name}</p>
                    </div>

                    <div id="allTask">
                        {
                            this.state.tasks.map(task =>
                               <div key={task.taskName}>
                                <Task
                                name={task.taskName}
                                starting_date={task.starting_date}
                                due_date = {task.due_date}
                                task_description = {task.taskDescription}
                                progress = {task.progressTask}
                                name_category = {task.nameCategory}
                                userId = {task.userId}
                                isDisplayed = {task.isDisplayed}
                                /> 
                                </div>
                            )
                        }
                    </div>

                    <Button id="deleteCategoryButton" value={this.state.name} variant="primaryDelete" onClick={(e) => {
                        this.props.deleteCat(this.state.name,this.state.userId);
                        document.location.reload();
                    }}>
                        <Icon icon="trash" type="solid" className="deleteButton" />
                    </Button>

                    <div id="addTaskButtonAndText" style={{ color: this.setNameColor(this.state.color) }}>
                        <TaskModal
                            nameCategory={this.state.name}
                            userId = {this.state.userId}
                        />
                    </div>
                    <div id="editCategoryButton" >
                        <EditModal
                            name={this.state.name}
                            color={this.state.color}
                            userId = {this.state.userId}
                        />
                    </div>
                </div>
            </div>
        )
    }
}