import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.track.findMany();
  }

  async findOne(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid');

    const track = await this.databaseService.track.findUnique({
      where: { id },
    });
    if (!track) throw new NotFoundException('Track not found!');
    return track;
  }

  async findManyByIds(ids: string[]) {
    return this.databaseService.artist.findMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async create(track: Prisma.TrackCreateInput) {
    return this.databaseService.track.create({
      data: track,
    });
  }

  async update(id: string, updatedTrack: Prisma.TrackUpdateInput) {
    if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid');
    const track = await this.databaseService.track.findUnique({
      where: { id },
    });
    if (!track) throw new NotFoundException('Track not found!');

    return this.databaseService.track.update({
      where: { id },
      data: updatedTrack,
    });
  }

  async delete(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid');
    const trackToRemove = await this.databaseService.track.findUnique({
      where: { id },
    });
    if (!trackToRemove) throw new NotFoundException('Track not found!');

    return this.databaseService.track.delete({ where: { id } });
  }

  // removeArtistReference(artistId: string): void {
  //   this.tracks = this.tracks.map(track => {
  //     if (track.artistId === artistId) {
  //       return { ...track, artistId: null };
  //     }
  //     return track;
  //   });
  // }

  // removeAlbumReference(albumId: string): void {
  //   this.tracks = this.tracks.map(track => {
  //     if (track.albumId === albumId) {
  //       return { ...track, albumId: null };
  //     }
  //     return track;
  //   });
  // }
}
