export function filterTemplate(filter) {
  function createFilter() {
    const filterItem = document.createElement('li');
    filterItem.textContent = filter;
    filterItem.classList.add('filter-item');
    return filterItem;
  }
  return {
    createFilter,
  };
}
