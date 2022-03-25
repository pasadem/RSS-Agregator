// import 'bootstrap';
import _ from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import validator from './validator.js';
import watchState from './view.js';
import ru from './locales/ru.js';
import parser from './parser.js';

const proxyUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

const getData = (url) => axios.get(proxyUrl(url))
  .then((response) => response.data.contents)
  .catch(() => {
    throw new Error('network');
  });

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const state = {
    form: {
      processState: '',
      error: null,
    },
    feeds: [],
    posts: [],
    readPosts: [],
  };
  const formElement = document.querySelector('.rss-form');
  const inputElement = formElement.querySelector('input');
  const postElement = document.querySelector('.posts');

  const watchedState = watchState(i18nextInstance, state);

  const updater = (links) => {
    const { feeds } = watchedState;
    feeds.forEach(({ url }) => {
      getData(url)
        .then((data) => {
          const { posts } = parser(data);
          const diffPosts = _.differenceBy(posts, watchedState.posts, 'title');
          watchedState.posts.unshift(...diffPosts);
        });
    });
    setTimeout(() => updater(links), 5000);
  };

  postElement.addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    if (id && !watchedState.readPosts.includes(id)) {
      watchedState.readPosts.push(id);
    }
  });

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.processState = 'submitting';
    // eslint-disable-next-line no-undef
    const formData = new FormData(formElement);
    const url = formData.get('url');
    validator(url, watchedState.feeds)
      .then((link) => getData(link))
      .then((response) => {
        const { title, description, posts } = parser(response);
        watchedState.feeds.unshift({
          url,
          title,
          description,
        });
        watchedState.posts.unshift(...posts);
        watchedState.form.processState = 'succeed';
        formElement.reset();
        inputElement.focus();
        inputElement.classList.remove('is-invalid');
      })
      .catch((error) => {
        watchedState.form.error = error;
        watchedState.form.processState = 'invalid';
        inputElement.classList.add('is-invalid');
      });
    setTimeout(() => updater(watchedState), 5000);
  });
};
