export function filterTemplate(filter) {
  function createFilter(element) {
    const filterItem = document.createElement('li');
    filterItem.textContent = filter;
    filterItem.classList.add('filter-item');
    filterItem.classList.add(`filter-${element}`);
    return filterItem;
  }
  return {
    createFilter,
  };
}
