import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';

const app = express();
const port = 5000;

app.use(bodyParser.json());

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'game'
});


app.get('/kendaraan/:id?', (req, res) => {
    let id = [];
    let query = `select * from kendaraan`

    if (req.params.id) {
        query += ` where id = ?`
        id = req.params.id
    };

    con.query(query, id, (err, result, fields) => {
        if (err) {
            console.error(err)
            res.json({ message: "Gagal menampilkan data" })
        };
        res.json(result);
    });
});

app.propfind('/kendaraan/search', (req, res) => {
    const { nama, warna, jenis, nopol } = req.query;
    let query = `select * from kendaraan where`

    if (nama && warna && jenis && nopol) {
        query += ` nama like '%${nama}%', warna like '%${warna}%' and like '%${jenis}%' and nopol like '%${nopol}%'`
    } else {
        if (nama) {
            query += ` nama like '%${nama}%' `
        };

        if (warna) {
            query += ` warna like '%${warna}%' `
        };

        if (jenis) {
            query += ` jenis like '%${jenis}%' `
        };

        if (nopol) {
            query += ` nopol like '%${nopol}%' `
        };
    };

    con.query(query, (err, result, fields) => {
        if (err) {
            console.error(err)
            res.json({ message: "Url Yang Dimasukkan Salah" })
        };
        res.json(result);
    });
});

app.post('/kendaraan', (req, res) => {
    const { nama, warna, jenis, nopol } = req.body;
    let query = `insert into kendaraan (nama, warna, jenis, nopol) values ('${nama}', '${warna}', '${jenis}', '${nopol}') `

    con.query(query, (err, result, fields) => {
        if (err) {
            console.error(err)
            res.json({ message: "Gagal memasukkan Data" })
        };
        res.json(result);
    });
});


app.post('/kendaraan/update/:id', (req, res) => {
    const { nama, warna, jenis, nopol } = req.body;
    let id = req.params.id;
    let query = `update kendaraan set`


    if (nama && warna && jenis && nopol) {
        query += ` nama = '${nama},' warna = '${warna}', jenis = '${jenis}', nopol = '${nopol}'`
    } else {
        
        if (nama) {
            query += ` nama = '${nama},'`
        };

        if (warna) {
            query += ` warna = '${warna}',`
        };

        if (jenis) {
            query += ` jenis = '${jenis}',`
        };

        if (nopol) {
            query += ` nopol = '${nopol}',`
        };

        query = query.slice(0, -1) + ' ';
        query += ` where id = ?`;
    };

    con.query(query, id, (err, result, fields) => {
        if (err) {
            console.error(err)
            res.json({message: "Gagal Mengupdate Data"})
        };
        res.json(result);
    });
});

app.delete('/kendaraan/delete/:id', (req, res) => {
    let id = req.params.id;
    let query = `delete from kendaraan where id = ?`

    con.query(query, id, (err, result, fields) => {
        if (err) {
            console.error(err)
            res.json({message: "Gagal Menghapus Data"})
        };
        res.json(result);
    });
});

