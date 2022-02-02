import * as yup from 'yup';

const validator = (urlVal, feeds) => {
  const schema = yup.string()
    .required('empty')
    .url('invalidUrl')
    .notOneOf(feeds.map(({ url }) => url), 'duplicate');
  return schema.validate(urlVal);
};
export default validator;
