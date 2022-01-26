//import 'bootstrap';
import _ from 'lodash';
import axios from 'axios';
import validator from './validator.js';
import watchState from './view.js';
import i18next from 'i18next';
import ru from './locales/ru.js';
import parser from './parser';

const proxyUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`;
const getData = (url) => {
  //const proxyUrl = `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`;

  return axios.get(proxyUrl(url))
    .then((response) => response.data.contents)
    .catch(() => {
      throw new Error('network');
    });
};



// const getData = (link) => axios.get(link);
  

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
  
  const state = {
    form: {
      processState: '',
      error: null,
      },
    
    feeds: [],
    posts: [],
    readPosts: [],
    };
    console.log(state.readPosts)
  const formElement = document.querySelector('.rss-form');
  const inputElement = formElement.querySelector('input');
  const postElement = document.querySelector('.posts')

  const watchedState = watchState(i18nextInstance, state);

  const updater = (watchedState) => {
    const state = watchedState;
    state.feeds.forEach(({ url }) => {
      getData(url)
        .then((data) => {
          const { posts } = parser(data);
  
          const allPosts = _.union(posts, state.posts);
          const newPosts = _.differenceBy(allPosts, state.posts, 'title');
  
          if (newPosts.length > 0) {
            state.posts = [...newPosts, ...state.posts];
          }
        })
        // .catch(() => {});
        .finally(() => setTimeout(() => updater(state), 5000));
      }) 
    };
    
    // setTimeout(() => updater(state), 5000);
  

  postElement.addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    if (id && !watchedState.readPosts.includes(id)) {
      watchedState.readPosts.push(id)
    }
  })

  formElement.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.processState = 'submitting';
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
      //.then((data) => console.log(data))
      .catch((error) => {
        watchedState.form.error = error;
        watchedState.form.processState = 'invalid';
        inputElement.classList.add('is-invalid');
        
      });
      setTimeout(() => updater(watchedState), 5000);
    })
  }