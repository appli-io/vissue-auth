import { IUser } from '@domain/interface/user.interface';

export class UserReadDto {
  id: string;
  email: string;
  name: string;
  password: string
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, email: string, name: string, password: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromUser(user: IUser): UserReadDto {
    return new UserReadDto(user.id, user.email, user.name, user.password, user.createdAt, user.updatedAt);
  }
}
