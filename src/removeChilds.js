const removeChilds = (element) => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  };
  export default removeChilds;