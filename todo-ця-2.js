const moment = require("moment");

// const Extra = require("telegraf/extra");
// const Markup = require("telegraf/markup");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");

const PREFIX = "todo";
const todoName = `${PREFIX}_name`;
const todoDatetime = `${PREFIX}_datetime`;

const nameScene = new Scene(todoName);
nameScene.enter(ctx => {
  ctx.reply("Что запланировать?");
});
nameScene.action("cancell", ctx => {});

nameScene.on("message", ctx => {
  if (!ctx.message.text) {
    return ctx.reply("Неверный формат");
  }
  ctx.scene.state.todo = ctx.message.text;
  return ctx.scene.enter(todoDatetime, ctx.scene.state);
});

const datetimeScene = new Scene(todoDatetime);

datetimeScene.enter(ctx => ctx.reply("Во сколько?"));

datetimeScene.on("message", ctx => {
  let datetime = moment(ctx.message.text, "DD.MM.YYYY");
  if (!datetime.isValid()) {
    return ctx.replyWithMarkdown("Введите дату-время в формате `ДД.ММ.ГГГГ`");
  }
  ctx.scene.state.datetime = datetime.toDate();
  return ctx.scene.leave();
});

datetimeScene.leave(ctx => {
  console.log(ctx.scene.state);
  const { canceled, todo, datetime } = ctx.scene.state;
  if (canceled) {
    return;
  }
  return ctx.replyWithMarkdown(`${todo} ${datetime}`);
});

const stage = new Stage([nameScene, datetimeScene]);

stage.command("cancel", ctx => {
  ctx.scene.state.canceled = true;
  return ctx.scene.leave();
});

stage.name = todoName;

module.exports = stage;
