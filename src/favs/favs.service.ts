import { Inject, Injectable, forwardRef, BadRequestException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { Favorites, FavoritesResponse } from 'src/types/common';

@Injectable()
export class FavsService {
  private favorites: Favorites = { artists: [], albums: [], tracks: [] };
  constructor(
    @Inject(forwardRef(() => TrackService)) private readonly trackService: TrackService,
    @Inject(forwardRef(() => ArtistService)) private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService)) private readonly albumService: AlbumService,
  ) {}

  findAll(): FavoritesResponse {
    return {
      artists: this.favorites.artists.map(id => this.artistService.findOne(id)),
      albums: this.favorites.albums.map(id => this.albumService.findOne(id)),
      tracks: this.favorites.tracks.map(id => this.trackService.findOne(id)),
    };
  }

  addTrack(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid'); 

    const track = this.trackService.findOne(id);
    if (!track) throw new UnprocessableEntityException('Track not found!');

    if (!this.favorites.tracks.includes(track.id)) {
      this.favorites.tracks.push(track.id);
    }

    return { message: 'Track is added to favorites' };
  }

  deleteTrack(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid'); 

    if (!this.favorites.tracks.includes(id)) {
      throw new NotFoundException('Track is not found in favorites list!');
    }

    this.favorites.tracks = this.favorites.tracks.filter(trackId => trackId !== id);
  }

  addArtist(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Artist id is invalid'); 

    const artist = this.artistService.findOne(id);
    if (!artist) throw new UnprocessableEntityException('Artist not found!');

    if (!this.favorites.artists.includes(artist.id)) {
      this.favorites.artists.push(artist.id);
    }

    return { message: 'Artist is added to favorites' };
  }

  deleteArtist(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Artist id is invalid'); 

    if (!this.favorites.artists.includes(id)) {
      throw new NotFoundException('Artist is not found in favorites list!');
    }

    this.favorites.artists = this.favorites.artists.filter(artistId => artistId !== id);
  }

  addAlbum(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Album id is invalid'); 

    const album = this.albumService.findOne(id);
    if (!album) throw new UnprocessableEntityException('Album not found!');

    if (!this.favorites.albums.includes(album.id)) {
      this.favorites.albums.push(album.id);
    }

    return { message: 'Album is added to favorites' };
  }

  deleteAlbum(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Album id is invalid'); 

    if (!this.favorites.albums.includes(id)) {
      throw new NotFoundException('Album is not found in favorites list!');
    }

    this.favorites.albums = this.favorites.albums.filter(albumId => albumId !== id);
  }
}
