import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { validate as uuidValidate } from 'uuid';
import { UserWithoutPassword } from 'src/types/common';
import { DatabaseService } from 'src/database/database.service';

const json = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === 'bigint' ? Number(value) : value), // return everything else unchanged
  );
};

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await this.databaseService.user.findMany();
    const usersWithoutPassword = users.map((user) => {
      const { password, createdAt, updatedAt, ...userWithoutPassword } = user;
      const userWithStringifiedBigInt = {
        ...userWithoutPassword,
        createdAt: createdAt ? Number(createdAt) : null,
        updatedAt: updatedAt ? Number(updatedAt) : null,
      };

      return userWithStringifiedBigInt;
    });

    return usersWithoutPassword;
  }

  async findOne(id: string): Promise<UserWithoutPassword> {
    if (!uuidValidate(id)) throw new BadRequestException('User id is invalid');

    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found!');
    const { password, createdAt, updatedAt, ...userWithoutPassword } = user;
    return json({
      ...userWithoutPassword,
      createdAt: createdAt ? Number(createdAt) : null,
      updatedAt: updatedAt ? Number(updatedAt) : null,
    });
  }

  async create(user: CreateUserDto): Promise<UserWithoutPassword> {
    if (!user.login || !user.password) {
      throw new Error('Login and password are required');
    }
    const newUser = await this.databaseService.user.create({
      data: {
        login: String(user.login),
        password: String(user.password),
        createdAt: BigInt(Date.now()),
        updatedAt: BigInt(Date.now()),
      },
    });
    const { password, ...userWithoutPassword } = newUser;

    return JSON.parse(json(userWithoutPassword));
  }

  async update(
    id: string,
    updatedUser: UpdatePasswordDto,
  ): Promise<UserWithoutPassword> {
    if (!uuidValidate(id)) throw new BadRequestException('User id is invalid');

    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found!');

    if (user.password !== updatedUser.oldPassword) {
      throw new ForbiddenException('Old password is wrong!');
    }

    const updated = await this.databaseService.user.update({
      where: { id },
      data: {
        version: { increment: 1 },
        password: updatedUser.newPassword,
        updatedAt: Date.now(),
      },
    });
    const { password, updatedAt, ...userWithoutPassword } = updated;
    return JSON.parse(
      json({
        ...userWithoutPassword,
        createdAt: Number(user.createdAt),
        updatedAt: updatedAt ? Number(updatedAt) : null,
      }),
    );
  }

  async delete(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('User id is invalid');
    const user = await this.databaseService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found!');
    await this.databaseService.user.delete({ where: { id } });
  }
}
