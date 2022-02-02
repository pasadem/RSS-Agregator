import onChange from 'on-change';
import 'bootstrap';

const renderFeedback = (i18nextInstance, feedback) => {
  console.log(feedback)
  const feedbackEl = document.querySelector('.feedback');
  if (feedback === 'succeed') {
    feedbackEl.textContent = i18nextInstance.t('successMessage');
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
    return;
  }
  if (feedback instanceof Error) {
    feedbackEl.textContent = i18nextInstance.t(`errors.${feedback.message}`);
    feedbackEl.classList.remove('text-success');
    feedbackEl.classList.add('text-danger');
  }
};

export const renderFeeds = (i18nextInstance, feeds) => {
  const feedsElement = document.querySelector('.feeds');
  feedsElement.innerHTML = '';

  const headingElement = document.createElement('h2');
  headingElement.textContent = i18nextInstance.t('feeds');

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
    descriptionElement.classList.add('text-black-50');
    descriptionElement.textContent = description;

    feedElement.appendChild(titleElement);
    feedElement.appendChild(descriptionElement);
    listElement.appendChild(feedElement);
  });
};

const renderModal = (title, url, description, modal) => {
  // const modal = document.querySelector('#modal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const modalLink = modal.querySelector('.full-article');

  modalTitle.textContent = title;
  modalBody.textContent = description;
  modalLink.href = url;
};

const renderPosts = (i18nextInstance, state) => {
  const { posts, readPosts } = state;
  const postsElement = document.querySelector('.posts');
  postsElement.innerHTML = '';

  const headingElement = document.createElement('h2');
  headingElement.textContent = i18nextInstance.t('posts');

  const listElement = document.createElement('ul');
  listElement.classList.add('list-group');

  postsElement.appendChild(headingElement);
  postsElement.appendChild(listElement);

  posts.forEach((post) => {
    const {
      title,
      url,
      description,
      postId,
    } = post;
    const postElement = document.createElement('li');
    postElement.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
    );

    const linkElement = document.createElement('a');
    const classAttribute = readPosts.includes(postId) ? ('fw-normal', 'link-secondary') : 'fw-bold';
    linkElement.href = url;
    linkElement.setAttribute('data-id', postId);
    linkElement.setAttribute('target', '_blank');
    linkElement.setAttribute('rel', 'noopener noreferrer');
    linkElement.textContent = title;
    linkElement.setAttribute('class', classAttribute);

    const buttonElement = document.createElement('button');
    buttonElement.type = 'button';
    buttonElement.textContent = i18nextInstance.t('watchLink');
    buttonElement.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonElement.setAttribute('data-id', postId);
    buttonElement.setAttribute('data-bs-toggle', 'modal');
    buttonElement.setAttribute('data-bs-target', '#modal');
    buttonElement.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = document.querySelector('#modal');
      renderModal(title, url, description, modal);
      linkElement.classList.remove('fw-bold');
      linkElement.classList.add('fw-normal', 'link-secondary');
    });

    postElement.appendChild(linkElement);
    postElement.appendChild(buttonElement);
    listElement.appendChild(postElement);
    // headingElement.replaceWith(listElement);
  });
};
/* const renderForm = (processState) => {
    const formElement = document.querySelector('.rss-form');
    const inputElement = formElement.querySelector('input');
    const submitButton = formElement.querySelector('button');
}; */

const watchedState = (i18nextInstance, state) => onChange(state, (path, value) => {
  const postElement = document.querySelector('.posts');
  switch (path) {
    case 'form.processState':
      renderFeedback(i18nextInstance, value);
      break;
    case 'form.error':
      renderFeedback(i18nextInstance, value);
      break;
    case 'feeds':
      renderFeeds(i18nextInstance, value);
      break;
    case 'posts':
      renderPosts(i18nextInstance, state);
      break;
    default:
      break;
  }
  if (path === 'readPosts') {
    const { readPosts } = state;
    readPosts.forEach((id) => {
      const post = postElement.querySelector(`[data-id="${id}"]`);
      post.classList.remove('fw-bold');
      post.classList.add('fw-normal');
      post.classList.add('link-secondary');
    });
  }
});
export default watchedState;
