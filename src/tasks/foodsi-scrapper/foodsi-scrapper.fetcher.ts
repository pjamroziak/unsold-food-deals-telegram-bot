import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import axios, { Axios } from 'axios';
import {
  FoodsiScrapperFetcherConfig,
  foodsiScrapperFetcherConfig,
} from 'src/configs/foodsi-scapper-fetcher.config';
import {
  FoodsiRestaurant,
  FoodsiRestaurantsPage,
} from './foodsi-scrapper.types';
import { Location } from 'src/commons/types';

@Injectable()
export class FoodsiScrapperFetcher implements OnModuleInit {
  private readonly FIRST_PAGE_INDEX = 1;

  private httpClient: Axios;

  constructor(
    @Inject(foodsiScrapperFetcherConfig.KEY)
    private readonly config: FoodsiScrapperFetcherConfig,
  ) {}

  onModuleInit() {
    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      headers: this.config.headers,
    });
  }

  private createRestaurantsRequest(page: number, location: Location) {
    return {
      page,
      per_page: 15,
      distance: {
        lat: location.latitude,
        lng: location.longitude,
        range: this.config.request.distance.range,
      },
      hide_unavailable: true,
      food_type: [],
      collection_time: {
        from: '00:00:00',
        to: '23:59:59',
      },
    };
  }

  private async fetchPage(request: any) {
    const response = await this.httpClient.post(
      this.config.restaurantsApiUrl,
      request,
    );

    return await response.data;
  }

  async fetchRestaurants(location: Location) {
    const restaurants: FoodsiRestaurant[] = [];

    let pageIndex = this.FIRST_PAGE_INDEX;
    let page: FoodsiRestaurantsPage;
    do {
      const request = this.createRestaurantsRequest(pageIndex++, location);
      page = await this.fetchPage(request);
      restaurants.push(...page.data);
    } while (page.total_pages > page.current_page);

    return restaurants;
  }
}
