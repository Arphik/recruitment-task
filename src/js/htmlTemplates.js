function dataRowTemplate(result) {
  return `<div data-row class="row">
                <div class="id cell"><span>${result.id}</span></div>
                <div class="name cell"><span>${result.name}</span></div>
                <div class="city cell"><span>${result.city}</span></div>
                <div class="total-income cell"><span>${result.totalIncome}</span></div>
                <div class="average-income cell"><span>${result.averageIncome}</span></div>
                <div class="last-income cell"><span>${result.lastMonthIncomes}</span></div>
            </div>`;
}
function pageOptionTemplate(j) {
  return `<option class="page">
                ${j + 1}
            </option>`;
}

/**
 * Render given data as rows in container
 * @param {*} results Part of data to render, default: 10 items
 * @param {*} container Place for rendering one
 */
export function renderResults(results, container) {
  container.innerHTML = "";
  results.forEach((result) => {
    // CREATE ROWS
    container.insertAdjacentHTML("beforeend", dataRowTemplate(result));
  });
}

/**
 * @param {*} array Filtered data which length is used to calculate number of pages
 * @param {*} container Place for rendering pagination
 */
export function renderPagination(array, container) {
  let x = array.length / 10;
  let pagesNumber = x > x.toFixed(0) ? Number(x.toFixed(0)) + 1 : x;
  // CREATE PAGINATION BUTTONS
  container.innerHTML = "";
  for (let j = 0; j < pagesNumber; j++) {
    container.insertAdjacentHTML("beforeend", pageOptionTemplate(j));
  }
  // CREATE PAGINATION BUTTONS
}
