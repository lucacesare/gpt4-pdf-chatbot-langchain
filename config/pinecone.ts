/**
 * Change the namespace to the namespace on Pinecone you'd like to store your embeddings.
 */


const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';

const PINECONE_NAME_SPACE = 'pdf-test'; //namespace is optional for your vectors

const QDRANT_URL = process.env.QDRANT_URL ?? '';

const QDRANT_KEY = process.env.QDRANT_KEY ?? '';

export { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE, QDRANT_URL, QDRANT_KEY };
