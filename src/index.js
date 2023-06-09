import { params } from './js/params';
import { optionsForService, paramsForRequest } from './js/api-pixabay';
import { fetchImages } from './js/api-pixabay';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const { form, gallery, loadMoreBtn, endList } = params;
const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onFormSubmit(event) {
  event.preventDefault();

  optionsForService.q = event.currentTarget.elements.searchQuery.value;
  optionsForService.page = 1;

  toggelVisualyHidden(loadMoreBtn, 'add');
  toggelVisualyHidden(endList, 'add');
  cleanGallery(gallery);

  fetchImages(paramsForRequest)
    .then(response => {
      checkResponseDataLength(response);
      renderGalleryItems(response.hits, gallery, createItemMarkup);

      lightbox.refresh();

      optionsForService.page += 1;
    })
    .catch(error => console.log(error));
}

function createItemMarkup(data) {
  return data
    .map(
      (
        {
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        },
        ind
      ) => {
        let itemClass = 'photo-card__wrapper';

        // switch (ind) {
        //   case 0:
        //     itemClass = `${itemClass} ${itemClass}--wide`;
        //     break;

        //   case 2:
        //     itemClass = `${itemClass} ${itemClass}--tall`;
        //     break;

        //   case 8:
        //     itemClass = `${itemClass} ${itemClass}--wide ${itemClass}--tall`;
        //     break;

        //   case 17:
        //     itemClass = `${itemClass} ${itemClass}--wide`;
        //     break;

        //   case 20:
        //     itemClass = `${itemClass} ${itemClass}--tall`;
        //     break;

        //   case 25:
        //     itemClass = `${itemClass} ${itemClass}--tall`;
        //     break;

        //   case 32:
        //     itemClass = `${itemClass} ${itemClass}--wide`;
        //     break;

        //   case 35:
        //     itemClass = `${itemClass} ${itemClass}--tall`;
        //     break;
        // }

        return `<div class="${itemClass}">
            <a class="photo-card" href="${largeImageURL}" data-alt="${tags}" style="background-image:url(${webformatURL})">
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</a>
</div>`;
      }
    )
    .join('');
}

function renderGalleryItems(data, outputEl, markup) {
  outputEl.insertAdjacentHTML('beforeend', markup(data));
}

function cleanGallery(outputEl) {
  outputEl.innerHTML = '';
}

function onLoadMoreBtn(event) {
  const imageLimit = optionsForService.page * optionsForService.per_page;

  fetchImages(paramsForRequest)
    .then(response => {
      if (imageLimit >= response.totalHits) {
        toggelVisualyHidden(loadMoreBtn, 'add');
        toggelVisualyHidden(endList, 'remove');
      }

      renderGalleryItems(response.hits, gallery, createItemMarkup);
      scrollingAfterMoreLoad();

      lightbox.refresh();

      optionsForService.page += 1;
    })
    .catch(error => console.log(error));
}

function checkResponseDataLength(data) {
  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  if (data.totalHits <= optionsForService.per_page) {
    toggelVisualyHidden(endList, 'remove');

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }
  if (data.totalHits > optionsForService.per_page) {
    toggelVisualyHidden(loadMoreBtn, 'remove');

    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }
}

function toggelVisualyHidden(element, action) {
  element.classList[action]('visually-hidden');
}

function scrollingAfterMoreLoad() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.7,
    behavior: 'smooth',
  });
}
