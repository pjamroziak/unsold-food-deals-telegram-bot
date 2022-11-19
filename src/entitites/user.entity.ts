import { Location, Notification } from 'src/commons/types';

export class User {
  constructor(
    chatId: string,
    location: Location,
    notififcations: Notification[],
  ) {
    this.chatId = chatId;
    this.location = location;
    this.notifications = notififcations;
  }

  chatId: string;
  location: Location;
  notifications: Notification[];
}
