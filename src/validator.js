import * as yup from 'yup';

const validator = (url) => {
  const schema = yup.string().required().url();
  
  return schema.validate(url)
  };
  
  export default validator;