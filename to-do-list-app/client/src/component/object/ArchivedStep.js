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
        }
    }

    render() {
        return (
            <div className="containerStep" key={this.state.name}>
                <div className="eachStep">
                    {this.state.name}
                </div>
            </div>
        )
    }
}
