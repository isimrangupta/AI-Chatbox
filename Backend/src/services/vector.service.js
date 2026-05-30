const { Pinecone } = require("@pinecone-database/pinecone");

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const cohortChatGptIndex = pc.index("cohort-chat-gpt");

async function createMemory({
  vectors,
  metadata,
  messageId,
}) {


  const response = await cohortChatGptIndex.upsert([
    {
      id: String(messageId),
      values: vectors,
      metadata: {
        chat: metadata.chat,   
        user: metadata.user,
        text: metadata.text,
      },
    },
  ]);

  console.log("UPSERT RESPONSE:", response);
}


async function queryMemory({
  queryVector,
  limit = 5,
  metadata,
}) {

  const data = await cohortChatGptIndex.query({
    vector: queryVector,
    topK: limit,
    filter: metadata || undefined,
    includeMetadata: true,
  });

  return data.matches;
}

module.exports = {
  createMemory,
  queryMemory,
};