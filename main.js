let offset = 1;
let allBooks = [];
let bookIds = new Set();

document.getElementById("search-button").addEventListener("click", (event) => {
    event.preventDefault();
    allBooks = []; 
    bookIds.clear(); 
    offset = 1;

    const input = document.getElementById("search-input").value.trim();
    const type = document.getElementById("search-type").value;
    const sort = document.getElementById("sort");
    const filter = document.getElementById("filter");
    const load = document.getElementById("loading-spinner");
    const ebook = document.getElementById("ebook");

    ebook.style.display =  "block";
    load.style.display = "block";
    sort.style.display = "block";
    filter.style.display = "block";

    if (!input) {
        alert("Please enter a search query.");
        return;
    }

    getBooksList(input, type);
});

async function getBooksList(input, type) {
    const moreButton = document.getElementById("more");
    moreButton.style.display = "block";

    let baseUrl = "https://openlibrary.org/search.json?";
    let query = "";

    switch (type) {
        case "isbn":
            query = `isbn=${encodeURIComponent(input)}`;
            break;
        case "title":
            query = `title=${encodeURIComponent(input)}`;
            break;
        case "author":
            query = `author=${encodeURIComponent(input)}`;
            break;
        case "subject":
            query = `subject=${encodeURIComponent(input)}`;
            break;
        default:
            alert("Invalid search type selected.");
            return;
    }

    try {
        const response = await fetch(`${baseUrl}${query}&page=${offset}&limit=12`);
        if (!response.ok) throw new Error("Error fetching books data.");

        const data = await response.json();
        const newBooks = data.docs.filter(book => !bookIds.has(book.key));
        
        newBooks.forEach(book => {
            bookIds.add(book.key);
            book.hasEbook = book.ebook_access === "public" && book.ebook_count_i > 0; // Define ebook availability
        });

        allBooks = allBooks.concat(newBooks);
        offset += 1;
        displayBooks(allBooks);
    } catch (error) {
        console.error("Error:", error);
        alert("Unable to fetch books. Please try again.");
    }
}
function displayBooks(books) {
    const bookList = document.getElementById("book-list");
    const loadingSpinner = document.getElementById("loading-spinner");
    loadingSpinner.style.display = "none"; 
    bookList.innerHTML = ""; 

    books.forEach(book => {
        const listItem = document.createElement("li");
        listItem.className = 'book-item';
        listItem.innerHTML = `
            <h3>${book.title || "N/A"}</h3>
            ${book.cover_i ? `<img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title} cover">` : ""}
        `;
        
        // Adding click event listener for opening the PDF
        listItem.addEventListener("click", () => {
            if (book.hasEbook) {
                const openBook = confirm("Do you want to open this eBook?");
                if (openBook) {
                    const bookUrl = `https://openlibrary.org/books/${book.cover_edition_key || book.edition_key[0]}`;
                    window.open(bookUrl, "_blank");
                }
            } else {
                alert("Sorry, this book does not have a public eBook available.");
            }
        });

        bookList.appendChild(listItem);
    });
}

function applyFiltersAndSort() {
    const sortOption = document.getElementById("sort").value;
    const filterEbook = document.getElementById("filter").checked;

    let filteredBooks = allBooks;
    if (filterEbook) {
        filteredBooks = filteredBooks.filter(book => book.hasEbook);
    }

    if (sortOption === "ratings") {
        filteredBooks.sort((a, b) => (b.edition_count || 0) - (a.edition_count || 0)); 
    } else if (sortOption === "pages") {
        filteredBooks.sort((a, b) => (b.number_of_pages_median || 0) - (a.number_of_pages_median || 0));
    }

    displayBooks(filteredBooks);
}

// Event listeners for filtering and sorting
document.getElementById("sort").addEventListener("change", applyFiltersAndSort);
document.getElementById("filter").addEventListener("change", applyFiltersAndSort);
document.getElementById("more").addEventListener("click", () => {
    const input = document.getElementById("search-input").value.trim();
    const type = document.getElementById("search-type").value;
    getBooksList(input, type);
});


document.addEventListener("DOMContentLoaded", () => {
    const trendingHeader = document.getElementById("trending");
    const loadMoreButton = document.getElementById("load-more");
    let trendpage = 0;
    trendingHeader.addEventListener("click",()=>{
        trendpage+=1;
        fetchTrendingBooks(trendpage);
        // console.log("trend")
    })
    loadMoreButton.addEventListener("click",()=>{
        trendpage+=1;
        fetchTrendingBooks(trendpage);
        // console.log("more");
    })

   
    async function fetchTrendingBooks(trendpage) {

        const base_url = `https://openlibrary.org/trending/daily.json?limit=10&page=${trendpage}`;

        try { 
            const response = await fetch(base_url);
            if (!response.ok) {
                throw new Error("No response from server");
            }
            const data = await response.json();

            const booksData = data.works.map(book => ({
                title: book.title || "N/A",
                author: book.author_name ? book.author_name.join(', ') : "Unknown",
                coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
                publishYear: book.first_publish_year || "N/A",
                ebookAccess: book.ebook_access === "public" && book.ebook_count_i > 0 ? "Available" : "Not Available",
                rating: book.edition_count ? `${book.edition_count} Editions` : "No Rating Info",
            }));

            displayTrendingBooks(booksData);
        } catch (error) {
            console.error("Error fetching trending books:", error);
            alert("Unable to load more books.");
        }
        // console.log("fetch");
    }

    function displayTrendingBooks(books) {
        const trendingBooksList = document.getElementById("trending-list");
    
        books.forEach(book => {
            const listItem = document.createElement("li");
            listItem.className = 'trendBook-list';
            listItem.innerHTML = `
                <h3>${book.title}</h3>
                ${book.coverUrl ? `<img src="${book.coverUrl}" alt="${book.title} cover" class="book-cover" />` : ""}
            `;
    
            // Adding click event listener for opening the PDF
            listItem.addEventListener("click", () => {
                if (book.ebookAccess === "Available") {
                    const openBook = confirm("Do you want to open this eBook?");
                    if (openBook) {
                        const bookUrl = `https://openlibrary.org/books/${book.cover_edition_key || book.edition_key[0]}`;
                        window.open(bookUrl, "_blank");
                    }
                } else {
                    alert("This book does not have a public eBook available.");
                }
            });
    
            trendingBooksList.appendChild(listItem);
        });
    
        loadMoreButton.style.display = books.length < 10 ? "none" : "block";
    }
    // console.log("disply");
});


