import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Injectable()
export class UserService {
  private users = [];

  findAll() {
    return this.users;
  }

  findOne(id: string) {console.log('here')
    const user = this.users.find(user => user.id === id);
    return user;
  }

  create(user: CreateUserDto) {
    const newUser = {
      id: uuidv4(),
      version: 1,
      ...user
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updatedUser: UpdatePasswordDto) {
    this.users = this.users.map(user => {
      if (user.id === id && user.password === updatedUser.oldPassword) {
        const newVersion = user.version + 1;
        return { 
          ...user, 
          ...updatedUser, 
          version: newVersion, 
          password: updatedUser.newPassword };
      }
      return user;
    });
    return this.findOne(id);
  }

  delete(id: string) {
    const userToRemove = this.findOne(id);
    this.users = this.users.filter(user => user.id !== userToRemove.id);
    return 'ok';
  }
}
