import { Injectable, OnModuleInit } from '@nestjs/common';
import { X509Certificate } from 'crypto';
import DocumentStore from 'ravendb';
import { promises as fs } from 'fs';
import * as path from 'node:path';
import { User } from 'src/entitites/user.entity';

@Injectable()
export class RavendbService implements OnModuleInit {
  private store: DocumentStore;

  async onModuleInit() {
    this.store = new DocumentStore('https://a.free.ufd.ravendb.cloud', 'main', {
      type: 'pfx',
      certificate: await fs.readFile(path.resolve('Backend.pfx')),
    });
    this.store.initialize();
  }

  async storeDocument(document: object): Promise<object> {
    const session = this.store.openSession();

    await session.store(document);
    await session.saveChanges();

    session.dispose();

    return document;
  }

  async listDocuments(): Promise<User[]> {
    const session = this.store.openSession();

    const objects = await session
      .query<User>({ collection: 'Users' })
      .noTracking()
      .all();

    session.dispose();

    return objects;
  }
}
