const renderFeedback = (i18nextInstance, feedback) => {
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
export default renderFeedback;
