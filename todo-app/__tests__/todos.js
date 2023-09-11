const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

const extractCSRFToken = (html) => {
  const $ = cheerio.load(html);
  return $("[name=_csrf]").val();
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(5000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Create new todos", async () => {
    const { text } = await agent.get("/");
    const csrfToken = extractCSRFToken(text);

    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo complete ID", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCSRFToken(res.text);
    await agent.post("/todos").send({
      title: "going school",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const groupTodos = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedResponseses = JSON.parse(groupTodos.text);
    const lastItem = parsedResponseses[parsedResponseses.length - 1];

    res = await agent.get("/");
    csrfToken = extractCSRFToken(res.text);

    const markComplete = await agent.put(`/todos/${lastItem.id}`).send({
      _csrf: csrfToken,
      completed: true,
    });

    const parsedUpdateResponse = JSON.parse(markComplete.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Deletes a todo with ID", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCSRFToken(res.text);

    await agent.post("/todos").send({
      title: "Complete",
      dueDate: new Date().toISOString(),
      _csrf: csrfToken,
    });

    const getresponses = await agent.get("/todos");
    const parsedResponseses = JSON.parse(getresponses.text);
    const todoID = parsedResponseses[parsedResponseses.length - 1].id;

    res = await agent.get("/");
    csrfToken = extractCSRFToken(res.text);

    const delTodo_items = await agent.delete(`/todos/${todoID}`).send({
      _csrf: csrfToken,
    });
    expect(delTodo_items.statusCode).toBe(200);
  });
});
