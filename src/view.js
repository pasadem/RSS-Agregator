import onChange from 'on-change';

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
        default:
            break;
        }
      
});
export default watchedState;