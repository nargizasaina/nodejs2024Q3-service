import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dtos/create-artist.dto';
import { UpdateArtistDto } from './dtos/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) artist: CreateArtistDto) {
    return this.artistService.create(artist);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) artistUpdate: UpdateArtistDto,
  ) {
    return this.artistService.update(id, artistUpdate);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.artistService.delete(id);
  }
}
