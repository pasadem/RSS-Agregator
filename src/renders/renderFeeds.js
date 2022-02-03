const renderFeeds = (i18nextInstance, feeds) => {
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
export default renderFeeds;
