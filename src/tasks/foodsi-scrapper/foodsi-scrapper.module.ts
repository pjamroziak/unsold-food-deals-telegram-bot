import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { foodsiScrapperFetcherConfig } from 'src/configs/foodsi-scapper-fetcher.config';
import { RavendbService } from 'src/ravendb/ravendb.service';
import { FoodsiScrapperFetcher } from './foodsi-scrapper.fetcher';
import { FoodsiScrapperService } from './foodsi-scrapper.service';
import { FoodsiScrapperTask } from './foodsi-scrapper.task';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [foodsiScrapperFetcherConfig],
    }),
  ],
  providers: [
    FoodsiScrapperTask,
    FoodsiScrapperService,
    FoodsiScrapperFetcher,
    RavendbService,
  ],
})
export class FoodsiScrapperModule {}
