const shelfKey = 'bookshelf'
const [titles, authors, years, isCompleted] = document.querySelectorAll("input")
const [incompleteBookList, completeBookList] = document.querySelectorAll(".book_list")
const inputBook = document.querySelector("#inputBook")
const modal = document.querySelector("[data-modal]")
const modalEdit = document.querySelector("[data-modal-edit]")

const id = generateId()

function getBookShelf(){
    let books = JSON.parse(localStorage.getItem(shelfKey)) || localStorage.setItem(shelfKey, '[]')
    if(books){
        books.map(book =>{
            addBook(book)
        })
    }
}

function getButton(){
    const [...buttonIsCompletes] = document.querySelectorAll('.green')
    const [...removeBookButtons] = document.querySelectorAll('.red')
    buttonIsCompletes.map(buttonIsComplete => {
        buttonIsComplete.addEventListener('click',function(e){
        let booksShelf = JSON.parse(localStorage.getItem(shelfKey))
        let id = this.id
        let book = getBookById(id)
        let {isComplete} = book
        isComplete = !isComplete
        let isCompleted = {isComplete}
        let updateBook = update(booksShelf, id, isCompleted)
        updateBook.map(book => book.id == id ? changeBookShelf(book,id) : '')
        localStorage.setItem(shelfKey, JSON.stringify (updateBook))
        e.preventDefault()
    })
    })
    removeBookButtons.map(removeButton => {
        removeButton.addEventListener('click',function(e){
            let id = this.id
            let book = getBookById(id)
            getModal(book,id)
            e.preventDefault()
        })
    })
}

window.addEventListener('load', function(e){
    getBookShelf()
    getButton()
});

inputBook.addEventListener("submit",function(){
    let books = JSON.parse(localStorage.getItem(shelfKey)) 
    let titleBook = titles.value
    let authorBook = authors.value
    let yearBook = parseInt(years.value)
    let isCompleteBook = isCompleted.checked 
    let book = generateObjectBook(id,titleBook,authorBook,yearBook,isCompleteBook)
    books.push(book)
    localStorage.setItem(shelfKey, JSON.stringify(books))
})


function generateId(){
    return +new Date
}

function generateObjectBook(id,title,author,year,isComplete){
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function editBook(book,id){
    const booksShelf = JSON.parse(localStorage.getItem(shelfKey))
    const [titleInput, authorInput, yearInput, isCompleteInput] = document.querySelectorAll("#editForm input")
    const submitButton = document.querySelector("#editForm")
    const cancelButton = document.querySelector("#cancel")

    submitButton.addEventListener('submit', function(){
        let {title, author, year} = book
        let titleEdited = titleInput.value
        let authorEdited = authorInput.value
        let yearEdited = parseInt(yearInput.value)
        title = titleEdited || title
        author = authorEdited || author
        year = yearEdited || year
        let updated = update(booksShelf, id, {title, author, year})
        localStorage.setItem(shelfKey, JSON.stringify(updated))
        let [...titlesBook] = document.querySelectorAll(`article h3`)
        let titleBook = titlesBook.find(title => title.parentNode.id == id)
        let [...authorsBook] = document.querySelectorAll(`article .author`)
        let authorBook = authorsBook.find(title => title.parentNode.id == id)
        let [...yearsBook] = document.querySelectorAll(`article .year`)
        let yearBook = yearsBook.find(title => title.parentNode.id == id)
        titleBook.innerText = title
        authorBook.innerText = `Penulis: ${author}`
        yearBook.innerText = `Tahun: ${year}`
    })
    cancelButton.addEventListener('click',function(e){
        e.preventDefault()
        modalEdit.close()
        modal.close()
    })
}

function changeBookShelf(book,id){
    const booksShelf = JSON.parse(localStorage.getItem(shelfKey))
    let books = document.querySelectorAll('article.book_item')
    books.forEach(book=> {
        if(book.id === id) book.parentNode.removeChild(book)
    })
    addBook(book)
    const buttonIsCompletes = document.querySelectorAll('.green')
    const removeBookButtons= document.querySelectorAll('.red')
    let buttonIsComplete = [...buttonIsCompletes].find(buttonIsComplete => buttonIsComplete.id == id)
    let removeBookButton = [...removeBookButtons].find(removeBookButton => removeBookButton.id == id)
    buttonIsComplete.addEventListener('click',function(e){
        let {isComplete} = book
        isComplete = !isComplete
        let isCompleted = {isComplete}
        let updateBook = update(booksShelf, id, isCompleted)
        updateBook.map(book => book.id == id ? changeBookShelf(book,id) : '')
        localStorage.setItem(shelfKey, JSON.stringify (updateBook))
    })
    removeBookButton.addEventListener('click',function(e){
        getModal(book, id)
        e.preventDefault()
    })
}

function addBook(book){
    const {title,author,year,isComplete,id} = book
    const article = document.createElement('article')
    const titleBook = document.createElement('h3')
    const authorBook = document.createElement('p')
    const yearBook = document.createElement('p')
    const div = document.createElement('div')
    const buttonIsCompleted = document.createElement('button')
    const removeBook = document.createElement('button')
    article.classList.add('book_item')
    authorBook.classList.add('author')
    yearBook.classList.add('year')
    article.append(titleBook,authorBook,yearBook)
    div.classList.add('action')
    buttonIsCompleted.classList.add('green')
    removeBook.classList.add('red')
    div.append(buttonIsCompleted,removeBook)
    removeBook.innerText = "Hapus Buku"
    article.appendChild(div)
    article.setAttribute('id', id)
    removeBook.setAttribute('id',id)
    buttonIsCompleted.setAttribute('id',id)
    titleBook.innerText = title
    authorBook.innerText = `Penulis: ${author}`
    yearBook.innerText = `Tahun: ${year}`
    if(isComplete){
        buttonIsCompleted.innerText = "Belum selesai di Baca"
        completeBookList.appendChild(article)
    }else if(!isComplete){
        buttonIsCompleted.innerText = "Selesai dibaca"
        incompleteBookList.appendChild(article)
    }
}

function getBookById(id) {
    let booksShelf = JSON.parse(localStorage.getItem(shelfKey))
    let book = booksShelf.find(item => item.id == id)
    return book
}

function update(books, id, updatedData) {
    return books.map(book => book.id == id ? {...book,...updatedData} : book)
}  

function removeBook(book,id){
    let booksShelf = JSON.parse(localStorage.getItem(shelfKey))
    let bookShelf = booksShelf.filter(bookShelf => bookShelf.id !== book.id)
    localStorage.setItem(shelfKey, JSON.stringify(bookShelf))
    let books = document.querySelectorAll('article.book_item')
    books.forEach((book)=> {
        if(book.id === id) book.parentNode.removeChild(book)
    })
}

const searchInput = document.querySelector('#searchBookTitle')
const searchBook = document.querySelector('#searchBook')
searchBook.addEventListener('submit',function(e){
    e.preventDefault()
    let title = searchInput.value
    let booksShelf = JSON.parse(localStorage.getItem(shelfKey))
    let [...booksArticle] = document.querySelectorAll('.book_item')
    let books = booksShelf.filter(book => 
        book.title.toLowerCase().includes(title.toLowerCase()) 
    )
    booksArticle.map(bookArticle => {
        let parent = bookArticle.parentNode
        parent.removeChild(bookArticle)
    })
    if(title){
        books.map(book => addBook(book))
    }
    else{
        booksShelf.map(bookShelf => addBook(bookShelf))
    }
    getButton()
})

function getModal(book,id){
    modal.showModal()
    let modalRemoveButton = document.querySelector(".modalRemoveButton")
    let modalEditButton = document.querySelector(".modalEditButton")
    modalRemoveButton.addEventListener('click', function(){
        removeBook(book,id)
        modal.close()
    })
    modalEditButton.addEventListener('click',function() {
        modal.close()
        editBook(book,id)
        modalEdit.showModal()
    })
}