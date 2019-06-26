require(`dotenv`).config()

const express = require(`express`)
const bodyPaser = require(`body-parser`)
const app = express()
const port = process.env.SERVER_PORT || 3333
const isEmpty = require(`lodash.isempty`)

const mysql = require(`mysql`)
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME

})

app.listen(port, () => {
    console.log(`\n App Listen on ${port}` )
})

app.use(bodyPaser.json())
app.use(bodyPaser.urlencoded({
    extended:false
}))

app.get(`/`, (req, res)=>{
    res.send(`welcome to book manager library`)
})
/**
 * Category
 */
app.get(`/category/`, (req, res)=>{
    // res.send(`welcome to read category`)
    conn.query(`SELECT * FROM tb_category`, (err, results)=>{
        res.json(results)
    })
})

app.post(`/category/`, (req,res) => {
    const category = {
        	category_name: req.body.category_name
    }

    conn.query(`INSERT INTO tb_category SET ?`, category, (err, results) =>{
        if (err) console.log(err)
        res.json(results)
    })
})

app.patch(`/category/:id_category`, (req,res)=>{
    const id_category = req.params.id_category

    const data = {
        	category_name: req.body.category_name
    }
    console.log(data)

    conn.query(`UPDATE tb_category SET ? WHERE id_category=?`, [data, id_category], (err, results)=>{
        if (err) console.log(err)
        res.json(results)

    })
})

app.delete('/category/:idcategory', (req, res) => {
    const idcategory = req.params.idcategory
  
    conn.query('DELETE FROM tb_category WHERE id_category = ?', idcategory, (err, results) => {
      if (err) console.log(err)
      res.json(results)
    })
})

/**
 * Book
 */

app.get(`/book/`, (req, res)=>{
    // res.send(`welcome to read book`)

    var sql_query = `SELECT * FROM tb_book INNER JOIN tb_category ON tb_category.id_category = tb_book.id_category`
     
    if(!isEmpty(req.query.search && req.query.searchc)){
        let search = req.query.search;
        let searchc = req.query.searchc;
        sql_query += ` WHERE tb_book.book_name like '%${search}%' AND tb_category.category_name like '%${searchc}%'`
        var hasilSearch = sql_query;
    }else if (!isEmpty(req.query.search)) {
        let search = req.query.search;
        sql_query += ` WHERE book_name like '%${search}%'`
        var hasilSearch = sql_query;
    }

    conn.query(sql_query, (err, results)=>{
        if (!isEmpty(results)) {
        
            res.status(200).json({
                status:200,
                data: results
            })
        }else{
            res.json({
                status: 404,
                message: "data not Found "
            });
        }
    })
})

app.post(`/book/`, (req,res) => {
    const book = {
            book_name: req.body.book_name,
            book_writer: req.body.book_writer,
            book_location: req.body.book_location,
            id_category: req.body.id_category
    }

    conn.query(`INSERT INTO tb_book SET ?`, book, (err, results) =>{
        if (err) console.log(err)
        res.json(results)
    })
})

app.patch(`/book/:id_book`, (req,res)=>{
    const id_book = req.params.id_book

    const data = {
        book_name: req.body.book_name,
        book_writer: req.body.book_writer,
        book_location: req.body.book_location,
        id_category: req.body.id_category
    }

    conn.query(`UPDATE tb_book SET ? WHERE id_book=?`, [data, id_book], (err, results)=>{
        if (err) console.log(err)
        res.json(results)

    })
})

app.delete('/book/:id_book', (req, res) => {
    const id_book = req.params.id_book
  
    conn.query('DELETE FROM tb_book WHERE id_book = ?', id_book, (err, results) => {
      if (err) console.log(err)
      console.log("data has ben deleted!! mantap")
      res.json(results)
    })
})
