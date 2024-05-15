const BOOK_API_BASE_URL = "https://openlibrary.org/";

const bookInput = document.querySelector(".book-input");
const searchButton = document.querySelector(".search-btn");

function onClickSearch(event) {
  const bookName = bookInput.value.trim();

  // Do we have a valid Book name? if not, quit early
  if (!bookName) return;

  // DIsplay the
  renderSearchDetails(bookName);
}

const displayStatus = (message) => {
  const statusEl = document.querySelector("#stutus-bar");
  statusEl.innerHTML = message;

  // if we have no text to display, hide the status bar
  if (message === "") {
    statusEl.style.display = "none";
  } else {
    statusEl.style.display = "block";
  }
};

const clearSearchResults = () => {
  // Clear the search results
  const resultsEl = document.querySelector("#book-search-results");
  resultsEl.innerHTML = "";
};

const renderBookResultCard = (book, index) => {
  const html = `<a href="/review?isbn=${book.isbn}&&title=${book.title}&&cover=${book.coverImage}">
  
  <div class="book-search-card">
        <div class="book-search-info">
            <h2>(${book.title})</h2>
            <h4>Author: ${book.author}</h4>
            <h4>Published Year: ${book.published}</h4>
            <h4>Isbn: ${book.isbn}</h4>
        </div>
        <div class="book-search-image">
            <img src="http://covers.openlibrary.org/b/id/${book.coverImage}-M.jpg" alt="Covert art for ${book.title} by ${book.author} published ${book.published}">
        </div>
    </div></a>`;

  // Append the search results to the DOM
  const resultsEl = document.querySelector("#book-search-results");
  const div = document.createElement("div");

  div.innerHTML = html;
  resultsEl.appendChild(div);
};

const renderBookResults = (data) => {
  data.forEach((bookItem, index) => {
    let bookIsbn = [];
    if(undefined != bookItem.isbn && bookItem.isbn.length > 0){
      bookIsbn = bookItem.isbn[0];
    }

    const book = {
      title: bookItem.title,
      author: bookItem.author_name,
      published: bookItem.first_publish_year,
      isbn: bookIsbn,
      coverImage: bookItem.cover_i,
    };

    // Render the indivudal Book Result Card
    renderBookResultCard(book, index);
  });

  // Clear the Status Bar
  displayStatus("");
};

const renderSearchDetails = (bookName) => {
  // Show the Loading Status indicator
  displayStatus("Loading, please wait");

  // clear the search results ready for the new search
  clearSearchResults();

  // URL Encode the book name so we can handle spaces and special characters
  const searchTerm = encodeURIComponent(bookName);

  var apiUrl = `${BOOK_API_BASE_URL}search.json?q=${searchTerm}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => renderBookResults(data.docs))
    .catch((e) => {
      console.warn("Error fetching data from API", e);
    });
};

searchButton.addEventListener("click", onClickSearch);
