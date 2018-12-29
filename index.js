"use strict";

const Telegraf = require("telegraf");
const commandParts = require("telegraf-command-parts");
const session = require("telegraf/session");

const todoStage = require("./todo");

const { BOT_TOKEN } = process.env;
const bot = new Telegraf(BOT_TOKEN);

bot.use(session());
bot.use(commandParts());
bot.use(todoStage.stage.middleware());

///

bot.start(ctx => {
  console.log("Id пользователя:", ctx.from.id);
  return ctx.reply("Добро пожаловать!");
});

Object.keys(todoStage.commands).forEach(command => {
  bot.command(command, todoStage.commands[command]);
});

bot.catch(err => {
  console.log("Ooops", err);
});

bot.use(async (ctx, next) => {
  const start = new Date();
  await next(ctx);
  const ms = new Date() - start;
  console.log("Response time %sms", ms);
});

bot.on("message", async (ctx, next) => {
  console.log(ctx.message);
  return next(ctx);
});

bot.command("done");

bot.startPolling();
