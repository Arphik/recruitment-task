
// class Companies{
//     constructor(data){
//         this.companiesData = data;
//     }

//     setData(data){
//         this.companiesData = data;
//     }

//     getData(){
//         return this.companiesData;
//     }
// }

var companiesData;

function jsInit(key){
    // sortResults(order);
    getData().then((array) => {
        companiesData = array;
        console.log('companiesData', companiesData);
        sortResults(key, 'ascending', array);
    });
}

function getData(){
    return fetch('https://recruitment.hal.skygate.io/companies')
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
        function getLastIncome(incomesArray){
            let lastIncome = incomesArray.incomes[0].value;
            let lastDate = incomesArray.incomes[0].date;
            incomesArray.incomes.forEach((incomes) => {
                if(incomes.date > lastDate){
                    lastDate = incomes.date;
                    lastIncome = incomes.value;
                }
            })
            return Number(lastIncome);
        }
        // calculate total, average and last income

        return Promise.all(
            companies.map((company) =>
                fetch(`https://recruitment.hal.skygate.io/incomes/${company.id}`)
                .then((response) => response.json())
            )
        )
        .then((companyIncomes) => {
            companies.forEach((company, index) => {
                company.totalIncome = getTotalIncome(companyIncomes[index]);
                company.averageIncome = Round(getTotalIncome(companyIncomes[index])/companyIncomes[index].incomes.length, 2);
                company.lastIncome = getLastIncome(companyIncomes[index]);
            });
            
            return companies;
        });
        
    })
}

 function filterResults(){
    console.log('companiesData', companiesData);
    let keyWords = document.querySelector('.find-input').value.toUpperCase();
    let newArray = companiesData.filter((item) => {
        console.log("BEFORE");
        if(item.id.toString().search(keyWords) !== -1 ||
            item.name.toUpperCase().search(keyWords) !== -1 ||
            item.city.toUpperCase().search(keyWords) !== -1 ||
            item.totalIncome.toString().search(keyWords) !== -1 ||
            item.averageIncome.toString().search(keyWords) !== -1 ||
            item.lastIncome.toString().search(keyWords) !== -1){
                console.log('keywords ', keyWords, ' compare result ' , item.id, item.id.toString().search(keyWords));
                return item;
            }
            // for(key in item){
            //     return item[key].toString().search(keyWords);
            // }
    });
    sortResults('id', 'ascending', newArray);
 }

function sortResults(sortKey, order, array = transformRowsToArray()){
    function compare(a, b) {
        let itemA, itemB;
        switch(sortKey){
            case 'id':
                itemA = a.id;
                itemB = b.id;
                break;
            case 'name':
                itemA = a.name;
                itemB = b.name;
                break;
            case 'city':
                itemA = a.city;
                itemB = b.city;
                break;
            case 'totalIncome':
                itemA = a.totalIncome;
                itemB = b.totalIncome;
                break;
            case 'averageIncome':
                itemA = a.averageIncome;
                itemB = b.averageIncome;
                break;
            case 'lastIncome':
                itemA = a.lastIncome;
                itemB = b.lastIncome;
                break;
        }
    let comparison = 0;
    if (itemA > itemB) {
        comparison = 1;
    }
    if (itemB > itemA) {
        comparison = -1;
    }
    if(order === 'ascending')
      return comparison;
    else 
        return comparison * (-1);
    }
    console.log('sorted array ', sortKey, array.sort(compare));
    
    showResults(array);

    let sortButton = document.querySelector(`#${sortKey}`)
    if(order === 'ascending'){
        sortButton.setAttribute('onclick', `sortResults('${sortKey}', 'descending')`);
    }
    else {
        sortButton.setAttribute('onclick', `sortResults('${sortKey}', 'ascending')`);
    }
}

function showResults(results, pageRows = 10){
    let container = document.querySelector('.container');
    container.innerHTML = '';
    console.log('results ', results);

    let rowsTemplate = `
            <div class="first-row">
                <div id="id" class="id" onclick="sortResults('id', 'ascending')">Id</div>
                <div id="name" class="name" onclick="sortResults('name', 'ascending')">Name</div>
                <div id="city" class="city" onclick="sortResults('city', 'ascending')">City</div>
                <div id="totalIncome" class="total-income" onclick="sortResults('totalIncome', 'ascending')">Tot. Income</div>
                <div id="averageIncome" class="average-income" onclick="sortResults('averageIncome', 'ascending')">Ave. Income</div>
                <div id="lastIncome" class="last-income" onclick="sortResults('lastIncome', 'ascending')">Last Income</div>
            </div>`;
    results.forEach((result) => {
        // CREATE ROW
        rowsTemplate += `
            <div id="row" class="hidden-row">
                <div class="id" onclick="sortResults()">${result.id}</div>
                <div class="name">${result.name}</div>
                <div class="city">${result.city}</div>
                <div class="total-income">${result.totalIncome}</div>
                <div class="average-income">${result.averageIncome}</div>
                <div class="last-income">${result.lastIncome}</div>
            </div>
        `;
        // CREATE COLUMNS //
    });
    // console.log('rowsTemplate ', rowsTemplate);
    container.innerHTML = rowsTemplate;
    // console.log('container ', container);
    // CREATE PAGINATION BUTTONS
    let pages = '';
    // if((results.length/pageRows) > Math.round(results/pageRows))
    //     pages = results.length/pageRows+1;
    // pages = results.length/pageRows;
    for(let j = 0; j < (results.length/10); j++){
        pages += `
            <div class="page" onclick="changePage(${j})">
                ${j+1}
            </div>`;
    }
    let pagination = document.querySelector('.pagination');
    pagination.innerHTML = pages;
    // CREATE PAGINATION BUTTONS
    changePage();
}

function changePage(firstRow = 0, rowsSeen = 10){
    let showedRows = document.querySelectorAll('.showed-row');
    if(showedRows.length > 0){
        for(let i = 0; i < showedRows.length; i++){ 
            showedRows[i].setAttribute('class', 'hidden-row');
        }
    }
    let hiddenRows = document.querySelectorAll('.hidden-row');
    if(hiddenRows.length < 10) rowsSeen = hiddenRows.length;
    if(hiddenRows.length > 0){
        for(let i = firstRow*10; i < firstRow*10+rowsSeen; i++){
            hiddenRows[i].setAttribute('class', 'showed-row');
        }
    }
}
function Round(n, k){
    let factor = Math.pow(10, k);
    return Math.round(n*factor)/factor;
}

function transformRowsToArray(){
    let array = [];
    let rows = document.querySelectorAll('#row');
    rows.forEach((row) => {
        array.push({
            id: Number(row.children[0].innerHTML),
            name: row.children[1].innerHTML,
            city: row.children[2].innerHTML,
            totalIncome: Number(row.children[3].innerHTML),
            averageIncome: Number(row.children[4].innerHTML),
            lastIncome: Number(row.children[5].innerHTML)
        });
    });
    console.log('array from html ', array);
    return array;
}