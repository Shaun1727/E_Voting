let usr='';
const express = require('express')
const app = express()
const mysql = require("mysql2")
const { reset } = require('nodemon')
const path = require("path")
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "shaun123456st",
    database: "sample"
});

con.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Connected Succesfully!")

        // con.query("CREATE DATABASE mydb", function (err, result) {
        //     if (err) throw err;
        //     console.log("Database created");
        //   });
        // con.query("use mydb")
        // con.query("create table citizen( username varchar(50),password varchar(25),name varchar(30),age int)")

    }
})
// con.close();

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "\\login.html");
    // res.render("pages/")
})
//  C:\Users\Lenovo\Desktop\E-Voting\citizen-vote.html
app.get("/", (req, res) => {
    res.sendFile(__dirname + "\\index (copy).html")
})
// app.get("/login",(req,res)=>{
//     res.sendFile(__dirname+"/login.html")
// })

app.get("/citizen-choose",(req,res)=>{
    let sql="select election_name,e_id from election";
    con.query(sql,(err,result)=>{
        console.log(result);
        res.render("pages/citizen-choose-election",{values:result})
    })
    
})
let id;
app.post("/insert-vote",(req,res)=>{
    let sql="insert into votes values("+id+","+parseInt(req.body.btn)+","+"'"+usr+"');"
    console.log(sql)
    con.query(sql,(err,result)=>{
        res.redirect("/citizen-choose")
    })
})
app.post("/citizen-vote",(req,res)=>{
     id=parseInt(req.body.btn);
    console.log(id);
    let flag=true;
    //console.log('username:')
   // console.log(usr)
    let sql="select e_id from votes where username='"+usr+"';"
    con.query(sql,(err,result)=>{
        console.log(result)
        let arr=[]
        result.forEach((item)=>{
            arr.push(item.e_id)
        })
        if(arr.includes(id)==false){
            flag=false;
        }
    })
     sql = "select c_name,candidate_id,ph_no,DATE_FORMAT(date_of_birth,'%Y-%m-%d') date from candidate where e_id="+id+";"
    con.query(sql, (err, result) => {
        console.log(result);
        res.render('pages/citizen-vote', { values: result,voted:flag })
    })
})
// app.get("/citizen-vote", (req, res) => {
//     //console.log(__dirname)
//     let sql = "select c_name,candidate_id,ph_no,DATE_FORMAT(date_of_birth,'%Y-%m-%d') date from candidate where e_id="+id+";"
//     con.query(sql, (err, result) => {
//         console.log(result);
//         res.render('pages/citizen-vote', { values: result })
//     })
//     //res.sendFile(__dirname+"\\citizen-vote.html")
// })
app.get("/citizen-home", (req, res) => {
    res.render("pages/citizen-home")
})
// app.get("/manage-election",(req,re
//     res.render("pages/admin-melections")
// })
app.get("/manage-candidate",(req,res)=>{
    let sql="select candidate_id,username,c_name,ph_no,DATE_FORMAT(date_of_birth,'%Y-%m-%d') dob from candidate;"
    con.query(sql,(err,result)=>{
        res.render("pages/admin-mcandidate",{values:result})
    })
})


app.get("/manage-votes",(req,res)=>{
    let sql="select count(*) count,c.candidate_id as c_id,c.e_id as e_id,c.c_name,DATE_FORMAT(c.date_of_birth,'%Y-%m-%d')as dob from candidate c,votes v where c.e_id=v.e_id and c.candidate_id=v.c_id group by c.e_id,c.candidate_id;"
    var values=[]
     con.query(sql,(err,result)=>{
        console.log(result)
        res.render("pages/admin-mvotes",{values:result})
    })
    // setTimeout(()=>{
        
    //     res.render("pages/admin-mvotes")
    // },300)
//    console.log(values)
})
app.get("/manage-citizen",(req,res)=>{
    let sql="select name,username,age,DATE_FORMAT(dob,'%Y-%m-%d') dob from citizen;";
    con.query(sql,(err,result)=>{
        //if(err) throw err
        res.render("pages/admin-citizen",{values:result})
    })
    
})
let citizen;
app.post("/edit-citizen",(req,res)=>{
    res.render("pages/admin-form")
})
app.post("/delete-citizen",(req,res)=>{
    citizen=req.body.btn
    let sql="delete from citizen where username='"+citizen+"';"
    console.log(sql);
    con.query(sql,(err,result)=>{

    })
    res.redirect("/manage-citizen")
})
app.post("/edit",(req,res)=>{
    let name=req.body.name
    let dob=req.body.dob
    let username=req.body.voter_id
    let age=parseInt(req.body.age)
    let sql="update citizen set name='"+name+"',"+"age="+age+",username='"+username+"',"+"dob='"+dob+"' where username='"+citizen+"';"
    console.log(sql);
    con.query(sql,(err,result)=>{
        res.redirect("/manage-citizen")
    })
})
app.post("/add-candidate",(req,res)=>{
    res.render("pages/admin-ncandidate_form")
})
app.post("/add-ncandidate",(req,res)=>{
    //"select candidate_id,username,c_name,ph_no,DATE_FORMAT(date_of_birth,'%Y-%m-%d') dob from candidate;"
    let c_id=req.body.candidate_id
    let c_name=req.body.name
    let username=req.body.voter_id
    let ph_no=req.body.ph_no
    let dob=req.body.dob
    let e_id=req.body.e_id
    let sql="insert into candidate values('"+c_id+"','"+username+"','"+c_name+"','"+dob+"','"+ph_no+"',"+e_id+");"
    console.log(sql);
    con.query(sql,(err,result)=>{
        res.redirect("/manage-candidate")
    })
})
let candidate_id;
app.post("/edit-candidate",(req,res)=>{
    let candidate_id=req.body.candidate_id
    let name=req.body.name
    let phone=(req.body.ph_no)
    let username=req.body.voter_id
    let dob=req.body.dob
    let sql="update candidate set candidate_id="+candidate_id+","+"c_name='"+name+"',"+
            "ph_no='"+phone+"',"+"username='"+username+"',date_of_birth='"+dob+"' where candidate_id="+candidate_id+";"
    console.log(sql);
    con.query(sql,(err,result)=>{
        res.redirect("/manage-candidate")
    })
})
app.post("/candidate-edit",(req,res)=>{
    candidate_id=req.body.btn
    res.render("pages/admin-candidate_form")
})
app.post("/candidate-delete",(req,res)=>{
    let sql="delete from candidate where candidate_id="+req.body.btn+";"
    con.query(sql,(err,result)=>{
        res.redirect("/manage-candidate")
    })
})
app.get("/admin-form",(req,res)=>{
    res.render("pages/admin-form")
})
app.get("/manage-election",(req,res)=>{
    let sql="select e_id,election_name,DATE_FORMAT(start_date,'%Y-%m-%d') st,DATE_FORMAT(end_date,'%Y-%m-%d') end from election";
    con.query(sql,(err,result)=>{
        res.render("pages/admin-melection",{values:result})
    })
})
app.post("/add-election",(req,res)=>{
    res.render("pages/admin-formelection")
})
app.post("/election-add",(req,res)=>{
    let e_id=parseInt(req.body.e_id)
    let e_name=req.body.e_name
    let start_date=req.body.start_date
    let end_date=req.body.end_date
    let sql="insert into election values("+e_id+",'"+e_name+"','"+start_date+"','"+end_date+"');"
    console.log(sql)
    con.query(sql,(err,result)=>{
        res.redirect("/manage-election")
    })
})
app.post("/delete-election",(req,res)=>{
    let e_id=parseInt(req.body.btn)
    let sql="delete from election where e_id="+e_id+";"
    console.log(sql)
    con.query(sql,(err,result)=>{
        res.redirect("/manage-election")
    })
})
app.get("/citizen-notification",(req,res)=>{
    let sql="select count(*) count,c.c_name as c_name,c.candidate_id as c_id,c.e_id as e_id from candidate c,votes v where c.e_id=v.e_id and c.candidate_id=v.c_id group by c.e_id,c.candidate_id;"
     con.query(sql,(err,result)=>{
        let q="select election_name,e_id from election;"
        con.query(q,(err1,result1)=>{
            let e_ids=[]
            let ans=[]
            let e_names=[]
            result1.forEach((item)=>{
                e_ids.push(item.e_id)
                e_names.push(item.election_name)
            })
            console.log(e_ids)
            for(let i=0;i<e_ids.length;i++){
                let temp;
                let mxi=0
                for(let j=0;j<result.length;j++){
                    //console.log(result[j])
                    if(result[j].e_id==e_ids[i]){
                        if(result[j].count>mxi){
                            temp=result[j].c_name
                            mxi=result[j].count;
                        }
                    }
                }
                ans.push(temp)
                console.log(ans);
            }
            console.log(e_ids)
            res.render("pages/citizen-notification",{e_names:e_names,e_ids:e_ids,values:ans})
        })
    })
})
app.get("/admin-notification",(req,res)=>{
    let sql="select count(*) count,c.c_name as c_name,c.candidate_id as c_id,c.e_id as e_id from candidate c,votes v where c.e_id=v.e_id and c.candidate_id=v.c_id group by c.e_id,c.candidate_id;"
     con.query(sql,(err,result)=>{
        let q="select election_name,e_id from election;"
        con.query(q,(err1,result1)=>{
            let e_ids=[]
            let ans=[]
            let e_names=[]
            result1.forEach((item)=>{
                e_ids.push(item.e_id)
                e_names.push(item.election_name)
            })
            //console.log(result.length)
            for(let i=0;i<e_ids.length;i++){
                let temp;
                let mxi=0
                for(let j=0;j<result.length;j++){
                    //console.log(result[j])
                    if(result[j].e_id==e_ids[i]){
                        if(result[j].count>mxi){
                            temp=result[j].c_name
                            mxi=result[j].count;
                        }
                    }
                }
                ans.push(temp)
                console.log(ans);
            }
            console.log(e_ids)
            res.render("pages/admin-notification",{e_names:e_names,e_ids:e_ids,values:ans})
        })
    })
    // setTimeout(()=>{
        
    //     res.render("pages/admin-mvotes")
    // },300)
//    console.log(values)
   //res.render("pages/admin-notification")
})
app.get("/admin-home",(req,res)=>{
    // res.sendFile(__dirname+"\\admin-home")
    res.render("pages/admin-home")
})
app.post("/admin-login", (req, res) => {
    let user = req.body.user
    let pass = req.body.password
    console.log(user,pass)
    let sql = "select password from admin where admin_id='" + user + "';";
    con.query(sql, (err, result) => {
        console.log(result)
        const password = result[0].password
        if (pass == password) {
            //console.log(__dirname+"/citizen-home.html")
            res.render("pages/admin-home")
        }
        else {
            res.redirect("/")
        }
    })
})
app.post("/citizen-login", (req, res) => {
    const user = req.body.user
    usr=req.body.user
    const pass = req.body.password
    console.log(user,pass)
    let sql = "select password from citizen where username='" + user + "';";
    con.query(sql, (err, result) => {
        console.log(result)
        const password = result[0].password
        if (pass == password) {
            //console.log(__dirname+"/citizen-home.html")
            res.render("pages/citizen-home")
        }
        else {
            res.redirect("/")
        }
    })
})





















app.listen(3000, () => {
    console.log("Server is running!")
})