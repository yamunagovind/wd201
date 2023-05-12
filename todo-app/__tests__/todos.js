const request = require("supertest");

const db = require("../models/index");
const app = require("../app");
let server;
let agent;

describe("Test case for database", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
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

  test("Creates a todo", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parsedResponsess = JSON.parse(response.text);
    expect(parsedResponsess.id).toBeDefined();
  });

  test("Mark todo as a completed", async () => {
    const res = await agent.post("/todos").send({
      title: "Do HomeWork",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parseResponse = JSON.parse(res.text);
    const todoID = parseResponse.id;
    expect(parseResponse.completed).toBe(false);

    const changeTodo = await agent
      .put(`/todos/${todoID}/markAsCompleted`)
      .send();
    const parseUpadteTodo = JSON.parse(changeTodo.text);
    expect(parseUpadteTodo.completed).toBe(true);
  });

  test("Fetches all todos", async () => {
    await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    await agent.post("/todos").send({
      title: "Buy a car",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const response = await agent.get("/todos");
    const parsedResponsess = JSON.parse(response.text);

    expect(parsedResponsess.length).toBe(4);
    expect(parsedResponsess[3]["title"]).toBe("Buy ps3");
  });

  test("Deletes a todo with the given ID", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy box",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponsess = JSON.parse(response.text);
    const todoID = parsedResponsess.id;

    const res = await agent.delete(`/todos/${todoID}`).send();
    const bool = Boolean(res.text);
    expect(bool).toBe(true);
  });
});
