import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { getAxiosTag } from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryList: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  inputEl: document.querySelector('.searchQuery'),
};
const perPage = 40;
let surchtags = '';
let page = 1;
const API_KEY = `24377768-1651c24dae1d00899e27f41ae`;
const BASE_URL = `https://pixabay.com/api`;
async function getAxiosTag(surchtags, page) {
  const URL = `${BASE_URL}/?key=${API_KEY}&q=${surchtags}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${40}`;
  console.log(surchtags);
  try {
    const response = await axios.get(URL);
    console.log(response);
    console.log(response.data);
    console.log(response.data.hits);
    return await response.data;
  } catch (error) {
    console.log(error);
  }
}
refs.loadMoreBtn.classList.add('is-hidden');
refs.searchForm.addEventListener('input', e => {
  console.log(e.target);
  if (e.target !== 0) {
    refs.loadMoreBtn.classList.add('is-hidden');
    return reset();
  }
});

refs.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  page = 1;
  // reset();
  console.log(surchtags);
  surchtags = refs.searchForm.elements.searchQuery.value.trim();
  if (surchtags === '') {
    reset();
    return notifyFailure();
  }

  getAxiosTag(surchtags, page).then(photos => {
    renderPhotos(photos.hits);
    const cardHeight = document.querySelector('li').getBoundingClientRect().height;
    console.log(cardHeight);
    window.scrollBy({
      top: cardHeight * 0.5,
      behavior: 'smooth',
    });
    if (photos.totalHits > 0) {
      notifySuccess(photos.totalHits);
    }
    page += 1;
    if (page > photos.totalHits / perPage || photos.totalHits < perPage) {
      return refs.loadMoreBtn.classList.add('is-hidden');
    }
    refs.loadMoreBtn.classList.remove('is-hidden');
  });
});

function renderPhotos(hits) {
  if (hits.length === 0) {
    notifyFailure();
  }

  const markup = hits
    .map(
      ({ webformatURL, tags, largeImageURL, likes, views, comments, downloads }) =>
        `
    <li class="gallery-list">
        <a class="gallery__link" href="${largeImageURL}">
                  <div class="gallery__card">
                   <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
                 <div class="gallery__item-info">
                        <p class="item-info">
                          <b>Likes: </b>${likes}
                        </p>
                        <p class="item-info">
                          <b>Views: </b>${views}
                        </p>
                        <p class="item-info">
                          <b>Comments: </b>${comments}
                        </p>
                        <p class="item-info">
                          <b>Downloads: </b>${downloads}
                        </p>
                    </div>
               </div>
        </a>
     </li>
      `,
    )
    .join('');
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionDelay: 250,
  enableKeyboard: true,
  animationSlide: true,
  animationSpeed: 250,
});
function reset() {
  console.log('сброс');
  refs.galleryList.innerHTML = '';
}
function notifyFailure() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
    showOnlyTheLastOne: true,
  });
}
function notifyEndResult() {
  Notify.failure('We`re sorry, but you`ve reached the end of search results.', {
    showOnlyTheLastOne: true,
  });
}
function notifySuccess(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`, {
    showOnlyTheLastOne: true,
  });
}
const loadMoreBtn = document.querySelector('.load-more');
function onEntry(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      console.log('surchtags', surchtags);
      getAxiosTag(surchtags, page).then(photos => {
        renderPhotos(photos.hits);
      });
    }
  });
}

const observer = new IntersectionObserver(onEntry, {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
});
observer.observe(loadMoreBtn);
