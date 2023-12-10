const app = require("./src/app");

const PORT = process.env.PORT || 3055;

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Express server closed");
  });

  // Cleanup tasks, e.g., clear intervals, close connections, etc.
  process.exit();
});
