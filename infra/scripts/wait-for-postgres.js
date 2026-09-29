const { exec } = require("node:child_process");

const DOT_FRAMES = [".", "..", "..."];
const POLL_INTERVAL_MS = 300;

function checkPostgresConnection() {
  let frame = 0;

  const intervalId = setInterval(() => {
    process.stdout.write(`\rAwaiting Postgres${DOT_FRAMES[frame]}   `);
    frame = (frame + 1) % DOT_FRAMES.length;

    exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
  }, POLL_INTERVAL_MS);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") !== -1) {
      clearInterval(intervalId);
      process.stdout.write("\rPostgres is ready and accepting connections.\n");
    }
  }
}

checkPostgresConnection();
