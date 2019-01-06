"use strict";

const moment = require("moment");
const Stage = require("telegraf/stage");
const WizardScene = require("telegraf/scenes/wizard");
const Markup = require("telegraf/markup");

const scene = new WizardScene(
  "todo",
  async ctx => {
    console.log("start step 1");

    ctx.reply("Что запланировать?");
    return ctx.wizard.next();
  },
  async ctx => {
    console.log("start step 2");
    ctx.scene.state.todo = ctx.message.text;
    ctx.reply("Во сколько?");
    return ctx.wizard.next();
  },
  async ctx => {
    console.log("start step 3");
    
    let datetime = moment(ctx.message.text, "DD.MM.YYYY");
    if (!datetime.isValid()) {
      return ctx.replyWithMarkdown("Введите дату-время в формате `ДД.ММ.ГГГГ`");
      // await ctx.wizard.back();
      // return ctx.wizard.back("Введите дату-время в формате `ДД.ММ.ГГГГ`");
    }
    ctx.scene.state.datetime = datetime.toDate();
    return ctx.scene.leave();
  }
);

scene.leave(ctx => {
  console.log("state", ctx.scene.state);
  return ctx.reply("Готово");
});

scene.command("cancel", ctx => {
  ctx.scene.state.cancelled = true;
  return ctx.scene.leave("cancelled");
});

// scene.use(async (ctx, next) => {
//   console.log("scene message middleware");
//   const start = new Date();
//   await next(ctx);
//   const ms = new Date() - start;
//   console.log("Response time %sms", ms);
// });

// scene.on("message", async (ctx, next) => {
//   console.log("scene message", ctx.message);
//   return next(ctx);
// });

const stage = new Stage([scene], { ttl: 1000 });

module.exports = stage;
