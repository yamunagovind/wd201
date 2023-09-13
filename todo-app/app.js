const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const { Model, Op } = require("sequelize");
var csurf = require("tiny-csrf");
var cookieParser = require("cookie-parser");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csurf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const overdueTodoItems = await Todo.overdueTodo();
  const duetodayTodoItems = await Todo.duetodayTodo();
  const duelaterTodoItems = await Todo.duelaterTodo();
  const completedTodoItems = await Todo.markAsCompletedItems();

  if (request.accepts("html")) {
    response.render("index", {
      title: "Todo application",
      overdueTodoItems,
      duelaterTodoItems,
      duetodayTodoItems,
      completedTodoItems,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({ overdueTodoItems, duetodayTodoItems, duelaterTodoItems });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");

  try {
    const todo = await Todo.getTodo();
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("we have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedtodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedtodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);

  try {
    await Todo.remove(request.params.id);
    return response.json(true);
  } catch (error) {
    return response.status(422).json(error);
  }
  const todo = await Todo.findByPk(request.params.id);
  try {
    const deleteTodo = await todo.deleteTodo({ todo: request.params.id });
    return response.send(true);
  } catch (error) {
    console.log(error);
    return response.send(false);
  }
});

module.exports = app;
