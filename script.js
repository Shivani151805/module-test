const API_KEY = "lpvt5G3Rq2nLox4sYhVhXruloRv3evywsJrSuE0h"; 
const BASE_URL = "https://api.nasa.gov/planetary/apod";
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const imageContainer = document.getElementById("current-image-container");
const searchHistoryList = document.getElementById("search-history");

window.addEventListener("load", () => {
  const today = new Date().toISOString().split("T")[0];
  input.max = today;
  getCurrentImageOfTheDay();
  addSearchToHistory();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedDate = input.value;
  if (selectedDate) {
    getImageOfTheDay(selectedDate);
  }
});

function getCurrentImageOfTheDay() {
  const today = new Date().toISOString().split("T")[0];
  fetch(`${BASE_URL}?api_key=${API_KEY}&date=${today}`)
    .then((res) => res.json())
    .then((data) => renderImage(data))
    .catch((err) => handleError(err));
}

function getImageOfTheDay(date) {
  fetch(`${BASE_URL}?api_key=${API_KEY}&date=${date}`)
    .then((res) => res.json())
    .then((data) => {
      renderImage(data);
      saveSearch(date);
      addSearchToHistory();
    })
    .catch((err) => handleError(err));
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

function addSearchToHistory() {
  searchHistoryList.innerHTML = "";
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.forEach((date) => {
    const li = document.createElement("li");
    li.textContent = date;
    li.addEventListener("click", () => {
      getImageOfTheDay(date);
    });
    searchHistoryList.appendChild(li);
  });
}

function renderImage(data) {
  imageContainer.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.date}</p>
    ${data.media_type === "image"
      ? `<img src="${data.url}" alt="${data.title}" />`
      : `<iframe width="100%" height="400" src="${data.url}" frameborder="0" allowfullscreen></iframe>`}
    <p>${data.explanation}</p>
  `;
}

function handleError(err) {
  imageContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
  console.error(err);
}
