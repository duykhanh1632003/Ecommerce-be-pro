const app = require("./src/app");

const server = app.listen(8000, () => {
  console.log("Server is running with port 8000");
});

// process.on("SIGINT", () => {
//   server.close(() => console.log("Check out server"));
// });
