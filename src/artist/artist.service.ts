import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Artist } from 'src/types/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { CreateArtistDto } from './dtos/create-artist.dto';
import { UpdateArtistDto } from './dtos/update-artist.dto';
import { FavsService } from 'src/favs/favs.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class ArtistService {
  constructor(
    @Inject(forwardRef(() => FavsService)) private readonly favsService: FavsService,
    @Inject(forwardRef(() => AlbumService)) private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService)) private readonly trackService: TrackService
  ) {}
  private artists: Artist[] = [];

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    if (!uuidValidate(id)) throw new BadRequestException('Artist id is invalid'); 
    
    const artist = this.artists.find(artist => artist.id === id);
    if (!artist) throw new NotFoundException('Artist not found!');
    return artist;
  }

  create(artist: CreateArtistDto): Artist {
    const newArtist = {
      id: uuidv4(),
      name: artist.name,
      grammy: artist.grammy
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updatedArtist: UpdateArtistDto): Artist {
    if (!uuidValidate(id)) throw new BadRequestException('Artist id is invalid'); 
    const artist = this.findOne(id);
    if (!artist) throw new NotFoundException('Artist not found!');

    this.artists = this.artists.map(artist => {
      if (artist.id === id) {
        return { 
          ...artist,
          name: updatedArtist.name, 
          grammy: updatedArtist.grammy,
        }
      }
      return artist;
    });
    return this.findOne(id);
  }

  delete(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Artist id is invalid'); 
    const artistToRemove = this.findOne(id);
    if (!artistToRemove) throw new NotFoundException('Artist not found!');

    this.artists = this.artists.filter(artist => artist.id !== artistToRemove.id);

    this.favsService.deleteArtist(id);
    this.albumService.removeArtistReference(id);
    this.trackService.removeArtistReference(id);
  }
}
