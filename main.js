const shelfKey = 'bookshelf'
const [incompleteBookList, completeBookList] = document.querySelectorAll(".book_list")
const inputBook = document.querySelector("#inputBook")
const modal = document.querySelector("[data-modal]")
const modalEdit = document.querySelector("[data-modal-edit]")
const books = JSON.parse(localStorage.getItem(shelfKey)) || localStorage.setItem(shelfKey, '[]')  
const toggleTheme = document.querySelector('.toggle')

// dark mode
function toggleDarkModePreference() {
  document.documentElement.classList.toggle('dark-mode');
  toggleTheme.classList.toggle('dark')
}

function checkDarkModePreference() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.log('User prefers dark mode');
    toggleTheme.classList.add('dark')
    document.documentElement.classList.add('dark-mode');
  } else {
    console.log('User prefers light mode');
    toggleTheme.classList.remove('dark')
    document.documentElement.classList.remove('dark-mode');
  }
}

checkDarkModePreference();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDarkModePreference);

toggleTheme.addEventListener('click', toggleDarkModePreference)

// bookshelf
window.addEventListener('load', function(){
  getBookShelf()
  getEventButton()
});

function getBookShelf(){
  if(books){
    books.map(book =>{
      addBook(book)
    })
  }
}

function removeBookFromPage(id) {
  const booksItem = document.querySelectorAll('article.book_item')
  booksItem.forEach(book => {
    if (book.id === id) {
      book.parentNode.removeChild(book)
    }
  })
}

function containsOnlySpaces(value) {
  const regex = /^\s*$/;
  return regex.test(value);
}

function getBookById(id) {
  const books = JSON.parse(localStorage.getItem(shelfKey))
  const book = books.find(book => book.id === parseInt(id))
  return book
}

function updateBook(id, updatedBook) {
  const books = JSON.parse(localStorage.getItem(shelfKey))
  return books.map(book => book.id === parseInt(id) ? {...book,...updatedBook} : book)
}  

function removeBook(id) {
  const books = JSON.parse(localStorage.getItem(shelfKey))
  const bookShelf = books.filter(book => book.id !== parseInt(id))
  removeBookFromPage(id)
  localStorage.setItem(shelfKey, JSON.stringify(bookShelf))
}

function generateId(){
  return +new Date
}

function generateObjectBook(id,title,author,year,isCompleted){
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

function updateCompletedButton() {
  const id = this.parentNode.parentNode.id
  const { isCompleted } = getBookById(id)
  const updatedBook = updateBook(id, {isCompleted: !isCompleted})
  updatedBook.map(book => book.id === parseInt(id) ? changeBookShelf(book,id) : '')
  localStorage.setItem(shelfKey, JSON.stringify(updatedBook))
}

function updateRemoveButton() {
  const id = this.parentNode.parentNode.id
  const book = getBookById(id)
  getModal(book,id)
}

function getEventButton(){
  const [...buttonIsCompletes] = document.querySelectorAll('.green')
  const [...removeBookButtons] = document.querySelectorAll('.red')
  buttonIsCompletes.map(buttonIsComplete => {
    buttonIsComplete.addEventListener('click', updateCompletedButton)
  })
  removeBookButtons.map(removeButton => {
    removeButton.addEventListener('click',updateRemoveButton)
  })
}

inputBook.addEventListener("submit",function(e){
  e.preventDefault()
  const id = generateId()
  const formBook = new FormData(inputBook)
  const titleBook = formBook.get('title')
  const authorBook = formBook.get('author')
  const yearBook = parseInt(formBook.get('year'))
  const isCompleteBook = formBook.get('completedRead') === 'on'
  if(containsOnlySpaces(titleBook) || containsOnlySpaces(author) || containsOnlySpaces(yearBook)) {
    alert('input must not contains only spaces')
    return
  }
  const book = generateObjectBook(id,titleBook,authorBook,yearBook,isCompleteBook)
  books.push(book)
  localStorage.setItem(shelfKey, JSON.stringify(books))
  addBook(book)
  getEventButton()
  inputBook.reset()
})

function editBook(book){
  const [titleInput, authorInput, yearInput, isCompleteInput] = document.querySelectorAll("#editForm input")
  const submitButton = document.querySelector("#editForm")
  const cancelButton = document.querySelector("#cancel")
  const { title, author, year, isCompleted, id } = book
  titleInput.value = title
  authorInput.value = author
  yearInput.value = year
  isCompleteInput.checked = isCompleted
  submitButton.addEventListener('submit', function(){ 
    const updatedBook = updateBook(id, { title: titleInput.value, author: authorInput.value, year: yearInput.value,isCompleted: isCompleteInput.checked })
    const { title, author, year, isCompleted } = updatedBook.find(book => book.id === parseInt(id))
    const [...titlesBook] = document.querySelectorAll(`article h3`)
    console.log(typeof id)
    const titleBook = titlesBook.find(title => title.parentNode.id === String(id))
    const [...authorsBook] = document.querySelectorAll(`article .author`)
    const authorBook = authorsBook.find(author => author.parentNode.id === String(id))
    const [...yearsBook] = document.querySelectorAll(`article .year`)
    const yearBook = yearsBook.find(year => year.parentNode.id === String(id))
    console.log(title,author,year)
    console.log(titleBook)
    titleBook.innerText = title
    authorBook.innerText = `Penulis: ${author}`
    yearBook.innerText = `Tahun: ${year}`
    localStorage.setItem(shelfKey, JSON.stringify(updatedBook))
  })
  cancelButton.addEventListener('click',function(){
    modalEdit.close()
    modal.close()
  })
}

function changeBookShelf(book, id) {
  removeBookFromPage(id)
  addBook(book)
  getEventButton()
}

function addBook(book){
  const {title,author,year,isCompleted,id} = book
  const article = document.createElement('article')
  const titleBook = document.createElement('h3')
  const authorBook = document.createElement('p')
  const yearBook = document.createElement('p')
  const div = document.createElement('div')
  const buttonIsCompleted = document.createElement('button')
  const buttonRemoveBook = document.createElement('button')
  article.classList.add('book_item')
  authorBook.classList.add('author')
  yearBook.classList.add('year')
  article.append(titleBook,authorBook,yearBook)
  div.classList.add('action')
  buttonIsCompleted.classList.add('green')
  buttonIsCompleted.type = 'button'
  buttonRemoveBook.type = 'button'
  buttonRemoveBook.classList.add('red')
  div.append(buttonIsCompleted,buttonRemoveBook)
  buttonRemoveBook.innerText = "Hapus Buku"
  article.appendChild(div)
  article.setAttribute('id', id)
  titleBook.innerText = title
  authorBook.innerText = `Penulis: ${author}`
  yearBook.innerText = `Tahun: ${year}`
  if(isCompleted){
    buttonIsCompleted.innerText = "Belum selesai di Baca"
    completeBookList.appendChild(article)
  }else{
    buttonIsCompleted.innerText = "Selesai dibaca"
    incompleteBookList.appendChild(article)
  }
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
  if(title.trim() === '') {
    getBookShelf()
  }else{
    booksItem.map(book => addBook(book))
  }
  booksArticle.map(bookArticle => {
    bookArticle.parentNode.removeChild(bookArticle)
  })
  getEventButton()
})

function getModal(book,id){
  modal.showModal()
  const modalRemoveButton = document.querySelector(".modalRemoveButton")
  const modalEditButton = document.querySelector(".modalEditButton")
  modalRemoveButton.addEventListener('click', function(){
    modal.close()
    removeBook(id)
  })
  modalEditButton.addEventListener('click',function() {
    modal.close()
    if(!modalEdit.open){
      modalEdit.showModal()
    }
    editBook(book)
  })
}