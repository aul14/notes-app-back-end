const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class NotesService {
  constructor() {
    this._notes = [];
  }
 
  //fungsi create
  addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
 
    const newNote = {
      title, tags, body, id, createdAt, updatedAt,
    };
 
    this._notes.push(newNote);

    //fungsi filter untuk mencari berdasarkan id catatan yang baru saja dibuat 
    // (newNote), kemudian menyimpan hasilnya dalam variabel isSuccess
    const isSuccess = this._notes.filter((note) => note.id === id).length > 0;

    /*
    Lakukan pengecekan pada variabel isSuccess.
    Jika bernilai false, maka buat fungsi addNotes membangkitkan Error. 
    Sebaliknya (jika bernilai true), 
    kembalikan fungsi dengan nilai id catatan baru.
    */
    if (!isSuccess) {
        throw new InvariantError('Catatan gagal ditambahkan');
      }
   
      return id;  
  }

  //fungsi read all
  getNotes() {
    return this._notes;
  }

  //fungsi read by id
  getNoteById(id) {
    //fungsi filter untuk mencari berdasarkan id catatan
    const note = this._notes.filter((n) => n.id === id)[0];
    if (!note) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return note;
  }

  // fungsi edit by id
  editNoteById(id, { title, body, tags }) {
    const index = this._notes.findIndex((note) => note.id === id);
 
    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }
 
    const updatedAt = new Date().toISOString();
 
    this._notes[index] = {
      ...this._notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
  }

  //fungsi hapus by id
  deleteNoteById(id) {
    const index = this._notes.findIndex((note) => note.id === id);
    if (index === -1) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
    this._notes.splice(index, 1);
  }
}
module.exports = NotesService;