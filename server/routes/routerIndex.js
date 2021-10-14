const router = require('express').Router();
const books = require("../db");
let actualBooks = books;
const {findIdIndex, idGenerator, writeToFile, filterData} = require("./secondaryFunction");

router.get('/', (req, res) => {
    res.render('index', { dbArray: books});
});

router.get('/filter/:filter', (req, res) => {
    const filter = req.params.filter;
    actualBooks = filterData(filter, books);
    res.json(actualBooks);
});

router.post('/', (req, res) => {
    let book = req.body;
    book = {
        ...book,
        inLibrary:"yes",
        id: idGenerator(),
    }
    books.push(book);
    actualBooks = books;
    writeToFile(JSON.stringify(books));
    res.json(actualBooks);
});

router.put('/', (req, res) => {
    const book = JSON.parse(req.query.value);
    const index = findIdIndex(books, book.id);
    if(index !== -1){
        if(books[index].inLibrary === "yes"){
            delete books[index].returnDate;
            delete books[index].readerName;
        }
        books[index] = book;
        const bookJson = JSON.stringify(books);
        writeToFile(bookJson);
    } else {
        console.warn("Книги с таким индексом не существует");
    }
    res.render('index', { dbArray: books});
});

router.delete('/', (req, res)=>{
    const id = req.query.value;
    const index = findIdIndex(books, id);
    const actualIndex = findIdIndex(actualBooks, id);
    if(index !== -1){
        books.splice(index, 1);
        actualBooks.splice(actualIndex, 1);
        writeToFile(JSON.stringify(books));
    } else {
        console.warn("Книги с таким индексом не существует");
    }
    res.json(actualBooks);
});

module.exports = router;