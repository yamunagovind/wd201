/* eslint-disable no-undef */
const db = require("../models");

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};

describe("Test list of items", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Add overdue item", async () => {
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(-2),
      completed: false,
    });
    const items = await db.Todo.overdue();
    expect(items.length).toBe(1);
  });

  test("Add due today item", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(0),
      completed: false,
    });
    const items = await db.Todo.dueToday();
    expect(items.length).toBe(dueTodayItems.length + 1);
  });

  test("Add due later item", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(2),
      completed: false,
    });
    const items = await db.Todo.dueLater();
    expect(items.length).toBe(dueLaterItems.length + 1);
  });

  test("Mark as complete", async () => {
    const overdueItems = await db.Todo.overdue();
    const allTodo = overdueItems[0];
    expect(allTodo.completed).toBe(false);
    await db.Todo.markAsComplete(allTodo.id);
    await allTodo.reload();

    expect(allTodo.completed).toBe(true);
  });

  test("Test completed", async () => {
    const overdueItems = await db.Todo.overdue();
    const allTodo = overdueItems[0];
    expect(allTodo.completed).toBe(true);
    const displayitems = allTodo.displayableString();
    expect(displayitems).toBe(
      `${allTodo.id}. [x] ${allTodo.title} ${allTodo.dueDate}`
    );
  });

  test("Test incomplete", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const allTodo = dueLaterItems[0];
    expect(allTodo.completed).toBe(false);
    const displayitems = allTodo.displayableString();
    expect(displayitems).toBe(
      `${allTodo.id}. [ ] ${allTodo.title} ${allTodo.dueDate}`
    );
  });

  test("Test incomplete dueToday", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const allTodo = dueTodayItems[0];
    expect(allTodo.completed).toBe(false);
    const displayitems = allTodo.displayableString();
    expect(displayitems).toBe(`${allTodo.id}. [ ] ${allTodo.title}`);
  });

  test("Test completed dueToday", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const allTodo = dueTodayItems[0];
    expect(allTodo.completed).toBe(false);
    await db.Todo.markAsComplete(allTodo.id);
    await allTodo.reload();
    const displayitems = allTodo.displayableString();
    expect(displayitems).toBe(`${allTodo.id}. [x] ${allTodo.title}`);
  });
});
