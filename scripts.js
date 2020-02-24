
// class Companies{
//     constructor(){
//         this.companiesData;
//     }

//     setData(data){
//         this.companiesData = data;
//     }

//     getData(data){
//         return this.companiesData;
//     }
// }

var companiesData = new Array();

function jsInit(order){
    //FIRST ROW
    let id = document.createElement('div');
    let name = document.createElement('div');
    let city = document.createElement('div');
    let tincome = document.createElement('div');
    let aincome = document.createElement('div');
    let lincome = document.createElement('div');
    //FIRST ROW
    getData('https://recruitment.hal.skygate.io/companies');
    companiesData.then(() => {
        sortResults(order);
    });

    // id.onclick = getData(order);
    // nameEle = querySelector('.name');
    // cityEle = querySelector('.city');
    // tincomeEle = querySelector('.tincome');
    // aincomeEle = querySelector('.aincome');
    // lincomeEle = querySelector('.lincome');
}

function getData(url){
    return fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((companies) => {
        return companies.forEach((company) => {
            fetch(`https://recruitment.hal.skygate.io/incomes/${company.id}`)
                .then((response) => {
                    return response.json();
                })
                .then((companyIncomes) => {
                    let sum = 0;
                    let ave;
                    let lastIncome = companyIncomes.incomes[0].value;
                    let lastDate = companyIncomes.incomes[0].date;
                    companyIncomes.incomes.forEach(el2 => {
                        sum += Number(el2.value);
                        if(el2.date > lastDate) { 
                            lastDate = el2.date; 
                            lastIncome = el2.value;
                        }
                    })
                    ave = sum/companyIncomes.incomes.length;
                    company.tincome = Round(sum, 2);
                    company.aincome = Round(ave, 2);
                    company.lincome = lastIncome;
                    // console.log(company);
                    companiesData.push(company);
                });
        })
    });
}

function sortResults(sortKey){
    let container = document.querySelector('.container');
    let firstRow = document.querySelector('.first-row');
    container.innerHTML = '';
    container.append(firstRow);

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
            case 'tincome':
                itemA = a.tincome;
                itemB = b.tincome;
                break;
            case 'aincome':
                itemA = a.aincome;
                itemB = b.aincome;
                break;
            case 'lincome':
                itemA = a.lincome;
                itemB = b.lincome;
                break;
        }
      if (itemA > itemB) {
        return 1;
    }
      if (itemB > itemA) {
        return -1;
    }
      return 0;
    }
    companiesData.then((array) => {
        console.log('array ', array);
        showResults(array.sort(compare));
    });
}

function showResults(results, pageRows = 10){
    console.log('results ', results);
    let container = document.querySelector('.container');

    let rowsTemplate = `
            <div class="first-row">
                <div class="id" onclick="sortResults('id')">Id</div>
                <div class="name" onclick="sortResults('name')">Name</div>
                <div class="city" onclick="sortResults('city')">City</div>
                <div class="tincome" onclick="sortResults('tincom')">Tot. Income</div>
                <div class="aincome" onclick="sortResults('aincome')">Ave. Income</div>
                <div class="lincome" onclick="sortResults('lincome')">Last Income</div>
            </div>`;
    results.forEach((result) => {
        // CREATE ROW
        console.log(result);
        rowsTemplate += `
            <div class="hidden-row">
                <div class="id" onclick="sortResults()">${result.id}</div>
                <div class="name">${result.name}</div>
                <div class="city">${result.city}</div>
                <div class="tincome">${result.tincome}</div>
                <div class="aincome">${result.aincome}</div>
                <div class="lincome">${result.lincome}</div>
            </div>
        `;
        // CREATE COLUMNS //
    });
    // console.log('rowsTemplate ', rowsTemplate);
    container.innerHTML = rowsTemplate;
    // console.log('container ', container);
    // CREATE PAGINATION BUTTONS
    let pages;
    if((results.length/pageRows) > Math.round(results/pageRows))
        pages = results.length/pageRows+1;
    pages = results.length/pageRows;
    for(let j = 0; j < (results.length/10); j++){
        pages += `
            <div class="page" id="${j}" onclick="changePage(${j})">
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
    if(showedRows){
        for(let i = 0; i < showedRows.length; i++){ 
            showedRows[i].setAttribute('class', 'hidden-row');
        }
    }
    let hiddenRows = document.querySelectorAll('.hidden-row');
    // console.log(hiddenRows);
    if(hiddenRows){
        for(let i = firstRow*10; i < firstRow*10+rowsSeen; i++){
            hiddenRows[i].setAttribute('class', 'showed-row');
        }
    }
}
function Round(n, k){
    let factor = Math.pow(10, k);
    return Math.round(n*factor)/factor;
}

