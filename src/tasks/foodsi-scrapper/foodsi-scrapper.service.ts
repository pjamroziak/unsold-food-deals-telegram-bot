import { Injectable } from '@nestjs/common';
import { Location } from 'src/commons/types';
import { FoodsiScrapperFetcher } from './foodsi-scrapper.fetcher';
import { FoodsiRestaurant } from './foodsi-scrapper.types';

@Injectable()
export class FoodsiScrapperService {
  constructor(private readonly fetcher: FoodsiScrapperFetcher) {}

  async getOffers(location: Location) {
    const restaurants = await this.fetcher.fetchRestaurants(location);
    return this.mapRestaurantsToOffers(restaurants);
  }

  private mapRestaurantsToOffers(restaurants: FoodsiRestaurant[]) {
    const map = {};

    for (const restaurant of restaurants) {
      map[restaurant.id + ':' + restaurant.package_id] = {
        id: restaurant.id,
        package_id: restaurant.package_id,
        name: restaurant.name,
        description: restaurant.meal.description,
        logoUrl: restaurant.logo.url,
        stock: restaurant.package_day.meals_left,
        prices: {
          old: Number(restaurant.meal.original_price),
          new: Number(restaurant.meal.price),
        },
        collect_times: {
          opened_at: new Date(restaurant.package_day.collection_day.opened_at),
          closed_at: new Date(restaurant.package_day.collection_day.closed_at),
        },
      };
    }

    return map;
  }
}
