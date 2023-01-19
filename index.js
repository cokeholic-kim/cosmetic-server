//express 서버 만들기
const express = require("express");//import express
const cors = require("cors");

//mysql부르기
const mysql = require("mysql");

//서버 생성 --> express( )호출
const app = express();
//프로세서의 주소 포트번호 지정
const port = 8080;
// JSON형식의 데이터를 처리할수 있도록 설정
app.use(express.json());
// 브라우저의 CORS 이슈를 막기 위해 사용하는 코드
app.use(cors());

//sql 연결선 만들기
const conn = mysql.createConnection({
    host:"localhost",
    port:'3306',
    user:"root",
    password:"1234",
    database:"shopping"
})
//sql 연결하기 
conn.connect();



// get요청시 응답 app.get(경로,콜백함수)
app.get('/products',(req,res)=>{
    conn.query('select * from products',function(error,result,fields){
        res.send(result);
        console.log(result);
    });
})

app.get("/products/:id",(req,res)=>{
    const params = req.params;
    const {id} = params;
    res.send(`id는${id}이다`)
})

//서버구동
app.listen(port,()=>{
    console.log("서버가 돌아가고있습니다.")
})