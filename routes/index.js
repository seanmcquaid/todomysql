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

function formatDate(date) {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

router.get("/edit/:id", (req, res, next)=>{
  // this route should be a pre populated form with the element with this ID values
  // res.json(req.params.id);
  const selectQuery = `SELECT * FROM tasks
  WHERE id = ?;`;
  // results = data from SQL query
  connection.query(selectQuery,[req.params.id], (error, results)=>{
    let formattedDate = formatDate(results[0].taskDate)
    results[0].taskDate = formattedDate;
    res.render("edit", {
      task: results[0]
    });
  });
});


router.post("/editItem", (req,res)=>{
  const updateQuery = ` UPDATE tasks SET
  taskName = ?,
  taskDate = ?;`;
  connection.query(updateQuery,[req.body.newTask, req.body.newTaskDate, req.body.taskId], (error, results)=>{
    if(error){
      throw error;
    } else{
      res.redirect("/");
    };
  });
});

module.exports = router;