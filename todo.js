const moment = require("moment");

const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");

const PREFIX = "todo";
const sceneName = `${PREFIX}_scene`;
let todoList = [];

const addTodos = new Scene(sceneName);

addTodos.enter(ctx => ctx.reply("Введите список дел"));

addTodos.on("message", ctx => {
  if (!ctx.message.text) {
    return ctx.reply("Только текст");
  }
  ctx.scene.state.todo = ctx.message.text;

  return ctx.scene.leave();
});

addTodos.leave(ctx => {
  const { canceled, todo } = ctx.scene.state;

  if (canceled) {
    return;
  }

  const items = todo.split("\n");
  todoList = todoList.concat(items);
  const reply = todoList.map((item, idx) => `${idx}. ${item}`).join("\n");

  ctx.reply(reply);
});

const stage = new Stage([addTodos]);

stage.command("cancel", ctx => {
  ctx.scene.state.canceled = true;
  return ctx.scene.leave();
});

const commands = {
  todo: ctx => ctx.scene.enter(sceneName),
  "done": ctx => {
    console.log(JSON.stringify(ctx.state.command, null, 2));
  }
};

// stage.name = sceneName;

module.exports = {
  stage,
  commands
};
