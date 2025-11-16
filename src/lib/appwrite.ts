import { Client, Account } from "appwrite";

export { type Models, ID } from "appwrite";

export const client = new Client()
  .setEndpoint(import.meta.env.PUBLIC_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
