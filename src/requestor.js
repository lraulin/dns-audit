"use strict";
// Crockford, Douglas. How JavaScript Works (Kindle Locations 3282-3285). Virgule-Solidus. Kindle Edition.
//TODO: Probably won't use this. Delete at some point.

const fs = require("fs");

function requestorize(unary) {
  return function requestor(callback, value) {
    try {
      return callback(unary(value));
    } catch (exception) {
      return callback(undefined, exception);
    }
  };
}

function read_file(directory, encoding = "utf-8") {
  return function read_file_requestor(callback, value) {
    return fs.readFile(directory + value, encoding, function(err, data) {
      return err ? callback(undefined, err) : callback(data);
    });
  };
}

const readInWorkingDir = read_file("./");
const showData = data => console.log(data);
readInWorkingDir(showData, "test.txt");
