import {fetchImages} from './fetchImages.js' 
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

var lightbox = new SimpleLightbox('.gallery a', {});

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const buttonSubmit = document.querySelector('.submit-button')
const buttonLoadMore = document.querySelector('.load-more')
const perPage = 40;

let query = '';
let page = 1;

formEl.addEventListener('submit', onSearch);
buttonLoadMore.addEventListener('click', renderImagesMore);
window.addEventListener('scroll', infiniteScroll);

function onSearch(element) {
  element.preventDefault();
  window.scrollTo({ top: 0 });
  page = 1;
  query = element.currentTarget.searchQuery.value.trim();
  galleryEl.innerHTML = '';

  if (query === '') {
    return;
  } else {
    fetchImages(query, page, perPage)
      .then(({ data }) => {
        if (data.totalHits === 0) {
          onNoFoundMatch();
        } else {
          renderImages(data.hits);
          onFoundMatch(data);
          lightbox.refresh();
          formEl.reset();
          console.log(data.hits);
        }
      })
      .catch(error => console.log(error));
  }
}

// разметка
function renderImages(images) {
  const markup = images
  .map(image => {
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


// следующая страница при прокрутке
function renderImagesMore() {
  page += 1;

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderImages(data.hits);
      lightbox.refresh();
      // console.log(data.hits);

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        // onEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

// кнопка загрузить еще
// buttonLoadMore.addEventListener('click', () => {
//   page += 1;
//   fetchImages(page, q).then(data => {
//     if (data.hits.length === 0) {
//       buttonLoadMore.classList.add('visually-hidden');
//       onEndOfSearch();
//     }
//     renderImages(data.hits);
//     const { height: cardHeight } = document
//       .querySelector('.gallery')
//       .firstElementChild.getBoundingClientRect();

// // скролл
//     window.scrollBy({
//       top: cardHeight * 2,
//       behavior: 'smooth',
//     });
//     Lightbox.refresh();
//   });
// });


// бесконечный скролл
function infiniteScroll() {
  const windowHeight = window.innerHeight;
  const contentHeight = galleryEl.offsetHeight;
  const yOffset = window.pageYOffset;
  const y = yOffset + windowHeight;

  if (y >= contentHeight) {
    page += 1;

    fetchImages(query, page, perPage)
      .then(({ data }) => {
        renderImages(data.hits);
        lightbox.refresh();
        console.log(data.hits);

        const totalPages = Math.ceil(data.totalHits / perPage);

        if (page >= totalPages) {
          onEndOfSearch();
        }
      })
      .catch(error => console.log(error));
  }
}

// alerts
function onFoundMatch(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
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
