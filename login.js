"use strict";

const Stage = require("telegraf/stage");
const WizardScene = require("telegraf/scenes/wizard");

const scene = new WizardScene(
  "login",
  ctx => {
    ctx.reply("Этап 1: выбор типа матча.");
    return ctx.wizard.next(); // Переходим к следующему обработчику.
  },
  ctx => {
    ctx.reply("Этап 2: выбор времени проведения матча.");
    return ctx.wizard.next(); // Переходим к следующему обработчику.
  },
  ctx => {
    if (ctx.message.text === "Назад") {
      ctx.wizard.back(); // Вернуться к предыдущиму обработчику
    }
    ctx.reply("Этап 3: выбор места проведения матча.");
    return ctx.wizard.next(); // Переходим к следующему обработчику.
  },
  ctx => {
    ctx.reply("Финальный этап: создание матча.");
    return ctx.scene.leave();
  }
);

const stage = new Stage();
stage.register(scene);

module.exports = stage.middleware;
