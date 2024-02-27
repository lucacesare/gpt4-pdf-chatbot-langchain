import {QdrantClient} from '@qdrant/js-client-rest';
import { QDRANT_KEY, QDRANT_URL } from '@/config/pinecone';

async function initQdrant() {
    try {
        // or connect to Qdrant Cloud
        const qdrant = new QdrantClient({
            url: QDRANT_URL,
            apiKey: QDRANT_KEY
        });
  
      return qdrant;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to initialize Qdrant Client');
    }
  }

export const qdrant = await initQdrant();
  