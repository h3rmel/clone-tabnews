import retry from "async-retry";
import database from 'infra/database';

const baseUrl = 'http://localhost:3000';

async function waitForAllServices() {
  await waitForWebServer();
}

async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 100,
    maxTimeout: 1_000,
  });
}

async function fetchStatusPage() {
  const response = await fetch(`${baseUrl}/api/v1/status`);

  if (response.status !== 200) {
    throw new Error();
  }
}

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

export { waitForAllServices, cleanDatabase };
