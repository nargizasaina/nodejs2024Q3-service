import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { TrackService } from 'src/track/track.service';
import { Favorites } from 'src/types/common';

@Injectable()
export class FavsService {
  private favorites: Favorites = { artists: [], albums: [], tracks: [] };
  constructor(
    @Inject(forwardRef(() => TrackService)) private readonly trackService: TrackService,
    @Inject(forwardRef(() => ArtistService)) private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService)) private readonly albumService: AlbumService,
  ) {}
}
