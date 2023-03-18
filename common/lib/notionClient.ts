import { Client } from "@notionhq/client";
import { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";

const notionDatabaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID!;
const notionSecret = process.env.NEXT_PUBLIC_NOTION_SECRET!;

const notionClient = new Client({
  auth: notionSecret,
});

export const queryNotionDatabase = async (
  variables?: QueryDatabaseParameters
) => {
  const query = await notionClient.databases.query({
    ...variables,
    database_id: notionDatabaseId,
  });

  return query.results;
};
