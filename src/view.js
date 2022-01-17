import onChange from 'on-change';
import 'bootstrap';
const renderFeedback = (i18nextInstance, feedback) => {
    const feedbackEl = document.querySelector('.feedback');
    if (feedback === 'succeed') {
      feedbackEl.textContent = i18nextInstance.t('successMessage');
      feedbackEl.classList.remove('text-danger');
      feedbackEl.classList.add('text-success');
      return;
    }
    if (feedback instanceof Error) {
      feedbackEl.textContent = i18nextInstance.t('errors.invalidUrl');
      feedbackEl.classList.remove('text-success');
      feedbackEl.classList.add('text-danger');
    }
  };

const renderFeeds = (feeds) => {
  const feedsElement = document.querySelector('.feeds');

  const headingElement = document.createElement('h2');
  headingElement.textContent = 'Фиды';

  const listElement = document.createElement('ul');
  listElement.classList.add('list-group', 'mb-5');

  feedsElement.appendChild(headingElement);
  feedsElement.appendChild(listElement);

  feeds.forEach(({ title, description }) => {
    const feedElement = document.createElement('li');
    feedElement.classList.add('list-group-item');

    const titleElement = document.createElement('h4');
    titleElement.textContent = title;

    const descriptionElement = document.createElement('p');
    // descriptionElement.classList.add('m-0 small text-black-50');
    descriptionElement.textContent = description;

    feedElement.appendChild(titleElement);
    feedElement.appendChild(descriptionElement);
    listElement.appendChild(feedElement);
  });
};

const renderModal = (title, url, description, modal) => {
  //const modal = document.querySelector('#modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const modalLink = modal.querySelector('.full-article');

  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLink.href = url;
};

const renderPosts = (i18nextInstance, posts) => {
  const postsElement = document.querySelector('.posts');

  const headingElement = document.createElement('h2');
  headingElement.textContent = 'Посты';

  const listElement = document.createElement('ul');
  listElement.classList.add('list-group');

  postsElement.appendChild(headingElement);
  postsElement.appendChild(listElement);

  posts.forEach(({ title, url, description, postId }) => {
    const postElement = document.createElement('li');
    postElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      );
      
    const linkElement = document.createElement('a');
    linkElement.classList.add('fw-bold');
    linkElement.href = url;
    linkElement.setAttribute('data-id', postId);
    linkElement.setAttribute('target', '_blank');
    linkElement.setAttribute('rel', 'noopener noreferrer');
    linkElement.textContent = title;

    const buttonElement = document.createElement('button');
    buttonElement.type = 'button';
    buttonElement.textContent = i18nextInstance.t('watchLink');
    buttonElement.classList.add('btn', 'btn-primary', 'btn-sm');
    buttonElement.setAttribute('data-id', postId);
    buttonElement.setAttribute('data-bs-toggle', 'modal');
    buttonElement.setAttribute('data-bs-target', '#modal');
    buttonElement.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.querySelector('#modal');
      // modal.show();
      renderModal(title, url, description, modal);
      linkElement.classList.remove('fw-bold');
      linkElement.classList.add('fw-normal');
    });

    postElement.appendChild(linkElement);
    postElement.appendChild(buttonElement);
    listElement.appendChild(postElement);
    }
  )
};
/* const renderForm = (processState) => {
    const formElement = document.querySelector('.rss-form');
    const inputElement = formElement.querySelector('input');
    const submitButton = formElement.querySelector('button');
}; */

const watchedState = (i18nextInstance, state) => onChange(state, (path, value) => {
    switch (path) {
        case 'form.processState':
            renderFeedback(i18nextInstance, value);
            break;
        case 'form.error':
            renderFeedback(i18nextInstance, value);
            break;
        case 'data.feeds':
            renderFeeds(value);
            console.log(state.data.feeds);
            break;
        case 'data.posts':
          renderPosts(i18nextInstance, value);
          break;
        default:
            break;
        }
      
});
export default watchedState;