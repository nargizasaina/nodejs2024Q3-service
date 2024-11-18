import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dtos/create-track.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';

@Controller('track')
export class TrackController {
  constructor (private readonly trackService: TrackService) {}

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id:string) {
    return this.trackService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) track: CreateTrackDto) {
    return this.trackService.create(track);
  }

  @Put(':id') 
  update(@Param('id') id:string, @Body(ValidationPipe) trackUpdate: UpdateTrackDto) {
    return this.trackService.update( id, trackUpdate );
  }

  @Delete(':id') 
  @HttpCode(204)
  delete(@Param('id') id:string) {
    return this.trackService.delete(id);
  }
}
