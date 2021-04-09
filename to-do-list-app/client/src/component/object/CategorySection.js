import React, { Component } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Axios from 'axios'
import './css/CategorySection.css'
import Category from './Category'

const api = Axios.create({
    baseURL: `http://localhost:3001/api/get`
})


export default class CategorySection extends Component {

    constructor(props) {
        super(props);

        this.state = {
            catList: [],
            userId : props.userId,
            userSettings : []
        }

       
    }
    
  getSettings = async (id) => {
      let settings;
    await Axios.get('http://localhost:3001/api/notif/get',{params: {userId : id }}).then((res)=>{
        settings = res.data[0]
    });
    this.setState({userSettings : settings})
  }

    getCat = async () => {
        let data = await api.get('/',{params: { userId: this.state.userId }}).then(({ data }) => data);
        this.setState({ catList: data })
    }

    deleteCat = async (name,userId) => {
        await Axios.post('http://localhost:3001/api/delete', { name: name,userId : userId })
                    .then(() => { document.location.reload()});
    } 
    
    componentDidMount(){
        this.getCat();
        this.getSettings(this.props.userId);
    }
  
    render() {

        if(this.state.userSettings.filterByCreationDate == 1){
        return (
            <div className="containerCat" key="CatSection">
                {
                this.state.catList.sort((a, b) => a.creation_date > b.creation_date ? 1 : -1).map(category =>
                    <div key={category.nameCategory}>
                        <Category 
                        name={category.nameCategory}
                        color={category.categoryColor}
                        userId={category.userId}
                        deleteCat = {this.deleteCat}
                        />
                    </div>
                )}
            </div>
        )
        }
        else{
            return (
                <div className="containerCat" key="CatSection">
                    {
                    this.state.catList.map(category =>
                        <div key={category.nameCategory}>
                            <Category 
                            name={category.nameCategory}
                            color={category.categoryColor}
                            userId={category.userId}
                            deleteCat = {this.deleteCat}
                            />
                        </div>
                    )}
                </div>
            )
        }
    }
}









