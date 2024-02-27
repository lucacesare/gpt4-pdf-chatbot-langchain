import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { QdrantVectorStore } from 'langchain/vectorstores/qdrant';
import { qdrant } from '@/utils/qdrant-client';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { QDRANT_URL, QDRANT_KEY } from '@/config/qdrant';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';

/* Name of directory to retrieve your files from 
   Make sure to add your PDF files inside the 'docs' folder
*/
const filePath = 'docs';

function batchReduce<T>(arr: T[], batchSize: number): T[][] {
  return arr.reduce((batches, curr, i) => {
      if (i % batchSize === 0) batches.push([]);
      batches[batches.length - 1].push(arr[i]);
      return batches;
  }, [] as T[][]);
};

export const run = async () => {
  try {
    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new PDFLoader(path),
    });

    // const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 300,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('split docs', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-large"
    });
    const url = QDRANT_URL; //change to your own index name
    
    batchReduce(docs, 500).forEach(async function(value){
          //embed the PDF documents
      await QdrantVectorStore.fromDocuments(
      value, 
      embeddings,
      {
        client: qdrant,
        url: QDRANT_URL,
        apiKey: QDRANT_KEY,
        collectionName: 'test'
      });
    });
    

  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
