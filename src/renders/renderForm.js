const renderForm = (processState) => {
  const formElement = document.querySelector('.rss-form');
  const inputElement = formElement.querySelector('input');
  const submitButton = formElement.querySelector('button');

  if (processState === 'submitting') {
    inputElement.setAttribute('readonly', true);
    formElement.setAttribute('disabled', true);
    submitButton.setAttribute('disabled', true);
  } else {
    inputElement.removeAttribute('readonly');
    formElement.removeAttribute('disabled');
    submitButton.removeAttribute('disabled');
  }
};
export default renderForm;
