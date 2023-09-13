"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `Models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static getTodo() {
      return this.findAll();
    }

    static overdueTodo() {
      return this.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static duetodayTodo() {
      return this.findAll({
        where: {
          dueDate: { [Op.eq]: new Date() },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static markAsCompletedItems() {
      return this.findAll({
        where: {
          completed: true,
        },
        order: [["id", "ASC"]],
      });
    }

    static duelaterTodo() {
      return this.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() },
          completed: false,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    deleteTodo({ todo }) {
      return this.destroy({
        where: {
          id: todo,
        },
      });
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }

    markAsCompleted() {
      return this.update({ completed: true });
    }

    setCompletionStatus(boolean) {
      return this.update({ completed: boolean });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
