import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Prisma } from '@prisma/client';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) album: Prisma.AlbumCreateInput) {
    return this.albumService.create(album);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) albumUpdate: Prisma.AlbumUpdateInput,
  ) {
    return this.albumService.update(id, albumUpdate);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.albumService.delete(id);
  }
}
