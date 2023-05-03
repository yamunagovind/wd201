const todoList = () => {
  all = [];

  const add = (todoItem) => {
    all.push(todoItem);
  };

  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const compareDate = (date) =>
    new Date(date) - new Date(formattedDate(new Date()));

  const overdue = () =>
    all.filter((todo) => compareDate(todo.dueDate) < 0 && !todo.completed);

  const dueToday = () => all.filter((todo) => compareDate(todo.dueDate) === 0);

  const dueLater = () => all.filter((todo) => compareDate(todo.dueDate) > 0);

  const toDisplayableList = (list) =>
    list
      .map((todo) => {
        const checkbox = todo.completed ? "[x]" : "[ ]";
        const displayDate = compareDate(todo.dueDate) === 0 ? "" : todo.dueDate;
        return `${checkbox} ${todo.title} ${displayDate}`;
      })
      .join("\n");

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

const todos = todoList();

const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};

var dateToday = new Date();
const today = formattedDate(dateToday);
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1))
);
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1))
);

todos.add({ title: 'Submit assignment', dueDate: yesterday, completed: false })
todos.add({ title: 'Pay rent', dueDate: today, completed: true })
todos.add({ title: 'Service Vehicle', dueDate: today, completed: false })
todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false })
todos.add({ title: 'Pay electric bill', dueDate: tomorrow, completed: false })

console.log("My Todo-list\n");

console.log("Overdue");
var overdues = todos.overdue();
var Overdues = todos.toDisplayableList(overdues);
console.log(Overdues);
console.log("\n");

console.log("Due Today");
let itemsDueToday = todos.dueToday();
let ItemsDueToday = todos.toDisplayableList(itemsDueToday);
console.log(ItemsDueToday);
console.log("\n");

console.log("Due Later");
let itemsDueLater = todos.dueLater();
let formattedItemsDueLaters = todos.toDisplayableList(itemsDueLater);
console.log(formattedItemsDueLaters);
console.log("\n");
