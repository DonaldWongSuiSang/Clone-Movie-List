const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favouriteMovies'))
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove-favourite')) {
    removeFavourite(Number(event.target.dataset.id))
  }
})

function removeFavourite(id) {
  if (!movies || !movies.length) return
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return
  movies.splice(movieIndex, 1)
  localStorage.setItem('favouriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}


function showMovieModal(id) {
  const movieTitle = document.querySelector('#movie-modal-title')
  const movieImage = document.querySelector('#movie-modal-image')
  const movieDate = document.querySelector('#movie-modal-date')
  const movieDescription = document.querySelector('#movie-modal-description')
  axios
    .get(INDEX_URL + id).then((response) => {
      const data = response.data.results
      movieTitle.innerText = data.title
      movieDate.innerText = 'Release date: ' + data.release_date
      movieDescription.innerText = data.description
      movieImage.innerHTML = `
    <img src="${POSTER_URL + data.image}" 
    alt="movie-poster" class="img-fluid">     
    `
    })
}

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    //title, image
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="movie-poster">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer text-muted">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                  data-bs-target="#movie-model" data-id="${item.id}">More</button>
                <button class="btn btn-danger btn-remove-favourite" data-id="${item.id}">X</button>
              </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML
}

renderMovieList(movies)
