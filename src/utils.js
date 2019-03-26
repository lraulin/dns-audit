const fs = require("fs");
const write = (obj, file) => {
  // Save input to file as json if object or text if string.
  const text = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  const stream = fs.createWriteStream(file, { flags: "w" });
  stream.write(text);
  stream.end();
};

module.exports = { write };
