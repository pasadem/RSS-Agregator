import _ from 'lodash';

const getContent = (doc, selector) => {
  const element = doc.querySelector(selector);
  return element.textContent;
};

const parser = (data) => {
  // eslint-disable-next-line no-undef
  const parse = new DOMParser();
  const doc = parse.parseFromString(data, 'application/xml');

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('invalidRss');
  }
  const title = getContent(doc, 'title');
  const description = getContent(doc, 'description');
  const items = doc.querySelectorAll('item');
  const url = getContent(doc, 'link');
  // const feed = { url, title, description };

  const posts = Array.from(items).reduce((acc, post) => [
    ...acc,
    {
      title: getContent(post, 'title'),
      description: getContent(post, 'description'),
      url: getContent(post, 'link'),
      postId: _.uniqueId(),
    },
  ], []);
  return {
    url,
    title,
    description,
    posts,
  };
};
export default parser;
