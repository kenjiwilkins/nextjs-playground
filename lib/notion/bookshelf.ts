import { getNotionClient, getNotionBookshelfDataSourceId } from "./client"

const notionClient = getNotionClient()
const bookshelfDataSourceId = getNotionBookshelfDataSourceId()

export async function getBookshelfBooks() {
  return await notionClient.dataSources.query({
    data_source_id: bookshelfDataSourceId,
    filter_properties: ["Title", "Author_Name", "Status", "Date_Read", "Rollup"],
    sorts: [
      {
        property: "Reading",
        direction: "ascending",
      },
    ],
  })
}
