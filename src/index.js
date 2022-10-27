import {fetchImages} from './fetchImages.js' 
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const Lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');
buttonLoadMore.classList.add('visually-hidden');

let q = '';
let page = 1;


formEl.addEventListener('submit', event => {
  event.preventDefault();
  galleryEl.innerHTML = '';
  page = 1;
  buttonLoadMore.classList.add('visually-hidden');
  q = event.target.elements.searchQuery.value.trim();
  if (q !== '') {
    fetchImages(page, q)
      .then(data => {
        if (data.hits.length === 0) {
          onNoFoundMatch();
        } else {
          renderImages(data.hits);
          onFoundMatch();
          buttonLoadMore.classList.remove('visually-hidden');
          Lightbox.refresh();
          formEl.reset();
        }
      })
      .catch(error => console.log(error.message));
  }
});


// разметка
function renderImages(images) {
  const markup = images.map(image => {
      return `<div class="photo-card">
      <a class="photo-card__link" href="${image.largeImageURL}">
      <img class="photo-card__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b>
          ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b>
          ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b>
          ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b>
          ${image.downloads}
        </p>
      </div>
    </div>`;
    })
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

// кнопка загрузить еще
buttonLoadMore.addEventListener('click', () => {
  page += 1;
  fetchImages(page, q).then(data => {
    if (data.hits.length === 0) {
      buttonLoadMore.classList.add('visually-hidden');
      onEndOfSearch();
    }
    renderImages(data.hits);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

// скролл
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    Lightbox.refresh();
  });
});


// alerts
function onFoundMatch() {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
}

function onNoFoundMatch() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  )
}

function onEndOfSearch() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  )
}

