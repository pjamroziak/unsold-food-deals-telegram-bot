import { ConfigType, registerAs } from '@nestjs/config';

export const foodsiScrapperFetcherConfig = registerAs(
  'foodsi-scrapper-fetcher',
  () => ({
    baseUrl: process.env.FOODSI_BASE_URL,
    restaurantsApiUrl: process.env.FOODSI_RESTAURANTS_API_URL,
    headers: {
      'Content-type': process.env.FOODSI_HEADER_CONTENT_TYPE,
      'system-version': process.env.FOODSI_HEADER_SYSTEM_VERSION,
      'user-agent': process.env.FOODSI_HEADER_USER_AGENT,
    },
    request: {
      distance: {
        lat: process.env.FOODSI_DISTANCE_LAT,
        lng: process.env.FOODSI_DISTANCE_LNG,
        range: process.env.FOODSI_DISTANCE_RANGE,
      },
    },
  }),
);

export type FoodsiScrapperFetcherConfig = ConfigType<
  typeof foodsiScrapperFetcherConfig
>;
