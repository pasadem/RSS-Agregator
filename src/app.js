//import 'bootstrap';
import _ from 'lodash';
import axios from 'axios';
import validator from './validator.js';
import watchState from './view.js';
import i18next from 'i18next';
import ru from './locales/ru.js';
import parser from './parser';

/* const getUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`; */

const getData = (link) => {
  // const data = getUrl(link);
  return axios.get(link)
};

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
    data: {
      feeds: [],
      posts: [],
      }
    };
  
  const formElement = document.querySelector('.rss-form');
  const inputElement = formElement.querySelector('input');

  const watchedState = watchState(i18nextInstance, state);

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.processState = 'submitting';
    const formData = new FormData(formElement);
    const url = formData.get('url');
    validator(url)
      .then((link) => getData(link))
      .then((response) => {
        const { data: contents } = response;
        //console.log(contents)
      const { title, description, posts } = parser(contents);
      console.log(title);
      // const id = _.uniqueId();
      watchedState.data.feeds.unshift({
        url,
        title,
        description,
      });
      const allPosts = [
        ...watchedState.data.posts,
        ...posts.map((post) => { 
          const id = _.uniqueId();
          return ({...post, postId: id });
        })
      ];
      watchedState.data.posts = _.orderBy(
        allPosts,
        'pubDate',
      );
      console.log(allPosts)
      watchedState.form.processState = 'succeed';
      formElement.reset();
      inputElement.focus();
      inputElement.classList.remove('is-invalid');
      })
      //.then((data) => console.log(data))
      .catch((error) => {
        watchedState.form.error = error;
        //watchedState.form.processState = 'invalid';
        inputElement.classList.add('is-invalid');
        
      });
    })
};
