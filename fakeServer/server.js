require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(cors());
app.use(express.json());


app.get("/teacherdashboard/helprequests", (req, res) => {
  console.log("Received a GET request to help requests");
  pool.query(
    `SELECT HelpRequest.*,Student.studentname,Student.ProfilePic
    FROM HelpRequest left Join Student
    on HelpRequest.StudentID = Student.StudentID;`,
    (error, result) => {
      if (error) {
        console.log("Error", error);
        res.send("You' got an error ! " + error.code);
      } else {
        console.log(result);
        res.send(result);
      }
    }
  );
});

app.get("/teacherdashboard/studentprofiles", (req, res) => {
  console.log("Received a GET request to /");
  pool.query(
    `SELECT StudentName, ProfilePic FROM Student LIMIT 15;`,
    (error, result) => {
      if (error) {
        console.log("Error", error);
        res.send("You' got an error ! " + error.code);
      } else {
        console.log(result);
        res.send(result);
      }
    }
  );
});


app
  .listen(PORT, () => {
    console.log(`Server is alive on http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.log(`PORT ${PORT} is already in use`);
    } else {
      console.log(`Server Error`, error);
    }
  });
