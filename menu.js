import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';

const app = express();
const port = 3000;

app.use(bodyParser.json());


const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: "password",
  database: "game"
});

// apa hubungan error dengan /menu:id
// JAWABAN NOTE BUAH.JS DATA, SEARCH DATA
app.get('/menu/search-data', (req, res) => {
  let { nama, kategori, harga } = req.query;
  let query = `select * from menu where`

  if (nama && kategori) {
    query += ` nama like '%${nama}%' and kategori like '%${kategori}%' `
  } else {

  if (nama) {
    query += ` nama like '%${nama}%' `;
  };

  if (kategori) {
    query += ` kategori like '%${kategori}%' `;
  };

  if (harga) {
    query += ` harga = ${harga} `
  }

};

  con.query(query, (err, result, fields) => {
    if (err) {
      console.error(err)
      res.json({ message: "URL YANG DI MASUKAN SALAH" })
    };
    res.json(result);
  });
});

app.get('/menu/:id?', (req, res) => {
  let query = `select * from menu`;
  let id = [];

  if (req.params.id) {
    query += ' where id = ?'
    id = parseInt(req.params.id)
  };


  con.query(query, id, (err, result, fields) => {
    if (err) {
      console.error(err);
      res.json({ message: "Tidak bisa menampilkan data" })
      return;
    };
    res.json(result);
  });
});



app.post('/menu', (req, res) => {
  const { nama, kategori, harga } = req.body;
  let query = `insert into menu (nama, kategori, harga) values ('${nama}', '${kategori}', ${harga} )`

  con.query(query, (err, result, fields) => {
    if (err) {
      console.error(err)
      res.json({ message: "Gagal Tidak bisa menambahkan menu" })
      return;
    };
    res.json(result);
  });
});

// JAWABAN DARI NOTE BUAH.JS UPDATE DATA
app.post('/menu/update/:id', (req, res) => {
  const { nama, kategori, harga } = req.body;
  let id = req.params.id;
  let query = `update menu set `

  if (nama && kategori && harga) {
    query += ` nama = '${nama}', kategori = '${kategori}', harga = ${harga} where id = ?`
  } else {

    let whereClause = `where id = ${id}`; // tambahkan where clause untuk kondisi update <-- chatGPT CODE

    if (nama) {
      query += ` nama = '${nama}',`;
    };

    if (kategori) {
      query += ` kategori = '${kategori}',`;
    };

    if (harga) {
      query += ` harga = ${harga},`;
    };

    query = query.slice(0, -1) + ' '; // hapus koma terakhir pada statement SQL <-- chatGPT CODE
    query += whereClause;
  };

  con.query(query, id, (err, result, fields) => {
    if (err) {
      console.error(err)
      res.json({ message: "Gagal mengupdate data" })
      return;
    }
    res.json(result);
  });
});

app.delete('/menu/:id', (req, res) => {
  let query = 'delete from menu where id = ?'
  let id = req.params.id

  con.query(query, id, (err, result, fields) => {
    if (err) {
      console.error('Gagal menghapus data', err);
      res.status(500).json({ message: 'Gagal menghapus data' });
      return;
    };
    res.json(result);
  });
});


app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
