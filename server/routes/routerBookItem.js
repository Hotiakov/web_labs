const router = require('express').Router();
const { findIdItem } = require('./secondaryFunction');
const books = require("../db");
const jsonParser = require('express').json();

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const book = findIdItem(books, id);
    res.render('book', { book: book, title: book.name });
});

router.put('/:id', (req, res)=>{
    const body = {
        ...req.body,
        id: req.params.id,
    };
    res.redirect(`../../?value=${JSON.stringify(body)}`);
});

router.delete('/:id', (req, res)=>{
    res.redirect(`../../?value=${req.params.id}`);
});

module.exports = router;