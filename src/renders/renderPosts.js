const renderModal = (title, url, description, modal) => {
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
export default renderPosts;
