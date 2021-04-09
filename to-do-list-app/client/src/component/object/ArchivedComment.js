import React, { Component } from 'react'
import './css/Comment.css'






export default class Comment extends Component {

    constructor(props){
        super(props);
        this.state ={
            body : props.body,
            id : props.id,
            date : props.date
        }
    }

    changeDate = (date) =>{
        const dateSplit = date.split('T'); 
        let dateGoodValue = dateSplit[0];
        let splitDate = dateGoodValue.split('-')
        let year = splitDate[0];
        let month = splitDate[1];
        let day = splitDate[2];

        let datefinal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        day = parseInt(day, 10) + 1;

        if (day < 10) {
            day = '0' + day.toString();
        }
        else if (day > datefinal[parseInt(month) - 1]) {
            day = '01'

            if (month == 12) {
                month = '01'
                year = (parseInt(year) + 1).toString()
            } else {
                month = '0' + (parseInt(month) + 1).toString()
            }
        }
        else day = day.toString();

        dateGoodValue = day  + '/' + month + '/' + year;

        return dateGoodValue;
    }

    render() {
        return (
            <div className="containerComment" key={this.state.id}>

                <div className="commentBody">
                    <span>{this.state.body} </span>  
                </div> 
                <div id="dateAndDelete">
                <div id="dateComment"> 
                    <span id="dateMark"> {this.changeDate(this.state.date)}</span>  
                </div>
                </div>
            </div>
              
        )
    }
}
