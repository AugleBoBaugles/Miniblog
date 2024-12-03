/* Creating the App */

const express = require('express');
const PORT = 3000;
const mariadb = require('mariadb');


const app = express();

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'N0pressure!',
    database: 'blog'
})

async function connect(){
    try {
        let conn = await pool.getConnection();
        console.log('Connected to the database');
        return conn;
    } catch (err) {
        console.log('Error connecting to the database: ' + err);
    }
}

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// Submission Route
const posts = [];
const adminPosts = [];

// add data list later

app.get('/', (req, res) => {
    res.render('home', {data: {}, errors: []});
})

app.get('/entries', async (req, res) => {
    const conn = await connect();
    
    // added await here
    const rows = await conn.query('SELECT * FROM posts ORDER BY created_at DESC;');

    /* console.log(typeof rows);
    console.log(rows) */

    res.render('entries', {posts: rows});
})

app.get('/admin-posts', async (req, res) => {
    const conn = await connect();
    const adminPosts = await conn.query('SELECT * FROM posts WHERE author = "Admin" ORDER BY created_at DESC;');


    res.render('admin-posts', {data: adminPosts})
})

app.post('/submit', async (req, res) => {
    /* // get current date
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hour = date.getHours();
    let minutes = date.getMinutes();

    const newPost = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        time: `${hour}:${minutes} | ${day}-${month}-${year}`
    }; 
    
    posts.push(newPost);
    */

    const data = req.body;

    // set up validation
    let isValid = true;
    let errors = [];

    // -- title validation --
    // title is empty
    if (data.title.trim() === ''){
        isValid = false;
        errors.push('Title is Required');
    }

    // title has 5 or less chars
    if (data.title.trim().length <= 5){
        isValid = false;
        errors.push('Title must be more than 5 characters.');
    }

    // content is empty
    if (data.content.trim() === ''){
        isValid = false;
        errors.push('Content is required.');
    }

    // change author to NULL if empty
    if (data.author.trim() === ''){
        data.author = 'NULL';
    }

    if(!isValid){
        res.render('home', {data: data, errors: errors});
        return;
    }

    const conn = await connect();

    conn.query(`
        INSERT INTO posts (author, title, content)
        VALUES ('${data.author}', '${data.title}', '${data.content}');
    `);

    res.render('confirmation', {data: data});

});



app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

