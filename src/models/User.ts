import type { IUser } from './interfaces';

export class User implements IUser {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  address!: string;
  memberSince!: string;

  constructor(data: IUser) {
    Object.assign(this, data);
  }

  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  initials(): string {
    return (this.firstName[0] ?? '') + (this.lastName[0] ?? '');
  }

  static fromJSON(data: IUser): User {
    return new User(data);
  }
}
