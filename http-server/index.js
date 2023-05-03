const http = require("http");
const fs = require("fs");
let homebody = "";
let projectbody = "";
let registraionbody = "";
const args = require("minimist")(process.argv);
const port = args.port;
fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homebody = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectbody = project;
});
fs.readFile("registration.html", (err, registraion) => {
  if (err) {
    throw err;
  }
  registraionbody = registraion;
});
http
  .createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/project":
        response.write(projectbody);
        response.end();
        break;
      case "/registration":
        response.write(registraionbody);
        response.end();
        break;
      default:
        response.write(homebody);
        response.end();
        break;
    }
  })

  .listen(port);
