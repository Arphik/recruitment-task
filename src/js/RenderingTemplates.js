/**
 * Template of row in table
 * @param {array}  * @returns {HTMLBodyElement}
 */
export const dataRowTemplate = ({id, name, city, totalIncome, averageIncome, lastMonthIncomes }) => {
  return `<div data class="data__row">
                <div class="id data__cell--content">${id}</div>
                <div class="name data__cell--content">${name}</div>
                <div class="city data__cell--content">${city}</div>
                <div class="total-income data__cell--content">${totalIncome}</div>
                <div class="average-income data__cell--content">${averageIncome}</div>
                <div class="last-income data__cell--content">${lastMonthIncomes}</div>
            </div>`;
}

/**
 * Template of option in pagination
 * @param {number} j Page number
 */
export const pageOptionTemplate = (j) => {
  return `<option class="pagination__page">
                ${j + 1}
          </option>`;
}