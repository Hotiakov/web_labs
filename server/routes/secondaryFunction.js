const fs = require("fs");

exports.idGenerator = () => '_' + Math.random().toString(36).substr(2, 9);

exports.findIdItem = (books, id) => {
    for(let i = 0; i < books.length; i++){
        if(books[i].id === id)
            return books[i];
    }
}

exports.findIdIndex = (books, id) => {
    for(let i = 0; i < books.length; i++){
        if(books[i].id === id)
            return i;
    }
    return -1;
};

exports.writeToFile = bookJson => {
    try{
        fs.writeFile('./server/db.json', bookJson, (err) => {
            if (err) throw err;
            console.log('База данных успешно обновлена');
        });
    } catch (err) {
        console.error(err);
    }
}

exports.toDate = (string) => {
    const array = string.split('.');
    const date = new Date(+array[0], +array[1]-1, +array[2]);
    return date.getTime();
}

const sortDate = (a, b) => this.toDate(a.returnDate) - this.toDate(b.returnDate);

exports.filterData = (filterType, data) => {
    let filteredData;
    switch (filterType){
        case "all":
            filteredData = [...data];
            break;
        case "availability":
            filteredData = data.filter(item => item.inLibrary.toLowerCase().trim() === "yes");
            break;
        case "expired":
            filteredData = data.filter(item => (
                item.inLibrary.toLowerCase().trim() === "no" &&
                item.returnDate && this.toDate(item.returnDate) < Date.now()
            ));
            break;
        case "returnDate":
            filteredData = data
                .filter(item => item.inLibrary.toLowerCase().trim() === "no")
                .sort(sortDate);
            break;
    }
    return filteredData;
}