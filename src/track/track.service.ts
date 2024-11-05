import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Track } from 'src/types/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { CreateTrackDto } from './dtos/create-track.dto';
import { ArtistService } from 'src/artist/artist.service';
import { AlbumService } from 'src/album/album.service';
import { UpdateTrackDto } from './dtos/update-track.dto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];
  constructor (
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService
  ) {}

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid'); 
    
    const track = this.tracks.find(track => track.id === id);
    if (!track) throw new NotFoundException('Track not found!');
    return track;
  }

  create(track: CreateTrackDto): Track {
    let artistId = null;
    let albumId = null;
    if (track.artistId) {
      const artist = this.artistService.findOne(track.artistId);
      artistId = artist.id;
    }
    if (track.albumId) {
      const album = this.albumService.findOne(track.albumId);
      albumId = album.id;
    }

    const newTrack = {
      id: uuidv4(),
      name: track.name,
      artistId: artistId,
      albumId: albumId,
      duration: track.duration
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updatedTrack: UpdateTrackDto): Track {
    if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid'); 
    const track = this.findOne(id);
    if (!track) throw new NotFoundException('Track not found!');

    let artistId = null;
    let albumId = null;
    if (track.artistId) {
      const artist = this.artistService.findOne(track.artistId);
      artistId = artist.id;
    }
    if (track.albumId) {
      const album = this.albumService.findOne(track.albumId);
      albumId = album.id;
    }

    this.tracks = this.tracks.map(track => {
      if (track.id === id) {
        return { 
          ...track,
          name: track.name,
          artistId: artistId,
          albumId: albumId,
          duration: track.duration
        };
       
      }
      return track;
    });
    return this.findOne(id);
  }

  delete(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid'); 
    const trackToRemove = this.findOne(id);
    if (!trackToRemove) throw new NotFoundException('Track not found!');

    this.tracks = this.tracks.filter(track => track.id !== trackToRemove.id);
  }
}
