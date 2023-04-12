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

                                     /* MENCARI DAN MENAMPILKAN */

//  Menampilkan artikel berdasarkan pencarian
app.get('/search/artikel', (req, res) => {
  const { judul } = req.query;
  let query = `select from artikel where judul like '%${judul}%'`

  con.query(query, (err, result, fields) => {
    if (err) {
      console.error(err)
      res.json({ message: "Artikel Tidak Bisa Ditemukan." })
    };
    res.json(result)
  });
});

// Menampilkan artikel sesuai urutan yang diminta = CHATGPT =
app.get('/artikel/search-by', (req, res) => {
  const { urutan, limit } = req.query;
  let query = 'SELECT * FROM artikel';

  if (urutan === 'terbaru') {
    query += ' ORDER BY tanggal DESC';
  } else if (urutan === 'terlama') {
    query += ' ORDER BY tanggal ASC';
  } else if (urutan === 'terpopuler') {
    query += ' ORDER BY views DESC';
  }

  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  con.query(query, (err, result, fields) => {
    if (err) {
      console.error(err);
      res.json({ message: 'Terjadi kesalahan saat memproses permintaan' });
    } else {
      res.json(result);
    }
  });
});

// - Menampilkan semua artikel berdasarkan kategori yang terpilih
app.get('/kategori/artikel', (req, res) => {
    const { kategori } = req.query;
    const query = `SELECT artikel.*, kategori.nama AS kategori_nama FROM artikel JOIN kategori ON (artikel.kategori_id = kategori.id WHERE kategori.nama LIKE '%${kategori}%')`; /* CHATGPT */

    con.query(query, (err, result, fields) => {
        if (err) {
            console.error(err)
            res.json({ message: "Artikel dengan kategori " + kategori + " tidak ditemukan"})
        };
        res.json(result)
    });
});

//  Menampilkan semua artikel - Menampilkan artikel berdasarkan id
app.get('/artikel/list/:id?', (req, res) => {
  let id = [];
  let query = `select * from artikel`

  if (req.params.id) {
    query += 'where id = ?'
    id = parseInt(req.params.id)
  };

  con.query(query, id, (err, result, fields) => {
    if (err) {
      console.error(err)
      res.json({ message: "Artikel Tidak Bisa Ditemukan." })
    };
    res.json(result);
  });
});
                                  /* END OF MENCARI DAN MENAMPILKAN */

                                  /* MEMEMBUAT DAN MENAMBAH */

// - Membuat artikel baru
app.post('/add/artikel', (req, res) => {
  const { judul, isi } = req.body;
  let query = `insert into artikel (title, isi) values ('${judul}', '${isi}')`

  con.query(query, (err, result, fields) => {
    if (err) {
      console.error(err)
      res.json({ message: "Gagal Menambahkan Artikel" })
    };
    res.json(result);
  });
});


// Menambah Kategori
app.post('/add/kategori', (req, res) => {
  const { nama } = req.body;
  let query = `insert into kategori (nama) values ('${nama}')`

  con.query(query, (err, result, fields) => {
    if (err) {
      console.error(err)
      res.json({ message: "Gagal Menambahkan Kategori" })
    };
    res.json(result);
  });
});

                                /* END OF MEMMBUAT DAN MENAMBAH */

                                 /* EDIT  */

// edit artikel 
app.post('/update/artikel/:id', (req, res) => {
  const { judul, isi } = req.body;
  let id = req.params.id;
  let query = `update artikel set`

  if (judul && isi) {
    query += `judul = '${judul}', isi = '${isi}' where id = ? `
  } else {

    if (judul) {
      query += `judul = '${title}',`
    };

    if (isi) {
      query += `kategori = '${isi}',`
    };
  };

  query = query.slice(0, -1) + ' ';
  query += 'where id = ?'

  con.query(query, id, (err, result, fields) => {
    if (err) {
      console.error(err)
      res.json({ message: "Gagal Mengubah Artikel" })
    };
    res.json(result);
  });
});

// edit kategori 
app.post('/update/kategori/:id', (req, res) => {
    const {nama} = req.body;
    let id = parseInt(req.params.id)
    let query = `update kategori set nama = '${nama}' where id = ${id}`

    con.query(query, id, (err, result, fields) => {
      if (err) {
        console.error(err)
        res.json({ message: "Gagal Mengubah Kategori" })
      };
      res.json(result);
    });
});

                                /* END OF EDIT */
                                
                                /* DELETE */
// Menghapus artikel
app.delete('/delete/artikel/:id', (req, res) => {
  let id = parseInt(req.params.id)
  let query = `delete from artikel where id = ${id}`
  
  con.query(query, (err, result, fields) => {
    if (err) {
      console.error(err);
      res.json({ message: "Gagal Menghapus Artikel" });
    };
    res.json(result);
  });
});

// Menghapus kategori
app.delete('/delete/kategori/:id', (req, res) => {
  let id = parseInt(req.params.id)
  let query = `delete from kategori where id = ${id}`
  
  con.query(query, (err, result, fields) => {
    if (err) {
      console.error(err);
      res.json({ message: "Gagal Menghapus Kategori" });
    };
    res.json(result);
  });
});
                               /* END OF DELETE */   

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
