class CompaniesData{
    constructor(){
        this.wholeData = [];
    }
    setData(data){ this.wholeData = data; }
    getData(){ return this.wholeData; }
}
var companiesData = new CompaniesData();
function jsInit(){
    getData().then((data) => {
        companiesData.setData(data);
        showResults(sortResults('id', 'ascending', companiesData.getData()));
        document.querySelectorAll('[data-header-id]').forEach(el => el.onclick = changeButton);
        drawPagination();
    });
}
function connectToOrigin(){
    try{
        return fetch('https://recruitment.hal.skygate.io/companies');
    }catch(error){

    }
}
function getData(){
    return connectToOrigin()
    .then((response) => response.json()) 
    .then((companies) => {
        // calculate total, average and last income
        function getTotalIncome(incomesArray){  
            let sum = 0;
            incomesArray.incomes.forEach((income) => {
                sum += Number(income.value);
            })
            return Round(sum, 2);
        }
        return Promise.all(
            companies.map((company) =>
                fetch(`https://recruitment.hal.skygate.io/incomes/${company.id}`)
                .then((response) => response.json())
            )
        )
        .then((companyIncomes) => {
            let mergedCompaniesIncomes = [];
            companies.forEach((company, index) => {
                let totalIncome = getTotalIncome(companyIncomes[index]);
                let averageIncome = Round(getTotalIncome(companyIncomes[index])/companyIncomes[index].incomes.length, 2);
                let lastIncome = sortResults('date', 'descending', companyIncomes[index].incomes)[0].value;//getLastIncome(companyIncomes[index]);
                mergedCompaniesIncomes.push({...company, ...{totalIncome, averageIncome, lastIncome}});
            });
            return mergedCompaniesIncomes;
        });
        
    })
}

function filterResults(){
    let keyWords = document.querySelector('.search-input').value.toUpperCase();
    let newArray = companiesData.getData().filter((item) => {
    if(item.id.toString().search(keyWords) !== -1 ||
        item.name.toUpperCase().search(keyWords) !== -1 ||
        item.city.toUpperCase().search(keyWords) !== -1 ||
        item.totalIncome.toString().search(keyWords) !== -1 ||
        item.averageIncome.toString().search(keyWords) !== -1 ||
        item.lastIncome.toString().search(keyWords) !== -1){
            return item;
        }
    });
    showResults(sortResults('id', 'ascending', newArray));
    drawPagination();
}

function sortResults(sortKey, order, array = companiesData.getData()){
    function compare(a, b) {
        let itemA = a[sortKey];
        let itemB = b[sortKey];
        let comparison = 0;
        comparison = itemA > itemB ? 1 : 0;
        comparison = itemA < itemB ? -1 : 1;
        order === 'ascending' ? comparison *= 1 : comparison *= -1;
        return comparison;
    }
    let sorted = array.sort(compare);
    return sorted;
}

function changeButton(){ 
    // find sorting button -> check if clicked button is it or different -> 
    //if same toggle between ascending and descending
    //if not the same toggle class from old and give ascending to new one
    let oldSortingBtn;
    try{
        oldSortingBtn = document.querySelector('.ascending') || document.querySelector('.descending');
    }catch(error){}
    this.classList.toggle('ascending') ? this.classList.remove('descending') : this.classList.add('descending');
    if(oldSortingBtn !== this) oldSortingBtn.classList.contains('ascending') ? 
    oldSortingBtn.classList.remove('ascending') : oldSortingBtn.classList.remove('descending');
    showResults(sortResults(this.getAttribute('data-header-id'), this.classList[2]));
}

function showResults(results){
    let dataRows = document.querySelector('.data-rows');
    dataRows.innerHTML = '';
    results.forEach(result => {// CREATE ROWS
        rowTemplate = `
            <div data-row class="hidden-row row">
                <div class="id cell">${result.id}</div>
                <div class="name cell">${result.name}</div>
                <div class="city cell">${result.city}</div>
                <div class="total-income cell">${result.totalIncome}</div>
                <div class="average-income cell">${result.averageIncome}</div>
                <div class="last-income cell">${result.lastIncome}</div>
            </div>`
            dataRows.insertAdjacentHTML('beforeend', rowTemplate);
    });
    changePage();
}

function drawPagination(rowsInPage = 10){
    console.log('draw pagi');
    // CREATE PAGINATION BUTTONS
    document.querySelector('.pagination').innerHTML = '';
    for(let j = 0; j < (companiesData.getData().length/10); j++){
        document.querySelector('.pagination').insertAdjacentHTML('beforeend',
            `<div class="page" onclick="changePage(${j*rowsInPage})">
                ${j+1}
            </div>`);
    }
    // CREATE PAGINATION BUTTONS
}

function changePage(firstRow = 0, rowsSeen = 10){
    Array.prototype.slice.call(document.querySelectorAll('.showed-row')) // Hiding all rows
    .map(row => row.setAttribute('class', 'hidden-row'));

    Array.prototype.slice.call(document.querySelectorAll('.hidden-row')) // Showing rows depending on start and how many
    .slice(firstRow, firstRow+rowsSeen).map(row => row.setAttribute('class', 'showed-row row'));
}
function Round(n, k){
    let factor = Math.pow(10, k);
    return Math.round(n*factor)/factor;
}

// function transformRowsToArray(){
//     let array = [];
//     let rows = document.querySelectorAll('[data-row]');
//     rows.forEach(row => 
//         array.push({
//             id: Number(row.children[0].innerHTML),
//             name: row.children[1].innerHTML,
//             city: row.children[2].innerHTML,
//             totalIncome: Number(row.children[3].innerHTML),
//             averageIncome: Number(row.children[4].innerHTML),
//             lastIncome: Number(row.children[5].innerHTML)
//         })
//     );
//     return array;
// }