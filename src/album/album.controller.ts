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
import { CreateAlbumDto } from './dtos/create-album.dto';
import { UpdateAlbumDto } from './dtos/update-album.dto';

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
  create(@Body(ValidationPipe) album: CreateAlbumDto) {
    return this.albumService.create(album);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) albumUpdate: UpdateAlbumDto,
  ) {
    return this.albumService.update(id, albumUpdate);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.albumService.delete(id);
  }
}
