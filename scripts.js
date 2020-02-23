
class Companies{

}

function jsInit(order){
    //FIRST ROW
    let id = document.createElement('div');
    let name = document.createElement('div');
    let city = document.createElement('div');
    let tincome = document.createElement('div');
    let aincome = document.createElement('div');
    let lincome = document.createElement('div');
    //FIRST ROW

    id.onclick = loadResults(order);
    // nameEle = querySelector('.name');
    // cityEle = querySelector('.city');
    // tincomeEle = querySelector('.tincome');
    // aincomeEle = querySelector('.aincome');
    // lincomeEle = querySelector('.lincome');
}

function getData(url){
    let req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.send();
    return req;
}

function showResults(res, startI = 0, pageRows = 10){
    console.log('showResults ', res);
    let container = document.querySelector('.container');
    for(startI; startI < res.length; startI++){

        // CREATE ROW
        let row = document.createElement('div');
        row.setAttribute('class', 'hidden');
        // CREATE ROW
        // CREATE COLUMNS //
        let id = document.createElement('div');
        id.setAttribute('class', 'id');
        id.innerHTML = res[startI].id;
        row.append(id);
        let name = document.createElement('div');
        name.setAttribute('class', 'name');
        name.innerHTML = res[startI].name;
        row.append(name);
        let city = document.createElement('div');
        city.setAttribute('class', 'city');
        city.innerHTML = res[startI].city;
        row.append(city);
        let tincome = document.createElement('div');
        tincome.setAttribute('class', 'tincome');
        tincome.innerHTML = res[startI].tincome;
        row.append(tincome);
        let aincome = document.createElement('div');
        aincome.setAttribute('class', 'aincome');
        aincome.innerHTML = res[startI].aincome;
        row.append(aincome);
        let lincome = document.createElement('div');
        lincome.setAttribute('class', 'lincome');
        lincome.innerHTML = res[startI].lincome;
        row.append(lincome);
        // CREATE COLUMNS //
        container.append(row);
    }
    // CREATE PAGINATION BUTTONS
    let pagesCont = document.createElement('div');
    pagesCont.setAttribute('class', 'pages-cont');
    let pages=0;
    if((res.length/pageRows) > Math.round(res/pageRows))
        pages = res.length/pageRows+1;
    pages = res.length/pageRows;

    for(let j = 0; j < (res.length/10); j++){
        let page = document.createElement('div');
        page.setAttribute('class', 'page');
        page.setAttribute('ID', j);
        page.setAttribute('onclick', 'changePage('+j+')');
        page.innerHTML = j+1;
        // page.onclick = changePage(j*10);
        pagesCont.append(page);
    }
     document.body.append(pagesCont);
    // CREATE PAGINATION BUTTONS
    changePage();
}

function changePage(firstRow = 0, rowsSeen = 10){
    let rows = document.querySelectorAll('.row');
    for(let i = 0; i < rows.length; i++){ 
        rows[i].setAttribute('class', 'hidden');
    }
    let hidden = document.querySelectorAll('.hidden');
    for(let i = firstRow*10; i < firstRow*10+rowsSeen; i++){
        hidden[i].setAttribute('class', 'row');
    }
}

function sortResults(results, sortKey){
    let container = document.querySelector('.container');
    let firstRow = document.querySelector('.first-row');

    console.log(firstRow);
    container.innerHTML = '';
    container.append(firstRow);
    let rows = document.querySelectorAll('.row');
    function compare(a, b) {
        let itemA, itemB;
        switch(sortKey){
            case 'id':
                itemA = a.childNodes[0].innerHTML;
                itemB = b.childNodes[0].innerHTML;
                break;
            case 'name':
                itemA = a.childNodes[1].innerHTML;
                itemB = b.childNodes[1].innerHTML;
                break;
            case 'city':
                itemA = a.childNodes[2].innerHTML;
                itemB = b.childNodes[2].innerHTML;
                break;
            case 'tincome':
                itemA = a.childNodes[3].innerHTML;
                itemB = b.childNodes[3].innerHTML;
                break;
            case 'aincome':
                itemA = a.childNodes[4].innerHTML;
                itemB = b.childNodes[4].innerHTML;
                break;
            case 'lincome':
                itemA = a.childNodes[5].innerHTML;
                itemB = b.childNodes[5].innerHTML;
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
    let res = Array.prototype.slice.call(rows, 0);
    console.log('rows ', rows);
    console.log('res ', res);
    // showResults(res.sort(compare));
}

function loadResults(order){
    let companies = new getData('https://recruitment.hal.skygate.io/companies');

    companies.onload = function(){ 
        let results = JSON.parse(companies.response);
        for(let k = 0; k < results.length; k++){
            let incomes = new getData(`https://recruitment.hal.skygate.io/incomes/${results[k].id}`);
            incomes.onload = () => {
                let res2 = JSON.parse(incomes.response);
                let sum = 0;
                let ave;
                let lastIncome = res2.incomes[0].value;
                let lastDate = res2.incomes[0].date;
                res2.incomes.forEach(el2 => {
                    sum += Number(el2.value);
                    if(el2.date > lastDate) { 
                        lastDate = el2.date; 
                        lastIncome = el2.value;
                    }
                })

                ave = sum/res2.incomes.length;
                results[k].tincome = Round(sum, 2);
                results[k].aincome = Round(ave, 2);
                results[k].lincome = lastIncome;
                if(k == results.length-1){
                    // console.log(results);
                    showResults(results);
                    sortResults(results, 'id');
                }
            }
        }
    }
}
function Round(n, k){
    let factor = Math.pow(10, k);
    return Math.round(n*factor)/factor;
}

