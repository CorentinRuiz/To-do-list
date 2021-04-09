import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Axios from 'axios'
import Icon from "react-hero-icon"
import './css/DisplaySettingsModal.css'
import DeleteModal from './DeleteAccModal'
import ChangePass from './ChangePassModal'
import ChangeUsername from './ChangeUsernameModal'
import ChangeEmail from './ChangeEmailModal'
import '../object/css/DarkMode.css'


toast.configure();
export default function DisplaySettingsModal(props) {
  const [show, setShow] = useState(false);
  const [userInfo, setUserInfo] = useState(props.userData);
  const [pushNotif, setPushNotif] = useState(0);
  const [emailNotif, setEmailNotif] = useState(0);
  const [filterByCreaDate, setFilterByCreaDate] = useState(0);
  const [username, setUsername] = useState(userInfo.username);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const sendChange = async () => {
    await Axios.post('http://localhost:3001/api/notif/change', { id: userInfo.id, pushNotif: pushNotif, emailNotif: emailNotif, filterByCreaDate: filterByCreaDate }).then(() => {
      toast("Nice change", { position: toast.POSITION.TOP_CENTER })
      document.location.reload()
    })
  }

  const isDarkModeEnabled = () => {
    if (document.body.classList.contains('darkModeEnabled')) 
    {
      return "darkMode";
    }
    else {
      return "lightMode";
    }
  }


  const getSettings = async () => {
    await Axios.get('http://localhost:3001/api/notif/get', { params: { userId: userInfo.id } }).then((res) => {
      if (res.data[0] != null) {
        setEmailNotif(res.data[0].emailNotif);
        setPushNotif(res.data[0].pushNotif);
        setFilterByCreaDate(res.data[0].filterByCreationDate)
      }
    });

  }

  useEffect(() => {
    getSettings();
  }, []);


  return (
    <>
      <button className="dropdown-item" type="button" onClick={handleShow}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" id="svgSettings" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
          Settings
      </button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className={isDarkModeEnabled()}>
          <Modal.Title >Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkModeEnabled()}>
          <Tabs defaultActiveKey="MyAccount" id="noanim-tab-example">
            <Tab eventKey="MyAccount" title="My Account">

              <div id="settingsTabs">
                <label id="settingUsernameLabel" >
                  Username :
          </label>
                <input id="settingUsernameInput" type="text" value={username} disabled={true}></input>
                <div id="changeButton"><ChangeUsername id={userInfo.id}/></div>

                <label id="settingEmailLabel" >
                  Email :
                </label>
                <input id="settingEmailInput" type="text" value={userInfo.email} disabled={true}></input>
                <div id="changeEmail"><ChangeEmail id={userInfo.id}/></div>
                
                <ChangePass userInfo={userInfo} />
              </div>
              <div>
                <DeleteModal id={userInfo.id} />
              </div>
            </Tab>
            <Tab eventKey="Notifications" title="Notifications">
              <div id="notifDiv" >

                <div id="pushNotif">

                  <label className="switch" id="pushNotifButton">
                    <input type="checkbox" checked={pushNotif} onChange={() => {
                      if (pushNotif == 0) setPushNotif(1);
                      if (pushNotif == 1) setPushNotif(0);
                    }}></input>
                    <span className="slider round"></span>
                  </label>
                  <label id="pushNotifLabel">Push Browser Notifications</label>

                </div>

                <div id="emailNotif">

                  <label id="emailNotifButton" className="switch">
                    <input type="checkbox" checked={emailNotif} onChange={() => {
                      if (emailNotif == 0) setEmailNotif(1);
                      if (emailNotif == 1) setEmailNotif(0);
                    }}></input>
                    <span className="slider round"></span>
                  </label>

                  <label id="emailNotifLabel">E-mail Notifications</label>

                </div>
              </div>
              <Button id="saveChanges" variant="" onClick={sendChange}> Save changes</Button>
            </Tab>
            <Tab eventKey="Preferences" title="Preferences">
              <div id="containerPref">
                <label className="switch">
                  <input type="checkbox" checked={filterByCreaDate} onChange={() => {
                    if (filterByCreaDate == 0) setFilterByCreaDate(1);
                    if (filterByCreaDate == 1) setFilterByCreaDate(0);

                  }}></input>
                  <span className="slider round"></span>
                </label>

                <label id="pushFilterLabel">Filtering categories by creation date</label>
              </div>
              <Button id="btnSavePref" variant="" onClick={sendChange}> Save changes</Button>
            </Tab>
          </Tabs>

        </Modal.Body>
      </Modal>
    </>
  );
}
