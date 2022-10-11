// Book Class
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;

    }
}

//UI class: Handle UI Tasks
class UI{
    static displayBook(){
        const books = Store.getBooks();
        books.forEach((book) =>
        {
            UI.addBookToList(book)

        });
    }
    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td> 
        <a href='#' class='btn btn-danger btn-small delete'>X</a>
        </td>
        `;
        list.appendChild(row);

    }
    static deleteBook(el){
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();

        }
    }
    static clearInput(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    //Alert  for validation
    static displayAlert(message, status){
        const div = document.createElement('div');
        div.className = `alert alert-${status}`; 
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //make vanish if click
        if(status == 'danger'){

        container.addEventListener('click', (e)=>
        {
            document.querySelector('.alert').remove();
        });
        }
        else{
            setTimeout(()=>
            {
            document.querySelector('.alert').remove(); 
            },1000); 
    }

    }
    
}
//Store classs: Handles Storage
class Store{
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books')); 
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        let books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }

        });
        localStorage.setItem('books', JSON.stringify(books));

    }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBook());

//Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e)=> {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate
     if(title === '' || author === '' || isbn === ''){
        UI.displayAlert('Please fill all Field', 'danger');
     }
     else{
        
    //create a new book object
        const book = new Book(title,author,isbn);

        //Add a book to the list
        UI.addBookToList(book);

        //Show a message for adding the book successfully   
        UI.displayAlert("Book added successfully",'success')

        //Add book to local storage
        Store.addBook(book);
        



        //clear the input
        UI.clearInput();

     }




    
});


// Event : remove a Book
document.querySelector('#book-list').addEventListener('click', (e) =>
{
    //remove book from UI
    UI.deleteBook(e.target);

    //remove book from storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //alert to removed book
    UI.displayAlert("Book removed",'info')
} );