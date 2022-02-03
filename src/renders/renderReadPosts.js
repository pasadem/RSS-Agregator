const renderReadPosts = (state) => {
  const { readPosts } = state;
  const postElement = document.querySelector('.posts');
  readPosts.forEach((id) => {
    const post = postElement.querySelector(`[data-id="${id}"]`);
    post.classList.remove('fw-bold');
    post.classList.add('fw-normal');
    post.classList.add('link-secondary');
  });
};
export default renderReadPosts;
