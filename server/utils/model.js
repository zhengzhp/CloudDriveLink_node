'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const EventEmitter = require('events');
const awaitEvent = require('await-event');
const globby = require('globby');

module.exports = app => {
  const config = app.config.mongoose;
  assert(config.url, '[man-mongoose] url is required on config');
  app.logger.info('[man-mongoose] connecting %s', config.url);

  mongoose.Promise = global.Promise;

  // mongoose.connect('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]' [, options]);
  const db = mongoose.createConnection(config.url, config.options);
  db.Schema = mongoose.Schema;
  app.model = {};
  app.mongoose = db;
  app.__mongoose = mongoose;

  const heartEvent = new EventEmitter();
  heartEvent.await = awaitEvent;

  db.on('error', err => {
    err.message = `[man-mongoose]${err.message}`;
    app.logger.error(err);
  });

  db.on('disconnected', () => {
    app.logger.error(`[man-mongoose] ${config.url} disconnected`);
  });

  db.on('connected', () => {
    heartEvent.emit('connected');
    app.logger.info(`[man-mongoose] ${config.url} connected successfully`);
  });

  db.on('reconnected', () => {
    app.logger.info(`[man-mongoose] ${config.url} reconnected successfully`);
  });

  loadModel(app);

  app.beforeStart(async function () {
    app.logger.info('[man-mongoose] starting...');
    await heartEvent.await('connected');

    app.logger.info('[man-mongoose] start successfully and server status is ok');
  });
};

function loadModel(app) {
  const dir = path.join(app.baseDir, '../server/model');
  const filepaths = globby.sync('*.js', { cwd: dir });
  for (const filepath of filepaths) {
    const fullpath = path.join(dir, filepath);
    if (!fs.statSync(fullpath).isFile()) continue;
    const property = defaultCamelize(filepath);
    app.model[property] = require(fullpath)(app);
  }
}

// convert file path to an property name
// abc_def.js => abcDef
function defaultCamelize(filepath, caseStyle) {
  let property = filepath.substring(0, filepath.lastIndexOf('.'));
  if (!/^[a-z][a-z0-9_-]*$/i.test(property)) {
    throw new Error(`${property} is not match 'a-z0-9_-' in ${filepath}`);
  }
  // use default camelize, will capitalize the first letter
  // foo_bar.js > FooBar
  // fooBar.js  > FooBar
  // FooBar.js  > FooBar
  // FooBar.js  > FooBar
  // FooBar.js  > fooBar (if lowercaseFirst is true)
  property = property.replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());
  let first = property[0];
  switch (caseStyle) {
    case 'lower':
      first = first.toLowerCase();
      break;
    case 'upper':
      first = first.toUpperCase();
      break;
    case 'camel':
    default:
  }
  return first + property.substring(1);
}
