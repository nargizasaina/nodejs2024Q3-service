import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { isValidId } from 'src/utils';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('user')
export class UserController {
  constructor (private readonly userService: UserService) {}

  @Get() 
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id') 
  findOne(@Param('id') id:string) {
    if (!isValidId(id)) {
      return 'User id is invalid';
    }
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Put(':id') 
  update(@Param('id') id:string, @Body(ValidationPipe) userUpdate: UpdatePasswordDto) {
    if (!isValidId(id)) {
      return 'User id is invalid';
    }
    return this.userService.update( id, userUpdate );
  }

  @Delete(':id') 
  delete(@Param('id') id:string) {
    if (!isValidId(id)) {
      return 'User id is invalid';
    } 
    return this.userService.delete(id);
  }
}
 