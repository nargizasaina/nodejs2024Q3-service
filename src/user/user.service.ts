import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { validate as uuidValidate } from 'uuid';
import { UserWithoutPassword } from 'src/types/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor (private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await this.databaseService.user.findMany();
    const usersWithoutPassword = users.map(user => {
      const {password, ...userWithoutPassword} = user;
      return userWithoutPassword;
    });

    return usersWithoutPassword;
  }

  async findOne(id: string): Promise<UserWithoutPassword> {
    if (!uuidValidate(id)) throw new BadRequestException('User id is invalid'); 
    
    const user = await this.databaseService.user.findUnique({where: {id}});
    if (!user) throw new NotFoundException('User not found!');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(user: CreateUserDto): Promise<UserWithoutPassword> {
    const newUser = await this.databaseService.user.create({
      data: {
        login: user.login,
        password: user.password,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    });
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async update(id: string, updatedUser: UpdatePasswordDto): Promise<UserWithoutPassword> {
    if (!uuidValidate(id)) throw new BadRequestException('User id is invalid'); 

    const user = await this.databaseService.user.findUnique({where: {id}});
    if (!user) throw new NotFoundException('User not found!');

    if (user.password !== updatedUser.oldPassword) {
      throw new ForbiddenException('Old password is wrong!');
    }
     
    const updated = await this.databaseService.user.update({
      where: { id },
      data: {
        version: {increment: 1}, 
        password: updatedUser.newPassword,
        updatedAt: Date.now() 
      }
    });
    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  async delete(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('User id is invalid'); 
    const user = await this.databaseService.user.findUnique({where: {id}});
    if (!user) throw new NotFoundException('User not found!');

    return this.databaseService.user.delete({where: {id}});
  }
}
