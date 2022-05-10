const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "http://localhost:5000",
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 5000;

const fs = require("fs");
const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);

const config = {
  server: conf.host,
  port: conf.port,
  database: conf.database,
  user: conf.user,
  password: conf.password,
  encrypt: false,
};

console.log(config);

const sql = require("mssql");
//const multer = require("multer");
//const upload = multer({ dest: "./upload" });

sql.connect(config, function (err) {
  if (err) {
    return console.error("error : ", err);
  }
  console.log("MSSQL 연결 완료");
});

app.get("/api/projects", (req, res) => {
  var request = new sql.Request();
  q = "SELECT * FROM TB_FMT_PROJECT WHERE 1 = 1";
  request.query(q, (err, rows, fields) => {
    res.send(rows.recordset);
  });
});

app.get("/api/projects/info/:id", (req, res) => {
  var request = new sql.Request();
  q = `SELECT 
      B.CD_PROJ, 
      B.NM_PROJ, 
      A.ADRS, 
      A.RGNL, 
      A.DSTR, 
      A.AREA_SITE 
  FROM 
      TB_FMT_PROJECT_SITES A left join TB_FMT_PROJECT B on A.ID_PROJ = B.ID 
  WHERE B.ID = ${req.params.id}`;
  console.log(q);
  request.query(q, (err, rows, fields) => {
    res.send(rows.recordset);
  });
});

const colsGrid3 = [
  { field: "col1", headerName: "프로젝트", width: 80 },
  { field: "col2", headerName: "건축면적", width: 80 },
  { field: "col3", headerName: "건폐율", width: 80 },
  { field: "col4", headerName: "연면적", width: 80 },
  { field: "col5", headerName: "지상연면적", width: 80 },
  { field: "col6", headerName: "주거연면적", width: 80 },
  { field: "col7", headerName: "용적률", width: 80 },
  { field: "col8", headerName: "주거용적률", width: 80 },
  { field: "col9", headerName: "지하주차대수", width: 80 },
  { field: "col10", headerName: "지상주차대수", width: 80 },
];

app.get("/api/projects/plan", (req, res) => {
  var request = new sql.Request();
  q = `SELECT 
      B.NM_PROJ,
      A.AREA_DNT, 
      A.AREA_BLD, 
      A.RATE_BLDCV, 
      A.AREA_TTA, 
      A.AREA_ALL_GRND, 
      A.AREA_HUS_GRND, 
      A.RATE_ALL_GRND, 
      A.RATE_HUS_GRND, 
      A.SCL_BLD, 
      A.USG_BLD, 
      A.STRCT_BLD, 
      A.NMBR_UNDG_PRKN, 
      A.NMBR_GRND_PRKN, 
      A.AREA_LNDS
  FROM
      TB_FMT_PROJECT_PLANS A left join TB_FMT_PROJECT B on A.ID_PROJ = B.ID 
  `;
  console.log(q);
  request.query(q, (err, rows, fields) => {
    res.send(rows.recordset);
  });
});

app.get("/api/layer", (req, res) => {
  var request = new sql.Request();
  q = "SELECT A.ID, A.NM_BUIS, A.NM_FCLTY, A.NM_LAYR FROM TB_FMT_LAYER A";
  request.query(q, (err, rows, fields) => {
    res.send(rows.recordset);
  });
});

app.post("/api/projects/planSave", (req, res) => {
  var request = new sql.Request();
  const ID_PROJ = req.body.ID_PROJ;
  const AREA_BLD = req.body.AREA_BLD;
  const RATE_BLDCV = req.body.RATE_BLDCV;
  const AREA_TTA = req.body.AREA_TTA;
  const AREA_ALL_GRND = req.body.AREA_ALL_GRND;
  const AREA_HUS_GRND = req.body.AREA_HUS_GRND;
  const RATE_ALL_GRND = req.body.RATE_ALL_GRND;
  const RATE_HUS_GRND = req.body.RATE_HUS_GRND;

  q = 
  `INSERT INTO 
  TB_FMT_PROJECT_PLANS
  (
    ID_PROJ, 
    AREA_BLD, 
    RATE_BLDCV, 
    AREA_TTA, 
    AREA_ALL_GRND, 
    AREA_HUS_GRND, 
    RATE_ALL_GRND,
    RATE_HUS_GRND, 
    DT_CREATE)
  VALUES(
    ${ID_PROJ}, 
    ${AREA_BLD}, 
    ${RATE_BLDCV}, 
    ${AREA_TTA}, 
    ${AREA_ALL_GRND},  
    ${AREA_HUS_GRND}, 
    ${RATE_ALL_GRND}, 
    ${RATE_HUS_GRND}, 
    GETDATE());`;
  console.log(q);
  request.query(q, (err, rows, fields) => {
    res.send(rows);
  });
});

//app.use("/image", express.static("./upload"));

// app.post("/api/customers", upload.single("image"), (req, res) => {
//   console.log(req.file);
//   let image = "/image/" + req.file.filename;
//   let name = req.body.name;
//   let birthday = req.body.birthday;
//   let gender = req.body.gender;
//   let job = req.body.job;
//   //let params = [image, name, birthday, gender, job];

//   // sql.input('image', sql.VarChar, image);
//   // sql.input('name', sql.VarChar, name);
//   // sql.input('birthday', sql.VarChar, birthday);
//   // sql.input('gender', sql.VarChar, gender);
//   // sql.input('job', sql.VarChar, job);

//   var request = new sql.Request();
//   q = `INSERT INTO CUSTOMER VALUES ('${image}', '${name}', '${birthday}', '${gender}', '${job}', GETDATE(), 0)`;
//   request.query(q, (err, rows, fields) => {
//     res.send(rows.recordset);
//   });
// });

// app.post("/api/customers/:id", upload.single("image"), (req, res) => {
//   let image = "/image/" + req.file.filename;
//   let name = req.body.name;
//   let birthday = req.body.birthday;
//   let gender = req.body.gender;
//   let job = req.body.job;

//   var request = new sql.Request();
//   q = `UPDATE CUSTOMER SET [image] = '${image}', NAME = '${name}', birthday = '${birthday}', gender = '${gender}', job = '${job}' WHERE id = ${req.params.id}`;
//   request.query(q, (err, rows, fields) => {
//     res.send(rows.recordset);
//   });
// });

// app.delete("/api/customers/delete/:id", (req, res) => {
//   var request = new sql.Request();
//   //console.log(req.params.id);
//   q = `UPDATE CUSTOMER SET isDeleted = 1 WHERE id = ${req.params.id}`;
//   //console.log(q);
//   request.query(q, (err, rows, fields) => {
//     res.send(rows.recordset);
//   });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
