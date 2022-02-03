import onChange from 'on-change';
import 'bootstrap';
import renders from './renders/index.js';

const {
  renderFeedback,
  renderFeeds,
  renderForm,
  renderPosts,
  renderReadPosts,
} = renders;

const watchedState = (i18nextInstance, state) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.processState':
      renderForm(value);
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
    case 'readPosts':
      renderReadPosts(state);
      break;
    default:
      break;
  }
});
export default watchedState;
