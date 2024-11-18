import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavsService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
  ) {}

  async findAll() {
    const favorites = await this.databaseService.favorites.findFirst();
    if (!favorites) {
      return { artists: [], albums: [], tracks: [] };
    }
    const artists = await this.artistService.findManyByIds(
      favorites.artists || [],
    );
    const albums = await this.albumService.findManyByIds(
      favorites.albums || [],
    );
    const tracks = await this.trackService.findManyByIds(
      favorites.tracks || [],
    );
    return { artists, albums, tracks };
  }

  async addTrack(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid');

    let track = null;
    try {
      track = await this.trackService.findOne(id);
    } catch {
      throw new UnprocessableEntityException('Track not found!');
    }

    const favorites = await this.databaseService.favorites.findFirst();
    if (!favorites) {
      await this.databaseService.favorites.create({
        data: {
          tracks: [id],
          albums: [],
          artists: [],
        },
      });
    } else {
      await this.databaseService.favorites.upsert({
        where: { id: favorites.id },
        update: {
          tracks: { push: track.id },
        },
        create: {
          tracks: [track.id],
          artists: [],
          albums: [],
        },
      });
    }
    return { message: 'Track is added to favorites' };
  }

  async deleteTrack(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid');
    const favorite = await this.databaseService.favorites.findFirst();
    if (!favorite || !favorite.tracks.includes(id)) {
      throw new NotFoundException('Track is not found in favorites list!');
    }

    const updatedTracks = favorite.tracks.filter((trackId) => trackId !== id);
    await this.databaseService.favorites.update({
      where: { id: favorite.id },
      data: {
        tracks: updatedTracks,
      },
    });
  }

  async addArtist(id: string) {
    if (!uuidValidate(id))
      throw new BadRequestException('Artist id is invalid');

    let artist = null;
    try {
      artist = await this.artistService.findOne(id);
    } catch {
      throw new UnprocessableEntityException('Artist not found!');
    }

    const favorites = await this.databaseService.favorites.findFirst();
    if (!favorites) {
      await this.databaseService.favorites.create({
        data: {
          tracks: [],
          albums: [],
          artists: [id],
        },
      });
    } else {
      await this.databaseService.favorites.upsert({
        where: { id: favorites.id },
        update: {
          artists: { push: artist.id },
        },
        create: {
          tracks: [],
          artists: [artist.id],
          albums: [],
        },
      });
    }

    return { message: 'Artist is added to favorites' };
  }

  async deleteArtist(id: string) {
    if (!uuidValidate(id))
      throw new BadRequestException('Artist id is invalid');

    const favorites = await this.databaseService.favorites.findFirst();
    if (!favorites || !favorites.artists.includes(id)) {
      throw new NotFoundException('Artist is not found in favorites list!');
    }

    const updatedArtists = favorites.artists.filter(
      (artistId) => artistId !== id,
    );
    await this.databaseService.favorites.update({
      where: { id: favorites.id },
      data: {
        artists: updatedArtists,
      },
    });
  }

  async addAlbum(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Album id is invalid');

    let album = null;
    try {
      album = await this.albumService.findOne(id);
    } catch {
      throw new UnprocessableEntityException('Album not found!');
    }

    const favorites = await this.databaseService.favorites.findFirst();
    if (!favorites) {
      await this.databaseService.favorites.create({
        data: {
          tracks: [],
          albums: [id],
          artists: [],
        },
      });
    } else {
      await this.databaseService.favorites.upsert({
        where: { id: favorites.id },
        update: {
          albums: { push: album.id },
        },
        create: {
          tracks: [],
          artists: [],
          albums: [album.id],
        },
      });
    }
    return { message: 'Album is added to favorites' };
  }

  async deleteAlbum(id: string) {
    if (!uuidValidate(id)) throw new BadRequestException('Album id is invalid');

    const favorite = await this.databaseService.favorites.findFirst();
    if (!favorite || !favorite.albums.includes(id)) {
      throw new NotFoundException('Album is not found in favorites list!');
    }

    const updatedAlbums = favorite.albums.filter((albumId) => albumId !== id);
    await this.databaseService.favorites.update({
      where: { id: favorite.id },
      data: {
        albums: updatedAlbums,
      },
    });
  }
}
