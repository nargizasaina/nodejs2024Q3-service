import { Controller, Get, Param } from '@nestjs/common';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor (private readonly trackservice: TrackService) {}

  @Get()
  findAll() {
    return this.trackservice.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id:string) {
    return this.trackservice.findOne(id);
  }
}
