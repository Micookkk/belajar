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

con.connect((err) => {
    if (err) {
        console.error('Gagal terhubung ke database', err)
        res.status(500).json({})
        return;
    };
});

app.get('/user/:id?', (req, res) => {
    let query = 'select * from users';
    let id = []

    if (req.params.id) {
        query += ' where user_id = ?'
        id = req.params.id
    };

    con.query(query, id, (err, result, fields) => {
        if (err) {
            console.error(err)
            res.status(500).json({ message: "Gagal menampilkan data yang dipilih" })
            return;
        };
        res.json(result);
    });
});

app.propfind('/user/search', (req, res) => {
    let { user_name, user_password, user_email } = req.query;
    let query = `select * from users where`

    if (user_name && user_email) {
        query += ` user_name like '%${user_name}%' and user_email like '%${user_email}%'`
    } else {

        if (user_name) {
            query += ` user_name like '%${user_name}%'`
        };

        if (user_email) {
            query += ` user_email like '%${user_email}%'`
        };
    };

    con.query(query, (err, result, fields) => {
        if (err) {
            console.error(err)
            res.json({ message: `Salah memasukan url` })
            return;
        };
        res.json(result);
    });
});

app.post('/user', (req, res) => {
    const { user_name, user_password, user_email } = req.body;
    let query = `insert into users (user_name, user_password, user_email) values ('${user_name}', '${user_password}', '${user_email}')`;

    con.query(query, (err, result, fields) => {
        if (err) {
            console.error(err)
            return;
        };
        res.json(result);
    });
});

app.post('/user/update/:id', (req, res) => {
    const { user_name, user_password, user_email } = req.body;
    let user_id = req.params.id;
    let query = `update users set`

    if (user_name && user_password && user_email) {
        query += ` user_name = '${user_name}', user_password = '${user_password}', user_email = '${user_email}' where user_id = ?`
    } else {

        let whereClause = `where user_id = ${user_id}`

        if (user_name) {
            query += ` user_name = '${user_name}',`
        };

        if (user_password) {
            query += ` user_password = '${user_password}',`
        };

        if (user_email) {
            query += ` user_email = '${user_email}',`
        };

        query = query.slice(0, -1) + ' ';
        query += whereClause;
    };
    con.query(query, user_id, (err, result, fields) => {
        if (err) {
            console.error(err)
            res.json({ message: "Gagal mengupdate data"})
        };
        res.json(result);
    });
});


app.delete('/user/:id', (req, res) => {
    let query = `delete from users where user_id = ?`
    let id = req.params.id;

    con.query(query, id, (err, result, fields) => {
        if (err) {
            console.error(err);
            return;
        };
        res.json(result);
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});