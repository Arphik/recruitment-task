
function dataRowTemplate(result){
    return `<div data-row class="row">
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

export function renderPagination(array, container){
    let x = array.length/10
    let pagesNumber = ((x) > x.toFixed(0) ? x : x+1);
    // CREATE PAGINATION BUTTONS
    container.innerHTML = '';
    for(let j = 0; j < pagesNumber; j++){
        console.log('creating page option', x, x.toFixed(0), pagesNumber);
        container.insertAdjacentHTML('beforeend', pageOptionTemplate(j))
    }
    // CREATE PAGINATION BUTTONS
}