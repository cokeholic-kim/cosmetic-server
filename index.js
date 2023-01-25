//express 서버 만들기
const express = require("express");//import express
const cors = require("cors");

//mysql부르기
const mysql = require("mysql");

//서버 생성 --> express( )호출
const app = express();
//프로세서의 주소 포트번호 지정
const port = 8080;

const multer = require("multer");
    // const storage = multer.memoryStorage(); // 스토리지변수
    // const upload = multer({storage:storage});
//서버의 upload를 클라이언트 접근 가능하도록 설정
app.use("/upload",express.static("upload")); //서버의 upload라는 폴더에 이미지가 담기게되고 클라이언트가 업로드 폴더의 파일에 접근 가능하도록 설정

// JSON형식의 데이터를 처리할수 있도록 설정
app.use(express.json());
// 브라우저의 CORS 이슈를 막기 위해 사용하는 코드
app.use(cors());

//파일요청시 파일이저장될경로와 파일이름지정
// storage = multer.diskStorage({
//     destination:"./upload/",
//     filename: function(req,file,cb){
//        let num = file.originalname.lastIndexOf(".");//<-product1.png / 8
//        let re = file.originalname.substring(num); // .png
//        let imgname = String(Date.now())+re; // 오늘날짜.png
//        cb(null,`${imgname}`)
//     }
// })                   

//diskstorage()--> 파일을 저장할때에 모든 제어 기능을 제공
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'upload/');
    },
    filename:(req,file,cb)=>{
        const newFilename = file.originalname;
        cb(null,newFilename);
    }
})
const upload = multer({ storage : storage }); // {dest:storage} => {storage:storage}
app.post('/upload',upload.single('file'),async (req,res)=>{
    res.send({
        imageURL:req.file.filename
    })
});


//업로드 객체
// upload = multer({
//     storage:storage,
//     limits:{fieldsize:1000000}
// })
// upload경로로 포스트 요청이 왔을때 응답
// app.post("/upload",upload.single("img"),function(req,res,next){
//     res.send({
//         imageUrl:req.file.filename
//     })
// })

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

//삭제요청시 처리하기
app.delete('/delProduct/:id',async (req,res)=>{
    const {id} = req.params;
    conn.query(`delete from products where p_id = ${id}`,(err,result,feild)=>{
        res.send("ok");
    })
})



// get요청시 응답 app.get(경로,콜백함수)
app.get('/products',(req,res)=>{
    conn.query('select * from products',function(error,result,fields){
        res.send(result);
    });
})

app.get("/products/:id",(req,res)=>{
    const params = req.params;
    const {id} = params;
    conn.query(`select * from products where p_id=${id}`,function(error,result,fields){
        res.send(result); //url에 들어간 번호파라미터로 mysql레코드
    });
})

//addProduct post요청이 오면 처리
//req =>요청하는 객체 res =>응답하는객체
app.post("/addProduct",async (req,res)=>{ //req 가 가고 res 가 바로오는게 아니기때문에 async 붙여줘야함
    const {p_name,p_price,p_desc,p_img,p_quantity} = req.body;
    conn.query("insert into products (p_name,p_price,p_desc,p_img,p_quantity) values(?,?,?,?,?)",
    [p_name,p_price,p_desc,p_img,p_quantity],
    (error,result,fields)=>{
        res.send("ok");
    })
})

//서버구동
app.listen(port,()=>{
    console.log("서버가 돌아가고있습니다.")
})