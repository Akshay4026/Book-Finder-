# **Project title:**

# BOOKS FINDING APPLICATION
<br>
<br>

# Project Structure:
**File Organization:** Overview of the project folder structure.<br>
**Main Files:**<br>
index.html - Main HTML structure.<br>
style.css - Stylesheet for the app’s design.<br>
main.js - JavaScript file for app functionality.
<br>

# API Info:
used Open Library Api to extract Books
## Endpoint Details:
**-> https://openlibrary.org/search.json: For searching books by ISBN, title, author, or subject.<br>
->https://openlibrary.org/trending/daily.json: For retrieving the daily trending books list.<br>
->https://covers.openlibrary.org/b/id/{cover_id}-M.jpg: For displaying book cover images.<br>
->https://openlibrary.org/books/{edition_key}: For linking to the book’s OpenLibrary page when the user clicks to view an eBook.**

# Functions/Procedure :<br>
### For Book Search:
1.The user selects the type of search (TextBook name or ISBN or Author Name or Title Of book) and Input in the search.<br>
2.These values are passed to the function **getBookList()** function .<br>
3.This function is asynchronus function responsible to handle the fetching of Books thorugh api call.<br>
4.This function crates the array of Objects where each object contains details of a single book ,Now this array to passed to **displayBook()** function.<br>
5.This function displays the required fields to the user on the interface .<br>
6.Also handled fetchinng more books on clciking on more button using page endpoint of API.
6.There is another function called applyFilterAndSOrt() which helps the user to Filter(ebooks) and apply the Sort(books ratings or number of pages).<br>
7.Onclicking on single Book the function whether that particular books have Ebook public access or not If yes i will open the books to read or else returns No ebook available alert to the user.<br><br>


### For trending Books:
1.After clicking on the treding Books heading the Books which are treding currently will be shown on the right side of the page .<br>
2.On clicking on more the more books will be loaded again .<br>
3.Most of these books ebook access is unavailable hence when we clcik on them it shows no access to eboook alert.<br>
