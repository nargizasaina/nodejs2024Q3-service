import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { Album } from 'src/types/common';
import { CreateAlbumDto } from './dtos/create-album.dto';
import { ArtistService } from 'src/artist/artist.service';
import { UpdateAlbumDto } from './dtos/update-album.dto';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];
  constructor (private readonly artistService: ArtistService) {}

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    if (!uuidValidate(id)) throw new BadRequestException('Album id is invalid'); 
    
    const album = this.albums.find(album => album.id === id);
    if (!album) throw new NotFoundException('Album not found!');
    return album;
  }

  create(album: CreateAlbumDto): Album {
    let id = null;
    if (album.artistId) {
      const artist = this.artistService.findOne(album.artistId);
      id = artist.id;
    }
    const newAlbum = {
      id: uuidv4(),
      name: album.name,
      year: album.year,
      artistId: id
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  update(id: string, updatedAlbum: UpdateAlbumDto): Album {
    if (!uuidValidate(id)) throw new BadRequestException('Album id is invalid'); 
    const album = this.findOne(id);
    if (!album) throw new NotFoundException('Album not found!');

    this.albums = this.albums.map(album => {
      if (album.id === id) {
        return { 
          ...album,
          name: updatedAlbum.name, 
          year: updatedAlbum.year,
          artistId: updatedAlbum.artistId
        } 
      }
      return album;
    });
    return this.findOne(id);
  }

  delete(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Album id is invalid'); 
    const albumToRemove = this.findOne(id);
    if (!albumToRemove) throw new NotFoundException('Album not found!');

    this.albums = this.albums.filter(album => album.id !== albumToRemove.id);
  }
}
