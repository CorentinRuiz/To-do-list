import React, { Component } from 'react'
import './css/NavBar.css'
import Logo from "../Element/LogoCHECKIT.png"
import Icon from "react-hero-icon"
import Button from 'react-bootstrap/Button'
import AboutModal from '../Modal/AboutModal'
import TaskBoard from '../Modal/TaskBoard'
import Axios from 'axios'
import DisplaySettingsModal from '../Modal/DisplaySettingsModal.js'
import DarkMode from "../object/DarkMode.js"

export default class NavBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userData: props.userData,
            NotifList : [],
            DiffList : []
        }
    
    }

    getNotification = async () =>{
        await Axios.get('http://localhost:3001/get/NotifTask', { params:{ userId : this.state.userData.id} }).then( res =>{
            this.setState({NotifList: res.data.result});
            this.setState({DiffList : res.data.diff })
        });
        
    }

    displaySettings = () => {
        const displaySettings = document.getElementById("idDisplaySettings");
        if (displaySettings.classList.contains("show")) {
            displaySettings.classList.remove("show");
        }
        else {
            displaySettings.classList.add("show");
        }
    }

    displayNotify = () => {
        const displaySettings = document.getElementById("idDisplayNotify");
        if (displaySettings.classList.contains("show")) {
            displaySettings.classList.remove("show");
        }
        else {
            displaySettings.classList.add("show");
        }
    }

    logOut = () => {
        Axios.post('http://localhost:3001/logout').then(() => { document.location.reload() })
    }

    componentDidMount(){
        this.getNotification();
    }
    render() {
        let ListNotifDisp = [] 

        
            for(let notif = 0; notif < this.state.NotifList.length; notif++){ 
               
                if(this.state.NotifList[notif] != null){  
                    if(this.state.NotifList[notif].progressTask != "Done"){
                const dateStartSplit = this.state.NotifList[notif].starting_date.split('T');
               
                let start_date = dateStartSplit[0];
               
                let start_dateSplit = start_date.split('-');

                let day = start_dateSplit[2]
                let month = start_dateSplit[1]
                let year = start_dateSplit[0]

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

                
                  if(this.state.DiffList[notif] < 0){
                    ListNotifDisp.push(<li key={this.state.NotifList[notif].taskName + this.state.NotifList[notif].categoryName} className="oudated">Your task {this.state.NotifList[notif].taskName} isn't done and is outdated. </li>)
                  }  
                  else {
                    ListNotifDisp.push(<li key={this.state.NotifList[notif].taskName + this.state.NotifList[notif].categoryName} >You only have {this.state.DiffList[notif]} days left to finish the task {this.state.NotifList[notif].taskName}. This task has started the {day}/{month}/{year}.</li>)
                  }
                
                    }
                } 
            }

        if(ListNotifDisp.length == 0){
            ListNotifDisp.push(<li key={"noNotif"}>You have no notification</li>)
        }
        return (
            <div className="navigation">

                <div className="title"><img className="logoCHECKIT" src={Logo} alt="Error Loading logo"></img></div>
                <div className="logos">
                    <DarkMode/>
                    <div>
                        <AboutModal />
                    </div>
                    <div>
                        <TaskBoard id={this.state.userData.id}></TaskBoard>
                    </div>
                    <div className="btn-group">
                        <Button id="notify" onClick={this.displayNotify} variant="dropNotify"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <Icon icon="bell" type="solid" className="bell" />
                        </Button>
                        <div className="dropdown-menu dropdown-menu-right" id="idDisplayNotify">
                            <div className="menuNotify" >
                                <span>Notify</span>
                            </div>
                            <ul>
                              {ListNotifDisp}
                            </ul>
                        </div>
                    </div>

                    <div className="settings btn-group dropleft ">
                        <Button id="btnSettings" onClick={this.displaySettings} variant="dropSettings">
                            <Icon icon="cog" type="solid" className="cog" />
                        </Button>
                        <div className="dropdown-menu " id="idDisplaySettings">
                            <div>
                                <DisplaySettingsModal userData={this.state.userData} />
                            </div>
                            <button className="dropdown-item" type="button" onClick={this.logOut} ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-door-open-fill" viewBox="0 0 16 16" >
                                <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
                            </svg>Log-out</button>

                        </div>
                    </div>


                </div>




            </div>

        )
    }
}
