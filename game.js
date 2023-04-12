import mysql from 'mysql';
import express from 'express';
import bodyParser from 'body-parser'



const app = express();
const port = 3000;

app.use(bodyParser.json())

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "password",
  database: "game"
});

// con.connect(function(err) {
//   if (err) throw err;
//   con.query("SELECT * FROM baju", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
// });

app.get("/game", (req, res) => {
  con.connect((err) => {
    if (err) {
      console.error('Error koneksi ke database: ', err);
      res.status(500).json({ message: 'Gagal terhubung ke database' });
      return;
    }
    con.query("select * from game", function (err, result, fields) {
      res.json(result);
    })
  });
});

app.post("/game", (req, res) => {
  const nama = req.body.nama;
  const tahun = req.body.tahun;
  const kategori = req.body.kategori;


  con.connect((err) => {
    if (err) {
      console.error('Error koneksi ke database: ', err);
      res.status(500).json({ message: 'Gagal terhubung ke database' });
      return;
    }
    const query = 'INSERT INTO game (nama, tahun, kategori) VALUES (?, ?, ?)';
    con.query(query, [nama, tahun, kategori], (err, result, fields) => {
      if (err) {
        console.error('Error query ke database: ', err);
        res.status(500).json({ message: 'Gagal memasukkan data ke dalam tabel' });
        return;
      }
      res.json(result);
    });
  });
});
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
