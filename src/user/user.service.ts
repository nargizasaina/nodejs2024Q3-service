import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { User } from 'src/types/common';

@Injectable()
export class UserService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    if (!uuidValidate(id)) throw new BadRequestException('User id is invalid'); 
    
    const user = this.users.find(user => user.id === id);
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  create(user: CreateUserDto): User {
    const newUser = {
      id: uuidv4(),
      login: user.login,
      password: user.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: string, updatedUser: UpdatePasswordDto): User {
    if (!uuidValidate(id)) throw new BadRequestException('User id is invalid'); 
    const user = this.findOne(id);
    if (!user) throw new NotFoundException('User not found!');

    this.users = this.users.map(user => {
      if (user.id === id) {
        if (user.password === updatedUser.oldPassword) {
          const newVersion = user.version + 1;
          return { 
            ...user,
            version: newVersion, 
            password: updatedUser.newPassword,
            updatedAt: Date.now() };
        } else {
          throw new ForbiddenException('Old password is wrong!');
        }
      }
      return user;
    });
    return this.findOne(id);
  }

  delete(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('User id is invalid'); 
    const userToRemove = this.findOne(id);
    if (!userToRemove) throw new NotFoundException('User not found!');

    this.users = this.users.filter(user => user.id !== userToRemove.id);
  }
}
