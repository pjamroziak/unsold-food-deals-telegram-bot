import { Module } from '@nestjs/common';
import { InternalApiService } from './internal-api.service';

@Module({
  providers: [InternalApiService],
  exports: [InternalApiService],
})
export class InternalApiModule {}
