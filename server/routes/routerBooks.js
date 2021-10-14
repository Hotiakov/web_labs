const router = require('express').Router();
const books = require("../db");
router.get('/', (req, res)=>{
    res.json(books);
});
module.exports = router;