import { City, Cordinates } from '@app/common/types';
import { Offer, User } from '@app/common/types';
import {
  InternalApiConfigKey,
  InternalApiConfig,
} from '@app/configs/internal-api.config';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InternalApiService {
  private readonly logger = new Logger(InternalApiService.name);

  constructor(
    @Inject(InternalApiConfigKey)
    private readonly config: InternalApiConfig,
  ) {}

  async getUser(id: number) {
    return this.getData<User>(
      fetch(`${this.config.baseUrl}/api/v1/users/${id}`),
    );
  }

  async createUser(
    user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'city'>,
  ) {
    return this.getData<User>(
      this.post(`${this.config.baseUrl}/api/v1/users`, user),
    );
  }

  async getOffer(id: number) {
    return await this.getData<Offer>(
      fetch(`${this.config.baseUrl}/api/v1/offers/${id}`),
    );
  }

  async getCityByCordinates(cordinates: Cordinates) {
    return await this.getData<City>(
      this.post(`${this.config.baseUrl}/api/v1/cities/find`, cordinates),
    );
  }

  private async post(url: string, body: unknown) {
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  private async patch(url: string, body: unknown) {
    return fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  private async getData<T>(promise: Promise<Response>) {
    try {
      const response = await promise;
      return (await response.json()) as T;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      return null;
    }
  }
}
