import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { galleryItems } from './gallery-items';
const imageContainer = document.querySelector('.gallery');
const imagesMarkup = galleryItems
  .map(({ preview, original, description }) => {
    return `<li class="item"><a class="gallery__item" href="${original}">
  <img class="gallery__image" src="${preview}" alt="${description}" />
</a></li>`;
  })
  .join('');
imageContainer.insertAdjacentHTML('beforeend', imagesMarkup);
// lightbox.refresh();

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  enableKeyboard: true,
  animationSlide: true,
  animationSpeed: 250,
});
