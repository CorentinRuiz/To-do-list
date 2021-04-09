import React, { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './css/CategoryModal.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Axios from 'axios'
import Icon from "react-hero-icon"
import '../object/css/DarkMode.css'

toast.configure();
export default function CategoryModal(props) {
  /*CONSTANTE DE COULEUR */
  const red = "#ff0000";
  const orange = "#ffa500";
  const yellow ="#ffff00";
  const green ="#008000";
  const blue ="#0000ff";
  const purple = "#800080";





  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [color, setColor] = useState("#000000");
  const [name, setName] = useState("");

  var DateOfTheDay = new Date();
  var DateOfTheDayString;

  DateOfTheDay.setDate(DateOfTheDay.getDate());

  DateOfTheDayString = (DateOfTheDay.getFullYear() + '-'
      + ('0' + (DateOfTheDay.getMonth() + 1)).slice(-2) + '-'
      + ('0' + DateOfTheDay.getDate()).slice(-2));

  const submitCategory = () => {
    if (name === "") {
      toast.error('Invalid Name', { position: toast.POSITION.TOP_CENTER });
    }
    else {
      Axios.post('http://localhost:3001/api/insert', { name: name, color: color, userId : props.userId, creationDate : DateOfTheDayString }).then(() => {
      document.location.reload();
      }
      ).catch((error) => {
        if (error.response) {
          toast.error('Category already exist', { position: toast.POSITION.TOP_CENTER });
          console.log(props.userId)
        }
      });
      document.getElementById("nameCat").value = "";
      setName("");
      document.getElementById("chooseColor").value = "#000000";
      setColor("#000000");

    }
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

  return (
    <>
      <Button variant="primaryCat" id="btnCreateCat"onClick={handleShow}>
        <Icon icon="ViewGridAdd" type="solid" className="contentButCat"  /> Create category
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className={isDarkModeEnabled()}>
          <Modal.Title id="ModalTitle" >Create category</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkModeEnabled()}>
          <div id="globalDivForCategoryModal">

            <label htmlFor="name" id="labelNameCat">Name of category : </label>
            <input type="text" id="nameCat" minLength="2" maxLength="20" size="20" autoComplete="off" value={name} autoComplete="off"  required onChange={(e) => {
              setName(e.target.value);
            }}></input>

            <label htmlFor="chooseColor" id="labelChooseColor">Choose a color for the category : </label>

          </div>
          <div id="circleColorContainer">
            <button id="redCircle" onClick= { () => setColor(red)}></button>
            <button id="orangeCircle" onClick= { () => setColor(orange)}></button>
            <button id="yellowCircle" onClick= { () => setColor(yellow)}></button>
            <button id="greenCircle" onClick= { () => setColor(green)}></button>
            <button id="blueCircle" onClick= { () => setColor(blue)}></button>
            <button id="purpleCircle" onClick= { () => setColor(purple)}></button>
            <input type="color" id="chooseColor" value={color} required onChange={(e) => {
              console.log(color);
              setColor(e.target.value);
            }}></input>
          </div>
        </Modal.Body>
        <Modal.Footer className={isDarkModeEnabled()}>
          <Button  onClick={submitCategory} id="createButton">
            Create
            </Button>
        </Modal.Footer>
      </Modal>
    </>

  )
}

