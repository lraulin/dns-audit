"use strict";
/**
 * Grab-bag of helper functions.
 */

const fs = require("fs");

const write = (obj, file) => {
  // Save input to file as json if object or text if string.
  const text = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  const stream = fs.createWriteStream(file, { flags: "w" });
  stream.write(text);
  stream.end();
};

const readFile = (path, opts = "utf8") =>
  new Promise((resolve, reject) => {
    fs.readFile(path, opts, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

const writeFile = (path, data, opts = "utf8") =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, opts, err => {
      if (err) reject(err);
      else resolve();
    });
  });

module.exports = { write, writeFile };
