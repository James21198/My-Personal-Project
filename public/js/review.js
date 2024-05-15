const addReviewHandlebar = async (event) => {
  event.preventDefault();
  const isbn = document.querySelector('input[name="isbn"]').value;
  const title = document.querySelector("#pTitle").innerHTML;
  const cover_img = document.querySelector("#book-cover").value;
  const review = document.querySelector("#review_text").value;
  
  if (isbn && review) {
    const response = await fetch("/api/review", {
      method: "POST",
      body: JSON.stringify({ title, isbn, review }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      document.location.replace('review?isbn='+isbn+'&&title='+title+'&&cover='+cover_img);
    }
  }
};

const deleteHandlerbar = async (event) => {
  const id = document.querySelector("#review_id").value;
  const isbn = document.querySelector('input[name="isbn"]').value;
  const pTitle = document.querySelector("#pDelTitle").innerHTML;
  const cover_img = document.querySelector('input[name="book_cover"]').value;
  const response = await fetch("/api/review/" + id, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    document.location.replace('review?isbn='+isbn+'&&title='+pTitle+'&&cover='+cover_img);
  }
};

const addReviewFormEL = document.querySelector(".addReview-form");
if (addReviewFormEL) {
  addReviewFormEL.addEventListener("submit", addReviewHandlebar);
}

const deleteReviewEl = document.querySelector(".deleteReview-form");
if (deleteReviewEl) {
    deleteReviewEl.addEventListener("submit", deleteHandlerbar);
}
