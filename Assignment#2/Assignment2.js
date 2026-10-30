//Part 1: Node.js Core Modules (10 Grades)

//Q1.
/* function getfileAndDir(){
    console.log({
        file: __filename,
        Dir: __dirname,
});
}
getfileAndDir(); */

//Q2.
/* const path = require("path");

function gitFileName(filePath){
    return path.basename(filePath);

}
console.log(gitFileName("/user/files/report.pdf")) */

//Q3.
/* const path = require("path")
function buildPath(file){
    return path.join(file.dir,file.name + file.ext)
}
console.log(
  buildPath({
    dir: "/folder",
    name: "app",
    ext: ".js" 
  })
); */

//Q4.
/* 
const path = require("path");

function getExtension(filePath) {
  return path.extname(filePath);
}

console.log(getExtension("/docs/readme.md")); */

//Q5.
/* const path = require("path")
function parseFilePath(filePath){
   const parsedPath =  path.parse(filePath)
   return{
    Name: parsedPath.name,
    Ext: parsedPath.ext
   }

}
console.log(parseFilePath("/home/app/main.js")); */

//Q6.
/* const path = require("path");

function checkAbsolute(filePath) {
  return path.isAbsolute(filePath);
}

console.log(checkAbsolute("/home/user/file.txt")); */

//Q7.
/* const path = require("path");

function joinSegments(...segments) {
  return path.join(...segments);
}

console.log(
  joinSegments("src", "components", "App.js")
); */

//Q8.
/* const path = require("path");

function resolvePath(relativePath) {
  return path.resolve(relativePath);
}

console.log(resolvePath("./index.js")); */

//Q9.
/* const path = require("path");

function joinTwoPaths(path1, path2) {
  return path.join(path1, path2);
}

console.log(
  joinTwoPaths("/folder1", "folder2/file.txt")
); */

//Q10.
/* const fs = require("fs")
function deleteFile(filePath){
    fs.unlink(filePath, (err)=>{
        if(err){
            console.log("error:",err.message);
            return;
        }
        console.log(`${filePath} is deleted`)
    })

}
deleteFile("./Assignment2.js"); */

//Q11.
/* const fs = require("fs");

function createFolder(folderPath) {
  try {
    fs.mkdirSync(folderPath);
    console.log("Success");
  } catch (error) {
    console.log("Error:", error.message);
  }
}

createFolder("./new-folder"); */
//Q12.
/* const EventEmitter = require("events");

const emitter = new EventEmitter();

emitter.on("start", () => {
  console.log("Welcome event triggered!");
});

emitter.emit("start"); */

//Q13.
/* 
const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on('login',(userName)=>{
    console.log(`user loged in : ${userName}`)
})
emitter.emit("login","Ammar")
 */

//Q14
/* const fs = require("fs");

function readFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  console.log(content);
}

readFile("./note.txt"); 
*/

//Q15.
/* const fs = require("fs");

function writeFile(filePath, content) {
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.log("Error:", err.message);
      return;
    }

    console.log("File written successfully");
  });
}

writeFile("./async.txt", "Async save");
 */
//Q16.
/* 
const fs = require("fs");

function checkExists(filePath) {
  return fs.existsSync(filePath);
}

console.log(checkExists("./note.txt")); 
*/
//Q17.
/* const os = require("os");

function getOSInfo() {
  return {
    Platform: os.platform(),
    Arch: os.arch()
  };
}

console.log(getOSInfo()); 
*/
//Q18
/* const fs = require("fs");

function readFileInChunks(filePath) {
  const readableStream = fs.createReadStream(filePath, {
    encoding: "utf8"
  });

  readableStream.on("data", (chunk) => {
    console.log(chunk);
  });

  readableStream.on("end", () => {
    console.log("Finished reading file.");
  });
}

readFileInChunks("./big.txt"); */
//Q19.
/* 

const fs = require("fs");

function copyFile(source, destination) {
  const readableStream = fs.createReadStream(source);
  const writableStream = fs.createWriteStream(destination);

  readableStream.on("data", (chunk) => {
    writableStream.write(chunk);
  });

  readableStream.on("end", () => {
    writableStream.end();
    console.log("File copied using streams");
  });

  readableStream.on("error", (err) => {
    console.log("Error:", err.message);
  });
}

copyFile("./big.txt", "./dest.txt");
 */

//Q20.
/* const fs = require("fs");
const zlib = require("zlib");
const { pipeline } = require("stream");

function compressFile(source, destination) {
  const readableStream = fs.createReadStream(source);
  const gzip = zlib.createGzip();
  const writableStream = fs.createWriteStream(destination);

  pipeline(
    readableStream,
    gzip,
    writableStream,
    (err) => {
      if (err) {
        console.log("Error:", err.message);
        return;
      }

      console.log("File compressed successfully");
    }
  );
}

compressFile("./note.txt", "./note.txt.gz"); */