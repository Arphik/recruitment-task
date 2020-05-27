
export function dataRowTemplate(result){
    return `<div data-row class="hidden-row row">
                <div class="id cell">${result.id}</div>
                <div class="name cell">${result.name}</div>
                <div class="city cell">${result.city}</div>
                <div class="total-income cell">${result.totalIncome}</div>
                <div class="average-income cell">${result.averageIncome}</div>
                <div class="last-income cell">${result.lastIncome}</div>
            </div>`;
}
export function pageOption(j){
    return `<option class="page">
                ${j+1}
            </option>`;
}