import express from "express";
import fs from "fs";
import logUpdate from "log-update";
import { xls } from "./xls.js";

const app = express();
const port = 3050;
app.listen(port);

const xlsUnique = [...new Set(xls)];

const contenido = fs.readFileSync("./files/SIRTAC_042023.txt", "utf-8");
const filas = contenido.split("\n");
const dataFind = [];

let count = 0;
let size = filas.length;

for (let fila of filas) {
  if (xlsUnique.some((dato) => fila.includes(dato))) {
    // convert fila in array separado por comas
    let arrfila = fila.split(";");
    let CUIT = arrfila[0];
    let CRC = arrfila[4];
    let CODE = arrfila[5];
    let newArr = `${CUIT};${CRC};${CODE}`;

    dataFind.push(newArr);
    // dataFind.push(fila);
  }
  logUpdate(`Leyendo  ${((count / size) * 100).toFixed(2)}% de 100%`);
  count++;
}

console.log("dataFind", dataFind);

const today = new Date().toLocaleDateString("es-ES").replace(/\//g, "-");

const fileName = `${today}.txt`;

const delimiter = ",";

const dataString = dataFind
  .map((row) => row.split(delimiter).join("\t"))
  .join("\n");

if ((count = size)) {
  console.log("se termino de leer el documento");
  logUpdate.done();
  fs.writeFile(fileName, dataString, (err) => {
    if (err) throw err;
    console.log(`El archivo ${fileName} ha sido creado.`);
  });
}

// import express from "express";
// import fs from "fs";
// import logUpdate from "log-update";
// import { Worker } from "worker_threads";
// import path from "path";
// import { xls } from "./xls.js";
// import * as os from "os";

// const app = express();
// const port = 3050;

// const xlsUnique = [...new Set(xls)];
// const fileName = `${new Date()
//   .toLocaleDateString("es-ES")
//   .replace(/\//g, "-")}.txt`;

// app.listen(port, () => {
//   console.log(`Servidor iniciado en http://localhost:${port}`);
//   console.log(`Procesando archivo SIRTAC...`);

//   const workerPath = path.resolve("./worker.js");
//   const workerData = {
//     filePath: path.resolve("./files/SIRTAC_092022.txt"),
//     xlsUnique,
//     fileName,
//   };

//   const workerCount = os.cpus().length;
//   const workers = [];
//   for (let i = 0; i < workerCount; i++) {
//     workers[i] = new Worker(workerPath, { workerData });
//   }

//   let lineCount = 0;
//   let dataFind = [];

//   workers.forEach((worker) => {
//     worker.on("message", (data) => {
//       if (data.type === "line") {
//         lineCount++;
//         if (data.result) {
//           dataFind.push(data.result);
//         }
//         logUpdate(
//           `Leyendo ${((lineCount / data.totalLines) * 100).toFixed(2)}% de 100%`
//         );
//       } else if (data.type === "error") {
//         console.error(data.message);
//       }
//     });

//     worker.on("error", (err) => {
//       console.error(err);
//     });

//     worker.on("exit", () => {
//       if (workers.every((worker) => worker.isExited)) {
//         console.log("Proceso completado.");
//         const delimiter = ",";
//         const dataString = dataFind
//           .map((row) => row.join(delimiter))
//           .join("\n");
//         fs.writeFile(fileName, dataString, (err) => {
//           if (err) throw err;
//           console.log(`El archivo ${fileName} ha sido creado.`);
//           process.exit();
//         });
//       }
//     });
//   });
// });
