import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Track } from 'src/types/common';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

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

//   create(Track: CreateTrackDto): Track {
//     const newTrack = {
//       id: uuidv4(),
//       login: Track.login,
//       password: Track.password,
//       version: 1,
//       createdAt: Date.now(),
//       updatedAt: Date.now()
//     };
//     this.tracks.push(newTrack);
//     return newTrack;
//   }

//   update(id: string, updatedTrack: UpdatePasswordDto): Track {
//     if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid'); 
//     const Track = this.findOne(id);
//     if (!Track) throw new NotFoundException('Track not found!');

//     this.tracks = this.tracks.map(Track => {
//       if (Track.id === id) {
//         if (Track.password === updatedTrack.oldPassword) {
//           const newVersion = Track.version + 1;
//           return { 
//             ...Track,
//             version: newVersion, 
//             password: updatedTrack.newPassword,
//             updatedAt: Date.now() };
//         } else {
//           throw new ForbiddenException('Old password is wrong!');
//         }
//       }
//       return Track;
//     });
//     return this.findOne(id);
//   }

//   delete(id: string) {
//     if (!uuidValidate(id)) throw new BadRequestException('Track id is invalid'); 
//     const TrackToRemove = this.findOne(id);
//     if (!TrackToRemove) throw new NotFoundException('Track not found!');

//     this.tracks = this.tracks.filter(Track => Track.id !== TrackToRemove.id);
//   }
}
