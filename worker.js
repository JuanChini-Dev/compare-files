//PROJECT IMPLEMENTATION OF WORKERS THREADS

import { parentPort } from "worker_threads";
const fs = require("fs");

parentPort.on("message", (message) => {
  const { filePath, searchTerm } = message;
  const readStream = fs.createReadStream(filePath, "utf8");

  let buffer = "";
  let lineNumber = 0;
  let matches = [];

  readStream.on("data", (chunk) => {
    buffer += chunk;

    while (buffer.includes("\n")) {
      const index = buffer.indexOf("\n");
      const line = buffer.slice(0, index);
      buffer = buffer.slice(index + 1);

      if (line.includes(searchTerm)) {
        matches.push(`Line ${lineNumber}: ${line}`);
      }
      lineNumber++;
    }
  });

  readStream.on("end", () => {
    parentPort.postMessage(matches);
  });
});
