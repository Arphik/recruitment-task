import {dataRowTemplate, pageOptionTemplate} from './RenderingTemplates';

  /**
   * Assigning to variable static elements of the HTML
   */
export const setupSelectors = () => {
    // Search selectors
    this.loadingContainer = document.querySelector(".loading");
}


/**
 * Gives button from header class "active" and remove from previous clicked button
 * Also it toggle class "ascending", if add this class return true, else false
 * Returned value is used as parameter in sortResults
 * @param {object} clickedSortBtn
 * @returns {boolean} isAscending
 */
export const changeSortBtn = (clickedSortBtn) => {
    if (clickedSortBtn.hasAttribute("data-header-id") === false) {
      return;
    }
    if (!clickedSortBtn.classList.contains("active")) {
      document.querySelector(".active").classList.remove("ascending");
      document.querySelector(".active").classList.remove("active");
      clickedSortBtn.classList.add("active");
    }
    return clickedSortBtn.classList.toggle("ascending");
}

/**
 * Render given data as rows in container
 * @param {array} results Part of data to render, default: 10 items
 * @param {HTMLElement} container Place for rendering one
 */
export const renderResults = (results) => {
  const dataContainer = document.querySelector(".data");
  dataContainer.innerHTML = "";
  results.forEach((result) => {
    // CREATE ROWS
    dataContainer.insertAdjacentHTML("beforeend", dataRowTemplate(result));
  });
}

/**
 * Render option elements in select markup.
 * @param {array} array Filtered data which length is used to calculate number of pages
 * @param {HTMLElement} container Place for rendering pagination
 */
export const renderPagination = (array) => {
  const paginactionContainer = document.querySelector(".pagination__select");
  let x = array.length / 10;
  let pagesNumber = x > x.toFixed(0) ? Number(x.toFixed(0)) + 1 : x;
  // CREATE PAGINATION BUTTONS
  paginactionContainer.innerHTML = "";
  for (let j = 0; j < pagesNumber; j++) {
    paginactionContainer.insertAdjacentHTML("beforeend", pageOptionTemplate(j));
  }
  // CREATE PAGINATION BUTTONS
}