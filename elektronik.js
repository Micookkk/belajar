import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';

const app = express();
const port = 3000;

app.use(bodyParser.json());

/* meng-inisialisasi mysql.createConnection sebagai con */
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "password",
    database: "game"
});

/* con.connect berfungsi untuk terhubung ke database(db), meletakannya di global scope agar bisa di akses oleh semua route
tanpa harus membuatnya di setiap isi route */
con.connect((err) => {
    if (err) {
        console.error('Gagal terhubung ke database', err);
        res.status(500).json({ message: 'Gagal terhubung ke database' });
        return;
    }
})

app.get('/elektronik/:id?', (req, res) => {
    // variabel query menampung nilai sql syntax yang akan di masukan ke con.query
    let query = 'select * from elektronik';

    // variabel params menampung isi parameter dari route
    let id = [];


    /* kondisional ini untuk mengecek apakah route mempunyai parameter(id) atau tidak, jika ada maka 
    isi variabel query akan menjadi 'select * from elektronik where id = ?' dan variabel params akan menampung parameter (id). 
    jika tidak mempunyai parameter kode ini tidak akan di jalankan*/
    if (req.params.id) {
        query += ' where id = ?';
        id = [req.params.id]
    };


    /* con.query adalah penghubung permintaan informasi ke database(db), yang berisi syntax sql yang sudah di inisialisasi sebagai query 
    dan values sebagai id, dan callback result sebagai menampung hasil nilai permintaan yang sudah di minta ke db,
    dan dipanggil menggunakan res.json(result) */
    con.query(query, id, (err, result, fields) => {
        if (err) {
            console.error('Gagal memilih data ke database', err);
            res.status(500).json({ message: 'Gagal menampilkan data' });
        };
        res.json(result);
    });
});



app.post('/elektronik', (req, res) => {
    /* seperti objek literal yang biasa ku buat tetapi lebih simpel dan tidak mempunyai nama */
    const { nama, watt, harga } = req.body;

    /* variabel query menampung nilai sql syntax yang akan di masukan ke con.query,
    tetapi disini values nya sudah di isi dengan req.body yang sudah di inisialisasi sesuai dengan nama column,
    yang mana nilai nya akan di isi oleh client  */
    const query = `insert into elektronik (nama, watt, harga) values ('${nama}', '${watt}', '${harga}')`;


    /* con.query sebagai penghubung ke database(db), yang berisi syntax sql yang sudah di inisialisasi sebagai query, 
    dan callback result sebagai menampung hasil nilai permintaan yang sudah di minta ke db,
    dan dipanggil menggunakan res.json(result), dan err sebagai menampung error */
    con.query(query, (err, result, fields) => {
        if (err) {
            console.error('Gagal memasukan data', err);
            res.status(500).json({ message: 'Gagal memasukan data'});
            return;
        };
        res.json(result);
    });
});

// Kode ini akan menghapus semua isi data jika dijalankan tanpa id
app.delete('/elektronik/:id?', (req, res) => {
    // variabel query menampung nilai sql syntax yang akan di masukan ke con.query
    let query = `delete from elektronik`;

     // variabel params menampung isi parameter dari route
    let params = [];


    /* kondisional ini untuk mengecek apakah route mempunyai parameter(id) atau tidak, jika ada maka 
    isi variabel query akan menjadi 'delete * from elektronik where id = ?' dan variabel params akan menampung parameter (id).
    jika tidak mempunyai parameter kode ini tidak akan di jalankan */
    if (req.params.id) {
        query += ' where id = ?'
        params = [req.params.id];
    };


    /* con.query adalah penghubung permintaan informasi ke database(db), yang berisi syntax sql yang sudah di inisialisasi sebagai query 
    dan values sebagai params, dan callback result sebagai menampung hasil nilai permintaan yang sudah di minta ke db,
    dan dipanggil menggunakan res.json(result) */
    con.query(query, params, (err, result, fields) => {
        if(err) {
            console.error('Gagal menghapus data', err);
            res.status(500).json({ message: 'Gagal menghapus data'});
        };
        res.json(result);
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});
