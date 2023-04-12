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

con.connect((err) => {
    if (err) {
        console.error('Gagal terhubung ke database', err)
        res.status(500).json({ meessage: 'Gagal terhubung ke database' })
    };
});

app.get('/buah/:id?', (req, res) => {
    let query = 'Select * from buah';
    let id = [];

    if (req.params.id) {
        query += ' where id = ?'
        id = [req.params.id]
    };

    con.query(query, id, (err, result, fields) => {
        if (err) {
            console.error('Gagal menampilkan database', err)
            res.status(500).json({ message: 'Gagal menampilkan data' });
            return;
        };
        res.json(result);
    });
});


/* KODE INI HANYA MENCARI SESUAI PARAMETER NAMA DAN COLUMN NAMA, PERTANYAAN BAGAIMANA JIKA INGIN MENCARI SESUAI DENGAN COLUMN LAIN */
app.get('/buah/search/:nama', (req, res) => {
    const nama = req.params.nama;
    let query = `select * from buah where nama like '%${nama}%'`
    
    con.query(query, (err, result, fields) => {
        if(err) {
            console.error(err);
            res.status(404).json({ message: "Data tidak ditemukan"})
            return;
        };
        res.json(result);
    });
});


app.post('/buah', (req, res) => {
    const { nama, kondisi, stok, harga } = req.body;
    const query = `insert into buah (nama, kondisi, stok, harga) values ('${nama}', '${kondisi}', ${stok}, ${harga})`;

    con.query(query, (err, result, fields) => {
        if (err) {
            console.error('Gagal memasukan ke database', err);
            res.status(500).json({ message: 'Gagal memasukan data' });
            return;
        };
        res.json(result);
    });
});

// kode ini untuk mengupdate data id yang di pilih sebagai parameter
app.put('/buah/update/:id', (req, res) => {
    const { nama, kondisi, stok, harga } = req.body;
    let id = req.params.id;
    let query = `update buah set`

/* kondisional ini untuk menentukan column mana yang akan di update, if pertama untuk mengupdate semua column, 
menggunakan && maka semua nilai harus bernilai true, jika false maka if selanjutnya akan di jalankan sesuai parameter nya 
NOTE: KODE INI HANYA BEKERJA JIKA MENGUPDATE SEMUA DATA COLUMN ATAU HANYA 1 COLUMN SAJA  */
    if (nama && kondisi && stok && harga) {
        query += ` nama = '${nama}', kondisi = '${kondisi}', stok = ${stok}, harga = ${harga} where id = ?`
    } else if (nama) {
        query += ` nama = '${nama}'  where id = ?`
    } else if (kondisi) {
        query += ` kondisi = '${kondisi}' where id = ?`
    } else if (stok) {
        query += ` stok = ${stok} where id = ?`
    } else if (harga) {
        query += ` harga = ${harga} where id = ?`
    };

    con.query(query, id, (err, result, fields) => {
        if (err) {
            console.error('Gagal mengupdate data', err)
            res.status(404).json({ message: "Gagal mengupdate data" })
            return;
        };
        res.json(result);
    });
});


// kode ini hanya menghapus id yang di masukan sebagai parameter
app.delete('/buah/:id', (req, res) => {
    let query = 'delete from buah where id = ?'
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