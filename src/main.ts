import { NestFactory } from '@nestjs/core';
import DocumentStore from 'ravendb';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverUrl = 'http://localhost:8080';
const databaseName = 'YourDatabaseName';

const documentStore = new DocumentStore([serverUrl], databaseName);

documentStore.initialize();

const session = documentStore.openSession('YourDatabaseName');

//   Run your business logic:
//
//   Store documents
//   Load and Modify documents
//   Query indexes & collections
//   Delete documents

await session.saveChanges();
  await app.listen(3000);
}
bootstrap();
