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
import { TrackService } from './track.service';
import { Prisma } from '@prisma/client';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackService.findOne(id);
  }

  @Post()
  create(@Body(ValidationPipe) track: Prisma.TrackCreateInput) {
    return this.trackService.create(track);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) trackUpdate: Prisma.TrackUpdateInput,
  ) {
    return this.trackService.update(id, trackUpdate);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.trackService.delete(id);
  }
}
