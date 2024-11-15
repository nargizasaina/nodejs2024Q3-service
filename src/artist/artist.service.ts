import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Artist } from 'src/types/common';
import { validate as uuidValidate } from 'uuid';
import { FavsService } from 'src/favs/favs.service';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';
import { DatabaseService } from 'src/database/database.service';
import { CreateArtistDto } from './dtos/create-artist.dto';
import { UpdateArtistDto } from './dtos/update-artist.dto';

@Injectable()
export class ArtistService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(forwardRef(() => FavsService))
    private readonly favsService: FavsService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.databaseService.artist.findMany();
  }

  async findOne(id: string) {
    if (!uuidValidate(id))
      throw new BadRequestException('Artist id is invalid');

    const artist = await this.databaseService.artist.findUnique({
      where: { id },
    });
    if (!artist) throw new NotFoundException('Artist not found!');
    return artist;
  }

  async findManyByIds(ids: string[]) {
    if (ids.length === 0) return [];
    return this.databaseService.artist.findMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async create(artist: CreateArtistDto) {
    return this.databaseService.artist.create({ data: artist });
  }

  async update(id: string, updatedArtist: UpdateArtistDto) {
    if (!uuidValidate(id))
      throw new BadRequestException('Artist id is invalid');
    const artist = await this.databaseService.artist.findUnique({
      where: { id },
    });
    if (!artist) throw new NotFoundException('Artist not found!');

    return this.databaseService.artist.update({
      where: { id },
      data: updatedArtist,
    });
  }

  async delete(id: string) {
    if (!uuidValidate(id))
      throw new BadRequestException('Artist id is invalid');
    const artist = await this.databaseService.artist.findUnique({
      where: { id },
    });
    if (!artist) throw new NotFoundException('Artist not found!');

    await this.databaseService.artist.delete({ where: { id } });

    // this.favsService.deleteArtist(id);
    // this.albumService.removeArtistReference(id);
    // this.trackService.removeArtistReference(id);
  }
}
