import { Module } from '@nestjs/common';
import { RavendbService } from './ravendb.service';

@Module({
  providers: [RavendbService],
})
export class RavendbModule {}
