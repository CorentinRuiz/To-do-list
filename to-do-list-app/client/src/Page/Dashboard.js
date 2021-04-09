import React, { useEffect, useState } from 'react'
import '../App.css'
import  { useToasts } from 'react-toast-notifications'
import CategorySection from '../component/object/CategorySection'
import Navbar from '../component/other/NavBar'
import CategoryModal from '../component/Modal/CategoryModal'
import Axios from 'axios'
import { toast } from 'react-toastify'

export default function Dashboard(props){

  const changeDate = (date) =>{
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

function setCookie(cname, cvalue) {
  var d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";"+ expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie(chain) {
  var notif = getCookie(chain);
 
  if (notif != "") {
    return true;
  } else {
      return false;
  }
}

    const notificationControler = () =>{
      Axios.post("http://localhost:3001/api/notification",{id : props.userData.id}).then(res =>{
        if(checkCookie("notif"+props.userData.id) != true){
        if(res.data){
          for(let notif of res.data){
            if(notif != null){
              if(notif.progressTask != "Done"){
                if(!notif.out){
                let chainNotif = "You only have left " + notif.diff + " day to finish the task " + notif.taskName + " start the " + changeDate(notif.start_date)
                toast.dark(chainNotif, {
                  position: "bottom-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  });
                }
                else{
                  let chainNotif = "Your task " + notif.taskName + " isn't done and is outdated"
                  toast.dark(chainNotif, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
                }
                }

            }
            setCookie("notif"+props.userData.id,"send")
            }
          }
         
        }  
      })
    }

  
    notificationControler();
    
    return (
      <div>
        <Navbar 
        userData = {props.userData} 
        />
        <CategoryModal userId = {props.userData.id}/>
        <CategorySection 
        userId = {props.userData.id}
        />
      </div>
    )
}
