import _ from 'lodash';

const getContent = (doc, selector) => {
    const element = doc.querySelector(selector);
    return element.textContent;
  };

const parser = (data) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'application/xml');
    
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
      }
    ], []);
  return { url, title, description, posts }; 
};
export default parser;
