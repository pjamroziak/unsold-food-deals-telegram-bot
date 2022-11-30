type User = {
  id: number;
  telegramChatId: string;
  latitude: number;
  longitude: number;
  created_at: Date;
  updated_at: Date;
  city: number;
};

type Offer = {
  id: number;
  restaurant_id: number;
  package_id: number;
  name: string;
  description: string;
  logoUrl: string;
  stock: number;
  old_price: number;
  new_price: number;
  opened_at: Date;
  closed_at: Date;
  created_at: Date;
  updated_at: Date;
};

type City = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  created_at: Date;
  updated_at: Date;
  users: User[];
  offers: Offer[];
};

type Cordinates = {
  latitude: number;
  longitude: number;
};

type FoodsiNotifyEventPayload = {
  userId: number;
  offerId: number;
};

export { User, Offer, City, Cordinates, FoodsiNotifyEventPayload };
