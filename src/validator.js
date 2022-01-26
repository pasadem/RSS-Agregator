import * as yup from 'yup';

const validator = (url, feeds) => {
  const schema = yup.string()
    .required('empty')
    .url('invalidUrl')
    .notOneOf(feeds.map(({ url }) => url ), 'duplicate');
  return schema.validate(url)
  };
  
  export default validator;