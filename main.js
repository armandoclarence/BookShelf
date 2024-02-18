const shelfKey = 'bookshelf'
const themeKey = 'theme'
const [incompleteBookList, completeBookList] = document.querySelectorAll(".book_list")
const inputBook = document.querySelector("#inputBook")
const modal = document.querySelector("[data-modal]")
const modalEdit = document.querySelector("[data-modal-edit]")
const books = JSON.parse(localStorage.getItem(shelfKey)) || localStorage.setItem(shelfKey, '[]')  
const toggleTheme = document.querySelector('.toggle')
const preferDark = (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
const preferLight = (window.matchMedia('(prefers-color-scheme: light)').matches ? 'dark' : 'light')

console.log(preferLight)
// toggleTheme.classList.toggle(preferDark)
// toggleTheme.classList.toggle(preferLight)


function preferenceDark() {
  const currentTheme = localStorage.getItem(themeKey) || preferDark
  
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem(themeKey, currentTheme);
  
  toggleTheme.classList.toggle(preferDark);
  toggleTheme.classList.toggle(preferLight);
}

toggleTheme.addEventListener('click', preferenceDark)
window.addEventListener('change', preferenceDark)
window.addEventListener('load', preferenceDark)

const id = generateId()

function getBookShelf(){
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
      const id = this.parentNode.parentNode.id
      const book = getBookById(id)
      let {isComplete} = book
      console.log(book)
      isComplete = !isComplete
      console.log(isComplete)
      const isCompleted = {isComplete}
      const updateBook = update(books, id, isCompleted)
      updateBook.map(book => book.id === parseInt(id) ? changeBookShelf(book,id) : '')
      localStorage.setItem(shelfKey, JSON.stringify (updateBook))
      e.preventDefault()
    })
  })
  removeBookButtons.map(removeButton => {
    removeButton.addEventListener('click',function(e){
      const id = this.parentNode.parentNode.id
      const book = getBookById(id)
      getModal(book,id)
      e.preventDefault()
    })
  })
}

window.addEventListener('load', function(e){
  getBookShelf()
  getButton()
});

inputBook.addEventListener("submit",function(e){
  e.preventDefault()
  const formBook = new FormData(inputBook)
  const titleBook = formBook.get('title') 
  const authorBook = formBook.get('author') 
  const yearBook = formBook.get('year') 
  const isCompleteBook = formBook.get('completedRead') === 'on' ? true : false;
  const book = generateObjectBook(id,titleBook,authorBook,yearBook,isCompleteBook)
  books.push(book)
  localStorage.setItem(shelfKey, JSON.stringify(books))
  addBook(book)
  getButton()
  console.log(formBook)
  console.log(titleBook, authorBook, yearBook, isCompleteBook)
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
  const [titleInput, authorInput, yearInput, isCompleteInput] = document.querySelectorAll("#editForm input")
  const submitButton = document.querySelector("#editForm")
  const cancelButton = document.querySelector("#cancel")

  submitButton.addEventListener('submit', function(){
    let {title, author, year} = book
    const titleEdited = titleInput.value
    const authorEdited = authorInput.value
    const yearEdited = parseInt(yearInput.value)
    title = titleEdited || title
    author = authorEdited || author
    year = yearEdited || year
    const updated = update(books, id, {title, author, year})
    localStorage.setItem(shelfKey, JSON.stringify(updated))
    const [...titlesBook] = document.querySelectorAll(`article h3`)
    const titleBook = titlesBook.find(title => title.parentNode.id === parseInt(id))
    const [...authorsBook] = document.querySelectorAll(`article .author`)
    const authorBook = authorsBook.find(title => title.parentNode.id === parseInt(id))
    const [...yearsBook] = document.querySelectorAll(`article .year`)
    const yearBook = yearsBook.find(title => title.parentNode.id === parseInt(id))
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

function changeBookShelf(book, id) {
  const booksItem = document.querySelectorAll('article.book_item')
  booksItem.forEach(book => {
    if (book.id === parseInt(id)) book.parentNode.removeChild(book)
  })
  addBook(book)
  const buttonIsCompletes = document.querySelectorAll('.green')
  const removeBookButtons = document.querySelectorAll('.red')
  const buttonIsComplete = [...buttonIsCompletes].find(buttonIsComplete => {
    return buttonIsComplete.id === parseInt(id)
  })
  const removeBookButton = [...removeBookButtons].find(removeBookButton => {
    return removeBookButton.id === parseInt(id)
  })
  buttonIsComplete.addEventListener('click',function(e){
    const {isComplete} = book
    isComplete = !isComplete
    const isCompleted = {isComplete}
    const updateBook = update(books, id, isCompleted)
    updateBook.map(book => book.id === parseInt(id) ? changeBookShelf(book,id) : '')
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
  titleBook.innerText = title
  authorBook.innerText = `Penulis: ${author}`
  yearBook.innerText = `Tahun: ${year}`
  if(isComplete){
    buttonIsCompleted.innerText = "Belum selesai di Baca"
    completeBookList.appendChild(article)
  }else{
    buttonIsCompleted.innerText = "Selesai dibaca"
    incompleteBookList.appendChild(article)
}
}

function getBookById(id) {
  const book = books.find(item => item.id === parseInt(id))
  return book
}

function update(books, id, updatedData) {
  return books.map(book => book.id === parseInt(id) ? {...book,...updatedData} : book)
}  

function removeBook(book,id){
  const bookShelf = books.filter(bookShelf => bookShelf.id !== book.id)
  console.log(bookShelf)
  localStorage.setItem(shelfKey, JSON.stringify(bookShelf))
  const booksItem = document.querySelectorAll('article.book_item')
  booksItem.forEach((book)=> {
    if(book.id === parseInt(id)) book.parentNode.removeChild(book)
  })
}

const searchInput = document.querySelector('#searchBookTitle')
const searchBook = document.querySelector('#searchBook')
searchBook.addEventListener('submit',function(e){
  e.preventDefault()
  const title = searchInput.value
  const [...booksArticle] = document.querySelectorAll('.book_item')
  const booksItem = books.filter(book => 
    book.title.toLowerCase().includes(title.toLowerCase()) 
  )
  booksArticle.map(bookArticle => {
    const parent = bookArticle.parentNode
    parent.removeChild(bookArticle)
  })
  if(title){
    books.map(book => addBook(book))
  }
  else {
    booksShelf.map(bookShelf => addBook(bookShelf))
  }
  getButton()
})

function getModal(book,id){
  modal.showModal()
  const modalRemoveButton = document.querySelector(".modalRemoveButton")
  const modalEditButton = document.querySelector(".modalEditButton")
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