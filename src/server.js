// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

//import nilai notes plugin dan NotesService
const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/inMemory/NotesService');
const NotesValidator = require('./validator/notes');


const init = async () => {
  //buat instance dari NotesService dengan nama notesService
  const notesService = new NotesService();
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
 
  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator
    },
  });
 
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};
 
init();