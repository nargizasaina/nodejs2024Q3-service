import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor (private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @Get() 
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id') 
  findOne(@Param('id') id:string) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Put(':id') 
  update(@Param('id') id:string, @Body(ValidationPipe) userUpdate: UpdatePasswordDto) {
    return this.userService.update( id, userUpdate );
  }

  @Delete(':id') 
  @HttpCode(204)
  delete(@Param('id') id:string) {
    return this.userService.delete(id);
  }
}
 