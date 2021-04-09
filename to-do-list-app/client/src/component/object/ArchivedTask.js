import React, { Component } from 'react'
import './css/ArchivedTask.css'
import Axios from 'axios'
import Button from 'react-bootstrap/Button'
import ArchivedStep from "./ArchivedStep.js"
import ConsultArchivedTaskModal from "../Modal/ConsultArchivedTaskModal.js"


export default class Task extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            due_date: props.due_date,
            task_description: props.task_description,
            name_category: props.name_category,
            userId: props.userId,
            steps: [],
        }
    }

    getSteps = async () => {
        let data = await Axios.get('http://localhost:3001/api/step/get', { params: { nameCat: this.state.name_category, userId: this.state.userId, nameTask: this.state.name } }).then(({ data }) => data);
        this.setState({ steps: data })
    }


    componentDidMount() {
        this.getSteps();
    }

    render() {
        return (
            <div className="containerTaskArchived"  key={this.state.name} >

                <div className="eachTaskArchived">
                    {this.state.name}
                </div>
                <div id="consultArchivedbtn">
                    <ConsultArchivedTaskModal
                        name={this.state.name}
                        due_date={this.state.due_date}
                        nameCategory={this.state.name_category}
                        task_description={this.state.task_description}
                        userId={this.state.userId}
                    />
                </div>
                <div className="allStepsArchived">
                    {
                        this.state.steps.map(step =>
                            <div key={step.stepText}>
                                <ArchivedStep
                                    nameTask={this.state.name}
                                    name={step.stepText}
                                    userId={this.state.userId}
                                    nameCat={this.state.name_category}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}
