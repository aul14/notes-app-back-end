const { Pool } = require('pg');
const { nanoid } = require('nanoid'); 
const bcrypt = require('bcrypt');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
 
class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    // Verifikasi username, pastikan belum terdaftar.
    await this.verifyNewUsername(username);
    //Bila verifikasi lolos, maka masukkan user baru ke database.
    const id = `user-${nanoid(16)}`;
    // password di hash
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
        values: [id, username, hashedPassword, fullname],
      };
   
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new InvariantError('User gagal ditambahkan');
      }
      return result.rows[0].id;
  }

  async getUserById(userId) {
    const query = {
        text: 'SELECT id, username, fullname FROM users WHERE id = $1',
        values: [userId],
      };
   
    const result = await this._pool.query(query);

      
    if (!result.rows.length) {
        throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  // fungsi untuk memeriksa apakah username sudah digunakan atau belum
  async verifyNewUsername(username) {
    const query = {
        text: 'SELECT username FROM users WHERE username = $1',
        values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
        throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.')
    }
  }

  //membuat fungsi kredensial atau username dan password yang dikirimkan oleh pengguna benar atau tidak
  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah.')
    }

    //Untuk nilai password, kita tampung ke variabel hashedPassword
    const { id, password: hashedPassword } = result.rows[0];

    //fungsi bcrypt.compare untuk mencocokan password dari user dan database
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }
}
module.exports = UsersService;