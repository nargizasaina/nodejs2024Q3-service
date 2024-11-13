import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AlbumService {
  constructor (private readonly databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.album.findMany();
  }

  async findOne(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Album id is invalid'); 
    
    const album = await this.databaseService.album.findUnique({where: {id}});
    if (!album) throw new NotFoundException('Album not found!');
    return album;
  }

  async create(album: Prisma.AlbumCreateInput) {
    return this.databaseService.album.create({
      data: album
    });
  }

  async update(id: string, updatedAlbum: Prisma.AlbumUpdateInput) {
    if (!uuidValidate(id)) throw new BadRequestException('Album id is invalid'); 
    const album = await this.databaseService.album.findUnique({where: {id}});
    if (!album) throw new NotFoundException('Album not found!');

    return this.databaseService.album.update({
      where: {id},
      data: updatedAlbum
    });
  }

  async delete(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Album id is invalid'); 
    const album = await this.databaseService.album.findUnique({where: {id}});
    if (!album) throw new NotFoundException('Album not found!');

    return this.databaseService.album.delete({where: {id}});
  }

  // removeArtistReference(artistId: string): void {
  //   this.albums = this.albums.map(album => {
  //     if (album.artistId === artistId) {
  //       return { ...album, artistId: null };
  //     }
  //     return album;
  //   });
  // }
}
