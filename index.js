const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filterMovies = []
const MOVIES_PER_PAGE = 12
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const currentMode = document.querySelector('#mode-switch')
let currentPage = 1

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = filterMovies.length ? filterMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function addtoFavourite(id) {
  const list = JSON.parse(localStorage.getItem('favouriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已在收藏明單中！')
  }
  list.push(movie)
  localStorage.setItem('favouriteMovies', JSON.stringify(list))
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
  if (dataPanel.dataset.mode === 'card-mode') {
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
                <button class="btn btn-info btn-add-favourite" data-id="${item.id}">+</button>
              </div>
          </div>
        </div>
      </div>`
    })
  } else if (dataPanel.dataset.mode === 'list-mode') {
    rawHTML = `<ul class="list-group">`
    data.forEach((item) => {
      rawHTML += `
        <li class="list-group-item d-flex justify-content-between">
          <h5 class="card-title"> ${item.title}</h5>
          <div>
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
            data-bs-target="#movie-model" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favourite" data-id="${item.id}">+</button>
          </div>
        </li>
      `
    })
    rawHTML += `
    </ul>
    `
  }
  dataPanel.innerHTML = rawHTML
}

function modeSwitch(mode) {
  if (dataPanel.dataset.mode === mode) return
  dataPanel.dataset.mode = mode
}

paginator.addEventListener('click', function onPaginatorClick(event) {
  if (event.target.tagName !== "A") return
  const page = Number(event.target.dataset.page)
  currentPage = page
  renderMovieList(getMoviesByPage(currentPage))
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filterMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword))
  if (filterMovies.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  renderPaginator(filterMovies.length)
  renderMovieList(getMoviesByPage(1))
})

dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favourite')) {
    addtoFavourite(Number(event.target.dataset.id))
  }
})

currentMode.addEventListener('click', function onModeClick(event) {
  if (event.target.matches('#list-mode-button')) {
    modeSwitch('list-mode')
  } else if (event.target.matches('#card-mode-button')) {
    modeSwitch('card-mode')
  }
  renderMovieList(getMoviesByPage(currentPage))
})

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
  })
  .catch((err) => console.log(err))