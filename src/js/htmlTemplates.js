
function dataRowTemplate(result){
    return `<div data-row class="hidden-row row">
                <div class="id cell"><span>${result.id}</span></div>
                <div class="name cell"><span>${result.name}</span></div>
                <div class="city cell"><span>${result.city}</span></div>
                <div class="total-income cell"><span>${result.totalIncome}</span></div>
                <div class="average-income cell"><span>${result.averageIncome}</span></div>
                <div class="last-income cell"><span>${result.lastIncome}</span></div>
            </div>`;
}
function pageOptionTemplate(j){
    return `<option class="page">
                ${j+1}
            </option>`;
}

export function renderResults(results, container){
    container.innerHTML = '';
    results.forEach(result => {// CREATE ROWS
        container.insertAdjacentHTML('beforeend', dataRowTemplate(result));
    });
}

export function renderPagination(array = this.wholeData){
    // CREATE PAGINATION BUTTONS
    this.paginationSelect.innerHTML = '';
    for(let j = 0; j < (array.length/10); j++){
        this.paginationSelect.insertAdjacentHTML('beforeend',pageOptionTemplate(j))
    }
    // CREATE PAGINATION BUTTONS
}