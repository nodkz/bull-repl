#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = __importDefault(require("bull"));
const chalk_1 = __importDefault(require("chalk"));
const vorpal_1 = __importDefault(require("vorpal"));
const util_1 = require("util");
const vorpal = new vorpal_1.default();
let queue;
const deepLog = (arr) => {
    console.log(util_1.inspect(arr, { colors: true }));
};
vorpal.command('connect <queue> [url]', 'connect to bull queue')
    .action(async ({ queue: name, url = 'redis://localhost:6379' }) => {
        queue && queue.close();
        queue = bull_1.default(name, url);
        await queue.isReady();
        console.log(chalk_1.default.green(`Connected to ${url}, queue: ${name}`));
        vorpal.delimiter(`bull-repl@${name}$`).show();
    });
vorpal.command('stats', 'count of jobs by groups')
    .action(async () => {
        if (!queue) {
            return console.log(chalk_1.default.red('Need connect before'));
        }
        await queue.isReady();
        console.table(await queue.getJobCounts());
    });
vorpal.command('active', 'fetch active jobs')
    .action(async () => {
        if (!queue) {
            return console.log(chalk_1.default.red('Need connect before'));
        }
        await queue.isReady();
        deepLog(await queue.getActive());
    });
vorpal.command('waiting', 'fetch waiting jobs')
    .action(async () => {
        if (!queue) {
            return console.log(chalk_1.default.red('Need connect before'));
        }
        await queue.isReady();
        deepLog(await queue.getWaiting());
    });
vorpal.command('completed', 'fetch completed jobs')
    .action(async () => {
        if (!queue) {
            return console.log(chalk_1.default.red('Need connect before'));
        }
        await queue.isReady();
        deepLog(await queue.getCompleted());
    });
vorpal.command('failed', 'fetch failed jobs')
    .action(async () => {
        if (!queue) {
            return console.log(chalk_1.default.red('Need connect before'));
        }
        await queue.isReady();
        deepLog(await queue.getFailed());
    });
vorpal.command('delayed', 'fetch delayed jobs')
    .action(async () => {
        if (!queue) {
            return console.log(chalk_1.default.red('Need connect before'));
        }
        await queue.isReady();
        deepLog(await queue.getDelayed());
    });
vorpal.command('add <data>', 'add job to queue')
    .action(async ({ data }) => {
        if (!queue) {
            return console.log(chalk_1.default.red('Need connect before'));
        }
        await queue.isReady();
        queue.add(JSON.parse(data));
    });
vorpal.command('rm <jobId>', 'remove job by id')
    .action(async ({ jobId }) => {
        if (!queue) {
            return console.log(chalk_1.default.red('Need connect before'));
        }
        await queue.isReady();
        const job = await queue.getJob(jobId);
        if (!job) {
            return console.log(chalk_1.default.yellow(`Job "${jobId}" not found`));
        }
        await job.remove();
        console.log(chalk_1.default.green(`Job "${jobId}" removed`));
    });
vorpal.command('retry <jobId>', 'retry job by id')
    .action(async ({ jobId }) => {
        if (!queue) {
            return console.log(chalk_1.default.red('Need connect before'));
        }
        await queue.isReady();
        const job = await queue.getJob(jobId);
        if (!job) {
            return console.log(chalk_1.default.yellow(`Job "${jobId}" not found`));
        }
        await job.retry();
        console.log(chalk_1.default.green(`Job "${jobId}" retried`));
    });
vorpal.delimiter('bull-repl$').show();
//# sourceMappingURL=index.js.map