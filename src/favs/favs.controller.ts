import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll(){
    return this.favsService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string) {
    return this.favsService.addTrack(id);
  }

  @Delete('track/:id')
  deleteTrack(@Param('id') id: string) {
    return this.favsService.deleteTrack(id);
  }

  @Post('album/:id')
  addAlbum(@Param('id') id: string) {
    return this.favsService.addAlbum(id);
  }

  @Delete('album/:id')
  deleteAlbum(@Param('id') id: string) {
    return this.favsService.deleteAlbum(id);
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string) {
    return this.favsService.addTrack(id);
  }

  @Delete('track/:id')
  deleteTrack(@Param('id') id: string) {
    return this.favsService.deleteTrack(id);
  }
}
