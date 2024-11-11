# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

Following models are available:

1. User (with attributes):

```
interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}
```

2. Artist (with attributes):

```
interface Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}
```

3. Track (with attributes):

```
interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}
```

4. Album (with attributes):

```
interface Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
```

5. Favorites (with attributes):

```
interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}
```

Routes:
Users (/user route)

- GET /user - get all users
- GET /user/:id - get single user by id
- POST /user - (login, password)
- PUT /user/:id - (oldPassword, newPassword)
- DELETE /user/:id - delete user

Tracks (/track route)

- GET /track - get all tracks
- GET /track/:id - get single track by id
- POST /track - create new track
- PUT /track/:id - update track info
- DELETE /track/:id - delete track

Artists (/artist route)

- GET /artist - get all artists
- GET /artist/:id - get single artist by id
- POST /artist - create new artist
- PUT /artist/:id - update artist info
- DELETE /artist/:id - delete artist

Albums (/album route)

- GET /album - get all albums
- GET /album/:id - get single album by id
- POST /album - create new album
- PUT /album/:id - update album info
- DELETE /album/:id - delete album

Favorites

- GET /favs - get all favs
- POST /favs/track/:id - add track to the favorites
- DELETE /favs/track/:id - delete track from favorites
- POST /favs/album/:id - add album to the favorites
- DELETE /favs/album/:id - delete album from favorites
- POST /favs/artist/:id - add artist to the favorites
- DELETE /favs/artist/:id - delete artist from favorites

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
