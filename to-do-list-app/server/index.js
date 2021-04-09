const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require ('mysql')
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nodemailer = require('nodemailer');

const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = mysql.createPool({
    host:'gigondas',
    user:'pjtodo',
    password:'Todo-List',
    database:'pjtodo',
    multipleStatements: true
})

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: false,
    },
  })
);


/*const transporter = nodemailer.createTransport({
  host: 'gmail',
  auth: {
      user: 'checit.notification@gmail.com', // generated ethereal user
      pass: 'Checkit26'  // generated ethereal password
  },
  tls:{
    rejectUnauthorized:false
  }
});*/

app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
  
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
  
      db.query(
        "INSERT INTO user (username, password, email) VALUES (?,?,?)",
        [username, hash, email],
        (err, result) => {
          if(result){
            db.query("SELECT id FROM user WHERE username= ?",[username],(er,response)=>{
              if(response){
                let int = 0;
                  db.query("INSERT INTO userSettings(id,pushNotif,emailNotif,filterByCreationDate) VALUES (?,?,?,?) ",[response[0].id,int,int,int],(e,r)=>{
                    if(r){
                      res.send(r)
                    }
                    if(e){
                      console.log(e)
                    }
                  })
              }
              if(er){
                console.log(er)
              }
            })
          }else{
            res.send({ message: "Username already exist" });
            console.log(err);
          }
         
          
        }
      );
    });
  });
  
  app.get("/login", (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
  });
  
  app.post("/logout", (req, res) => {
    req.session.destroy();
    res.send({ loggedIn: false })
  });

  app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    db.query(
      "SELECT * FROM user WHERE username = ?;",
      username,
      (err, result) => {
        if (err) {
          res.send({ err: err });
        }
  
        if (result.length > 0 ) {
          bcrypt.compare(password, result[0].password, (error, response) => {
            if (response) {
              req.session.user = result;
              console.log(req.session.user);
              res.send(result);
            } else {
              res.send({ message: "Wrong username/password combination!" });
            }
          });
        } else {
          res.send({ message: "User doesn't exist" });
        }
      }
    );
  });

app.post('/api/insert',(req,res)=>{

    const color = req.body.color;
    const name = req.body.name;
    const id = req.body.userId;
    const creation_date = req.body.creationDate;

    const stmt = "INSERT INTO category (nameCategory,categoryColor,userId,creation_date) VALUES (?,?,?,?)"

    db.query(stmt,[name,color,id,creation_date],(err,result)=>{
        console.log(result);
        if(result){
            res.send(result);
        }
        if(err){
          console.log(err)
            res.status(400).send('Error in database operation');
        }
    });
    
});

app.post('/api/update',(req,res)=>{

    const oldname = req.body.oldname;
    const color = req.body.color;
    const name = req.body.name;
    const userId = req.body.userId
    
    const stmt = "UPDATE category SET nameCategory=?, categoryColor=? WHERE nameCategory=? AND userId= ?";
    db.query(stmt,[name,color,oldname,userId],(err,result)=>{
        console.log(result)
        if(result){
            res.send(result);
        }
        if(err){
            console.log(err);
            res.status(400).send('Error in database operation');
        }
    });
    
});

app.post('/api/delete',(req,res)=>{

   const name = req.body.name;
   const userId = req.body.userId

    const stmt = "DELETE FROM category WHERE nameCategory=? AND userId = ?";
    
    db.query(stmt,[name,userId],(err,result)=>{
        console.log(result)
        console.log(err)
    });
    
});

app.get('/api/get',(request,response)=>{
  const userId = request.query.userId;

    const stmt = "SELECT * FROM category WHERE userId = ?"; 

    db.query(stmt,[userId],(err,result)=>{
        response.send(result);
        console.log(result);
        if(err){
            res.status(400).send('Error in database operation');
        }
    })
})


app.post('/api/task/insert',(req,res)=>{

    const name = req.body.name;
    const description = req.body.description;
    const dueDate = req.body.dueDate;
    const startingDate = req.body.startingDate;
    const progress = req.body.progress;
    const nameCat = req.body.nameCat;
    const userId = req.body.userId;
    console.log(userId)

    const stmt = "INSERT INTO task (taskName,starting_date,due_date,taskDescription,progressTask,nameCategory,userId) VALUES (?,?,?,?,?,?,?)"

    db.query(stmt,[name,startingDate,dueDate,description,progress,nameCat,userId],(err,result)=>{
        console.log(result);
        if(result){
            res.send(result);
        }
        if(err){
          console.log(err)
            res.status(400).send('Error in database operation');
        }
    });
     
 });

 app.post('/api/step/insert',(req,res)=>{

  const stepName = req.body.nameStep;
  const taskName = req.body.nameTask;
  const catName = req.body.nameCat;
  const userId = req.body.userId;


  const stmt = "INSERT INTO step (stepText,nameCategory,taskName,userId) VALUES (?,?,?,?)"

  db.query(stmt,[stepName,catName,taskName,userId],(err,result)=>{
      console.log(result);
      if(result){
          res.send(result);
      }
      if(err){
        console.log(err)
          res.status(400).send('Error in database operation');
      }
  });
   
});


app.get('/api/step/get',(req,res)=>{
    
  const nameCat = req.query.nameCat;
  const userId = req.query.userId;
  const nameTask = req.query.nameTask;
  const stmt = "SELECT * FROM step WHERE nameCategory = ? AND taskName = ? AND userId = ?";


  db.query(stmt,[nameCat,nameTask,userId],(err,result)=>{
      /*console.log(result);*/
      if(result){
          res.send(result);
      }
      if(err){
          res.status(400).send('Error in database operation');
      }
  });
   
});

app.post('/api/step/update',(req,res)=>{

  const oldname = req.body.oldName;
  const name = req.body.name;
  const userId = req.body.userId;
  const catName = req.body.catName;
  const nameTask = req.body.nameTask
  
  const stmt = "UPDATE step SET stepText=? WHERE stepText=? AND userId= ? AND nameCategory=? AND taskName=?";
  db.query(stmt,[name,oldname,userId,catName, nameTask],(err,result)=>{
      console.log(result)
      if(result){
          res.send(result);
      }
      if(err){
          console.log(err);
          res.status(400).send('Error in database operation');
      }
  });
});

app.get('/api/step/state/get',(req,res)=>{
    
  const nameCat = req.query.catName;
  const userId = req.query.userId;
  const nameTask = req.query.taskName;
  const name = req.query.name;

  const stmt = "SELECT stateStep, stepText, nameCategory, taskName FROM step WHERE nameCategory = ? AND taskName = ? AND userId = ? AND stepText=?";

  db.query(stmt,[nameCat,nameTask,userId,name],(err,result)=>{
      console.log(result);
      if(result){
          res.send(result);
      }
      if(err){
          res.status(400).send('Error in database operation');
      }
  });
   
});

app.post('/api/step/state/update',(req,res)=>{

  const state = req.body.stepState;
  const name = req.body.name;
  const userId = req.body.userId;
  const taskName = req.body.taskName;
  const catName = req.body.catName;
  
  const stmt = "UPDATE step SET stateStep=? WHERE stepText=? AND userId= ? AND taskName= ? AND nameCategory= ? ";
  db.query(stmt,[state,name,userId,taskName,catName],(err,result)=>{
      console.log(result)
      if(result){
          res.send(result);
      }
      if(err){
          console.log(err);
          res.status(400).send('Error in database operation');
      }
  });
});

app.get('/api/step/state/get',(req,res)=>{
    
  const nameCat = req.query.name;
  const userId = req.query.userId;
  const stmt = "SELECT * FROM task WHERE nameCategory = ? AND userId = ?";


  db.query(stmt,[nameCat,userId],(err,result)=>{
      /*console.log(result);*/
      if(result){
          res.send(result);
      }
      if(err){
          res.status(400).send('Error in database operation');
      }
  });
});

app.post('/api/step/delete',(req,res)=>{

  const name = req.body.name;
  const taskName = req.body.taskName;
  const userId = req.body.userId;
  const nameCat = req.body.catName;

   const stmt = "DELETE FROM step WHERE stepText = ? AND taskName=? AND userId=? AND nameCategory=?";
   
   db.query(stmt,[name,taskName,userId,nameCat],(err,result)=>{
       console.log(result)
      if(result){
          res.send(result);
      }
      if(err){
          res.status(400).send('Error in database operation');
      }
   });
});

app.post('/api/task/isDisplayed/update',(req,res)=>{
   
  const isDisplayed = req.body.isDisplayed;
  const catName = req.body.catName;
  const taskName = req.body.taskName; 
  const userId = req.body.userId;

  const stmt = "UPDATE task SET isDisplayed=? WHERE nameCategory=? AND taskName=? AND userId= ?" ;


  db.query(stmt,[isDisplayed,catName,taskName,userId],(err,result)=>{
      if(result){
          res.send(result);
      }
      if(err){
          res.status(400).send('Error in database operation');
      }
  });
});


 app.get('/api/task/get',(req,res)=>{
    
    const nameCat = req.query.name;
    const userId = req.query.userId;
    const stmt = "SELECT * FROM task WHERE nameCategory = ? AND userId = ? AND isArchived=0";


    db.query(stmt,[nameCat,userId],(err,result)=>{
        /*console.log(result);*/
        if(result){
            res.send(result);
        }
        if(err){
            res.status(400).send('Error in database operation');
        }
    });
     
 });

 app.get('/api/taskArchived/get',(req,res)=>{
    
  const nameCat = req.query.name;
  const userId = req.query.userId;
  const stmt = "SELECT * FROM task WHERE nameCategory = ? AND userId = ? AND isArchived = true";


  db.query(stmt,[nameCat,userId],(err,result)=>{
      /*console.log(result);*/
      if(result){
          res.send(result);
      }
      if(err){
          res.status(400).send('Error in database operation');
      }
  });
   
});

 app.post('/api/task/delete',(req,res)=>{

    const name = req.body.name;
    const nameCat = req.body.nameCat;
    const userId = req.body.userId;

     const stmt = "DELETE FROM task WHERE taskName = ? AND nameCategory=? AND userId=?";
     
     db.query(stmt,[name,nameCat,userId],(err,result)=>{
         console.log(result)
        if(result){
            res.send(result);
        }
        if(err){
            res.status(400).send('Error in database operation');
        }
     });
 });

 app.post('/api/task/update',(req,res)=>{

    const name = req.body.name;
    const nameCat = req.body.nameCat;
    const description = req.body.description;
    const dueDate = req.body.dueDate;
    const progress = req.body.progress;
    const oldName = req.body.oldnametask;
    const userId = req.body.userId;

     const stmt = "UPDATE task SET taskName= ?, due_date= ?, taskDescription=?, progressTask= ? WHERE nameCategory=? AND taskName=? AND userId= ?" ;
     
     db.query(stmt,[name,dueDate,description,progress,nameCat,oldName,userId],(err,result)=>{
         console.log(result)
        if(result){
            res.send(result);
        }
        if(err){
            console.log(err);
            res.status(400).send('Error in database operation');
        }
     });
     
 });

 app.post('/api/task/update/archive',(req,res)=>{

  const name = req.body.name;
  const nameCat = req.body.nameCat;
  const userId = req.body.userId;

   const stmt = "UPDATE task SET isArchived= true WHERE nameCategory=? AND taskName=? AND userId= ?" ;
   
   db.query(stmt,[nameCat,name,userId],(err,result)=>{
       /*console.log(result)*/
      if(result){
          res.send(result);
      }
      if(err){
          console.log(err);
          res.status(400).send('Error in database operation');
      }
   });
   
});

 app.post('/api/comment/insert',(req,res)=>{

    const comment = req.body.comment;
    const name = req.body.name;
    const nameCat = req.body.nameCat;
    const userId = req.body.userId;
    const date = req.body.date;

    const stmt = "INSERT INTO comment(commentBody,taskName,nameCategory,userId,date_comment) VALUES (?,?,?,?,?)"

    db.query(stmt,[comment,name,nameCat,userId,date],(err,result)=>{
        /*console.log(result);*/
        if(result){
            res.send(result);
        }
        if(err){
            console.log(err)
            res.status(400).send('Error in database operation');
        }
    });
    
});

app.get('/api/comment/get',(req,res)=>{
    const taskName = req.query.nameTask;
    const categoryName = req.query.nameCat;
    const userId = req.query.userId;

    const stmt = "SELECT * FROM comment WHERE nameCategory=? AND taskName= ? AND userId = ? ";
    
    
    db.query(stmt,[categoryName,taskName,userId],(err,result)=>{
        /*console.log(result);*/
        if(result){
            res.send(result);
        }
        if(err){
            console.log(err);
            res.status(400).send('Error in database operation');
        }
    });

});
app.post('/api/comment/delete',(req,res)=>{

    const id = req.body.id;

     const stmt = "DELETE FROM comment WHERE id=?";
     
     db.query(stmt,[id],(err,result)=>{
         /*console.log(result)*/
        if(result){
            res.send(result);
        }
        if(err){
            res.status(400).send('Error in database operation');
        }
     });
     
 });

  app.post('/api/notif/change',(req,res)=>{
    const id = req.body.id;
    const pushNotif = req.body.pushNotif;
    const emailNotif = req.body.emailNotif;
    const filterByCreaDate = req.body.filterByCreaDate;

    console.log(filterByCreaDate)
  
    const stmt = "SELECT * FROM userSettings ";
    
    db.query(stmt,[id],(err,results)=>{
        /*console.log(results)*/
       if(results){
        let exist = false;

        for(result of results){
         if(result.id == id){
          exist= true;}
        } 

        if(exist){
            db.query("UPDATE userSettings SET pushNotif=?, emailNotif= ? , filterByCreationDate = ? WHERE id=? ", [pushNotif,emailNotif,filterByCreaDate,id],(error,response)=>{
              /*console.log(response)*/
              console.log(error)
              if(response){
                res.send(response);
              }
            if(error){
                res.status(400).send('Error in database operation');
              }
             
            });
          }
          else{
            db.query( "INSERT INTO userSettings (id,pushNotif,emailNotif,filterByCreationDate) VALUES (?,?,?,?) ", [id,pushNotif,emailNotif,filterByCreaDate],(error,response)=>{
              /*console.log(response)*/
              console.log(error)
              if(response){
                res.send(response);
              }
            if(error){
                res.status(400).send('Error in database operation');
              }
             });
            }

          }if(err){
            res.status(400).send('Error in database operation');
          }
        });

  });

  app.get('/api/notif/get',(req,res)=>{

    const userId = req.query.userId;

    const stmt = "SELECT * FROM userSettings WHERE id=? ";
    
    
    db.query(stmt,[userId],(err,result)=>{
        /*console.log(result);*/
        if(result){
            res.send(result);
        }
        if(err){
            console.log(err);
            res.status(400).send('Error in database operation');
        }
    });

});

app.post('/api/account/delete',(req,res)=>{
  const id = req.body.id;

  const stmt = "DELETE FROM user WHERE id=?";
  
  db.query(stmt,[id],(err,result)=>{
      /*console.log(result);*/
     if(result){   
        res.send(result);
     }
     if(err){
         res.status(400).send('Error in database operation');
     }
  });

});

app.post('/api/updatePassword',(req,res)=>{

  const id = req.body.id;
  const actualPassword = req.body.actualPassword;
  const newPassword = req.body.newPassword;

  const stmt = "SELECT * FROM user WHERE id=?;"
  db.query(stmt,[id],(err,result)=>{
     if(result.length>0){
   
        bcrypt.compare(actualPassword,result[0].password,(error,response) =>{
          
          if(response){
            bcrypt.hash(newPassword, saltRounds, (er, hashNewPass) => {
              if(er){
                console.log(er);
              }
            db.query("UPDATE user SET password=? WHERE id=?",[hashNewPass,id],(e,r) =>{
              if(r){
                console.log(r);
                res.send(r);
              }
              if(e){
                res.status(400).send('Error in database operation');
              }
            });
          });
          }else{
            res.send({Message : "The actual password isn't good"});
          }
        });
     }

     if(err){
         res.status(400).send('Error in database operation');
     }
  });

});

app.post('/api/notification',(req,res)=>{
  const id = req.body.id;

  const stmt = "SELECT * FROM userSettings WHERE id=?"

  db.query(stmt,[id],(errorSQ,resSQ) =>{
    if(resSQ){
      if(resSQ[0].pushNotif == 1){
        db.query("SELECT * FROM task WHERE userId=?",[id],(errorTQ,resTQ) =>{
          if(resTQ){
            let aEnvoyer = [];
            for(let task = 0; task < resTQ.length; task++){
              let resCheck = checkDate(resTQ[task].due_date)
              /*console.log(resCheck.result)*/
              if(resCheck.result){
                if(resTQ[task].isArchived == 0){
                 /* if(resSQ[0].emailNotif == 1){
                  db.query("SELECT * FROM user WHERE id=?",[id],(errUQ,resUQ)=>{
                    if(resUQ){
                      let emailtype = `
                      <h3>Notification</h3>
                      <li>You only have left ${resCheck.diff} day to finish the task ${resTQ[task].taskName} start the ${changeDate(resTQ[task].starting_date.toString())}</li>
                    `;
                      let mailOptions = {
                        from: '"CheckIt Contact" <checit.notification@gmail.com>', // sender address
                        to: resUQ[0].email , // list of receivers
                        subject: 'Task Notification', // Subject line
                        text: 'Notif', // plain text body
                        html: emailtype // html body
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                      console.log('Message sent: %s', info.messageId);   
                      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                
                      res.render('contact', {msg:'Email has been sent'});
                     });
                    }
                  })
                }*/
                 
                  if(resCheck.diff < 0){
                     aEnvoyer[task] = {taskName : resTQ[task].taskName, start_date : resTQ[task].starting_date, diff : 0, progressTask : resTQ[task].progressTask, out : "outdated"}
                  }
                  else{
                      aEnvoyer[task] = {taskName : resTQ[task].taskName, start_date : resTQ[task].starting_date, diff : resCheck.diff, progressTask : resTQ[task].progressTask}
                  }
                 
                  }
               }
            
             }
             /*console.log('ici',resTQ)*/

             res.send(aEnvoyer)
          }
          if(errorTQ){
            console.log(errorTQ);
            
          }

        })
      }
    }
    else if(errorSQ){
      console.log('err')
      console.log(errorSQ)
    }
  })
});


app.post('/update/username',(req,res)=>{
  const id = req.body.id
  const username = req.body.username;

  db.query("UPDATE user SET username=? WHERE id=? ",[username,id],(err,result)=>{
    if(result){
      console.log(result)
      res.send(result)
    }
    if(err){
      res.send({Message : "This username is already use"})
      console.log(err)
    }
})
  
});


app.post('/update/email',(req,res)=>{
  const id = req.body.id
  const email = req.body.username;

  db.query("UPDATE user SET email=? WHERE id=? ",[email,id],(err,result)=>{
    if(result){
      console.log(result)
      res.send(result)
    }
    if(err){
      res.send({Message : "This email is already use"})
      console.log(err)
    }
})
  
});
 


app.get("/get/NotifTask",(req,res)=>{

  const userId = req.query.userId;
  const stmt = "SELECT * FROM task WHERE userId = ?";


  db.query(stmt,[userId],(err,result)=>{
      let TabResultat = [];
      let diffTab = [];
      if(result){
        let i = 0;
          for(let task of result){
            let resCheck = checkDate(task.due_date)
            if(resCheck.result){
              if(task.isArchived == 0){ 
                TabResultat[i] = task;
                diffTab[i] = resCheck.diff;
              }
            }
            i++;
          }
          /*console.log("TabRes",TabResultat)*/
          res.send({result : TabResultat, diff : diffTab})
      }
      if(err){
          res.status(400).send('Error in database operation');
      }
  });
})

app.get("/get/forTaskBoard",(req,res)=>{

  const userId = req.query.userId;
  const stmt = "SELECT * FROM task WHERE userId = ?";


  db.query(stmt,[userId],(err,result)=>{
      let TabGoodTask = [];
      let TabExpireSoonTask = [];
      let TabOneWeekTask = [];
      let TabOutdatedTask = [];
     

      if(result){
        let i = 0;
          for(let task of result){
            let resCheck = checkDateToGet(task.due_date)
            if(task.isArchived == 0){ 
              switch(resCheck.result){
                case "goodTask":
                  TabGoodTask[i] = task;
                  break;
                case "expireSoon":
                  TabExpireSoonTask[i] = task;
                  break;
                case "outdated" :
                  TabOutdatedTask[i] = task;
                  break;
                case "oneWeek" :
                  TabOneWeekTask[i] = task;
                  break;
                
              }
              
            }
            i++;
          }
         
          res.send({TabGoodTask : TabGoodTask,TabExpireSoonTask : TabExpireSoonTask,TabOneWeekTask : TabOneWeekTask,TabOutdatedTask : TabOutdatedTask})
      }
      if(err){
          res.status(400).send('Error in database operation');
      }
  });
})



app.listen(3001, ()=>{
  console.log('run on port 3001');
});

const checkDate = (Due) =>{
   let result = false
   let diffDays = 0;
   
if(Due != null){
  let newDate = new Date();
 
  let SplitDue = Due.toString().split(' ')
  
  let dueDate = new Date("" + SplitDue[1] + "/" + SplitDue[2] + "/" + SplitDue[3] + "");
  var timeDiff = dueDate.getTime() - newDate.getTime();
  diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));


  if (diffDays < 7) result = true;

}
  
  return { result : result, diff : diffDays }
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


const checkDateToGet = (Due) =>{
  let result = "goodTask"
  let diffDays = 0;
  
if(Due != null){
 let newDate = new Date();

 let SplitDue = Due.toString().split(' ')
 
 let dueDate = new Date("" + SplitDue[1] + "/" + SplitDue[2] + "/" + SplitDue[3] + "");
 var timeDiff = dueDate.getTime() - newDate.getTime();
 diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));


 if (diffDays < 7 && diffDays > 1) result = "oneWeek";
 if (diffDays <= 1 && diffDays >= 0) result = "expireSoon";
 if(diffDays < 0) result = "outdated";

}
 
 return { result : result, diff : diffDays }
}