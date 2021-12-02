import * as yup from 'yup';

const validator = (data) => {
  const schema = yup.object().shape({
      url: yup.string().url(),
    });
    schema.isValid({ url: data })
    .then((valid) => valid);
  };
  
  export default validator;