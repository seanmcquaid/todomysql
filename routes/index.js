var express = require('express');
var router = express.Router();

var mysql = require('mysql');
const config = require("../config");
var connection = mysql.createConnection(config);
connection.connect();

console.log("I'm connected");

/* GET home page. */
router.get('/', function(req, res, next) {
  // get sends information via query string
  const selectQuery = "SELECT * FROM tasks";
  connection.query(selectQuery,(error,results)=>{
    res.render("index", {taskArray: results});
  });
});

router.post("/addItem", (req,res, next)=>{
  // post sends information via body
  const newTask = req.body.newTask;
  const newTaskDate =req.body.newTaskDate;
  // we know what the user submitted in the form
  // it comes to this route inside req.body.NAMEOFFIELD
  // we store all of those values into a var
  // now we take those vars and insert them into mySQL.

  // THIS IS BAD!!!!!
  const badInsertQuery = `INSERT INTO tasks (taskName, taskDate)
  VALUES
  ('${newTask}', ${newTaskDate});
  `;
  // SQL injections
  // Is when a user inserts a SQL statement into a form to run SQL when you dev didn't intend

  const insertQuery = `INSERT into tasks(taskName, taskDate)
  VALUES
  (?,?);`;

  console.log(insertQuery);

  connection.query(insertQuery,[newTask, newTaskDate], (error, results)=>{
    if(error){
      // query failed, STOP
      throw error;
    } else {
      // QUERY WORKED! forward user to home page
      res.redirect("/");
    }
  });

  // res.json(req.body);
});

// a wilcard route in express has a : in front of it 
router.get("/delete/:id", (req, res, next)=>{
  // wildcard routes are available in req.params
  // res.json(req.params);
  const deleteQuery = `DELETE FROM tasks WHERE id = ?;`;
  connection.query(deleteQuery, [req.params.id], (error)=>{
    res.redirect("/");
  });
});

module.exports = router;