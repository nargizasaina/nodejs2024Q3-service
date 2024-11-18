import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Track } from 'src/types/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { CreateTrackDto } from './dtos/create-track.dto';
import { UpdateTrackDto } from './dtos/update-track.dto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

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
      // const artist = this.artistService.findOne(track.artistId);
      artistId = track.artistId;
    }
    if (track.albumId) {
      // const album = this.albumService.findOne(track.albumId);
      albumId = track.albumId;
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
    if (updatedTrack.artistId) {
      // const artist = this.artistService.findOne(track.artistId);
      artistId = updatedTrack.artistId;
    }
    if (updatedTrack.albumId) {
      // const album = this.albumService.findOne(track.albumId);
      albumId = updatedTrack.albumId;
    }

    this.tracks = this.tracks.map(track => {
      if (track.id === id) {
        return { 
          ...track,
          name: updatedTrack.name,
          artistId: artistId,
          albumId: albumId,
          duration: updatedTrack.duration
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

  removeArtistReference(artistId: string): void {
    this.tracks = this.tracks.map(track => {
      if (track.artistId === artistId) {
        return { ...track, artistId: null };
      }
      return track;
    });
  }

  removeAlbumReference(albumId: string): void {
    this.tracks = this.tracks.map(track => {
      if (track.albumId === albumId) {
        return { ...track, albumId: null };
      }
      return track;
    });
  }
}
