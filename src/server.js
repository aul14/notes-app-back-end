// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

//import nilai notes plugin dan NotesService
const Hapi = require('@hapi/hapi');

//notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');


const init = async () => {
  //buat instance dari NotesService dengan nama notesService
  const notesService = new NotesService();
  const usersService = new UsersService();
  /** daftarkan plugin notes dengan options.service bernilai notesService menggunakan 
   * perintah await server.register tepat sebelum kode await server.start() */

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
 
  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);
 
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();