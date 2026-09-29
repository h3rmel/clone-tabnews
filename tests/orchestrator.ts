import retry from "async-retry";
import database from 'infra/database';

const baseUrl = 'http://localhost:3000';

async function waitForAllServices() {
  await waitForWebServer();
}

async function waitForWebServer() {
  return retry(fetchStatusPage, {
    retries: 100,
  });
}

async function fetchStatusPage() {
  const response = await fetch(`${baseUrl}/api/v1/status`);

  await response.json();
}

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

export { waitForAllServices, cleanDatabase };
