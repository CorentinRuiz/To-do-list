import React, { Component } from 'react'
import './css/Step.css'
import EditStepModal from '../Modal/EditStepModal'
import Axios from 'axios'

export default class Step extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userId: props.userId,
            name: props.name,
            taskName: props.nameTask,
            catName: props.nameCat,
            check: false,
        }
    }

    getStateStep = async () => {
        let data = await Axios.get('http://localhost:3001/api/step/state/get', { params: { name: this.state.name, taskName: this.state.taskName, userId: this.state.userId, catName: this.state.catName } }).then(({ data }) => data);
        
        this.state.check = data[0].stateStep;

        let allSteps = document.getElementsByClassName('apple-switch');
        for (var index = 0; index < allSteps.length; index++) {
            if (allSteps[index].value == data[0].stepText)
            {
                if(allSteps[index].name == data[0].nameCategory)
                {
                    if(allSteps[index].id == data[0].taskName)
                    {
                        allSteps[index].checked = data[0].stateStep;
                    }
                }
            }
        }
    }

    sendStateStep = async () => {
        this.state.check = !this.state.check;
        await Axios.post('http://localhost:3001/api/step/state/update', { stepState: this.state.check, name: this.state.name, taskName: this.state.taskName, userId: this.state.userId, catName: this.state.catName }).then(() => { });
    }

    componentDidMount() {
        this.getStateStep();
    }

    render() {
        return (
            <div className="containerStep" key={this.state.name}>
                <div id="stepState">
                    <input className="apple-switch" value={this.state.name} name={this.state.catName} id={this.state.taskName} type="checkbox" onClick={this.sendStateStep} />
                </div>
                <div className="eachStep">
                    {this.state.name}
                </div>
                <div id="editStepModal">
                    <EditStepModal
                        nameTask={this.state.taskName}
                        name={this.state.name}
                        userId={this.state.userId}
                        catName={this.state.catName}
                    />
                </div>
            </div>
        )
    }
}
