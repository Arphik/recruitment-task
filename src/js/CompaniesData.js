import '../styles/styles.scss';

export default class CompaniesData{

    constructor(){
        this.wholeData = [];
        this.sortingBtn;
         this.jsInit();
    }

    setData(data){ this.wholeData = data; }

    getData(){ return this.wholeData; }

    jsInit(){
        this.sortingBtn = document.querySelector('.ascending');

        document.querySelector('.search__button').addEventListener('click', () => this.filterResults());

        document.querySelectorAll('[data-header-id]').forEach(el => el.addEventListener('click', (event) => {
            this.changeButton(event);
        }));
        
        this.getData().then((data) => {
            this.setData(data);
            this.showResults(this.sortResults('id', 'ascending', data));
            this.drawPagination();
        });
    }

    connectToOrigin(){
        try{
            return fetch('https://recruitment.hal.skygate.io/companies');
        }catch(error){

        }
    }

    getData(){
        return this.connectToOrigin()
        .then((response) => response.json())
        .then((companies) => {
            // calculate total, average and last income
            return Promise.all(
                companies.map((company) =>
                    fetch(`https://recruitment.hal.skygate.io/incomes/${company.id}`)
                    .then((response) => response.json())
                )
            )
            .then((companyIncomes) => {
                let mergedCompaniesIncomes = [];
                companies.forEach((company, index) => {
                    let totalIncome = this.getTotalIncome(companyIncomes[index]);
                    let averageIncome = this.Round(this.getTotalIncome(companyIncomes[index])/companyIncomes[index].incomes.length, 2);
                    let lastIncome = this.sortResults('date', 'descending', companyIncomes[index].incomes)[0].value;//getLastIncome(companyIncomes[index]);
                    mergedCompaniesIncomes.push({...company, ...{totalIncome, averageIncome, lastIncome}});
                });
                return mergedCompaniesIncomes;
            });
            
        })
    }

    getTotalIncome(incomesArray){  
        let sum = 0;
        incomesArray.incomes.forEach((income) => {
            sum += Number(income.value);
        })
        return this.Round(sum, 2);
    }

    filterResults(){
        this.keyWords = document.querySelector('.search__input').value.toString().toUpperCase();
        let filteredCompanies = this.wholeData.filter(company => 
            new String(Object.values(company))
            .toUpperCase()
            .includes(keyWords)
        );
        this.showResults(this.sortResults('id', 'ascending', filteredCompanies));
        this.drawPagination(filteredCompanies);
    }

    sortResults(sortKey, order, array = this.wholeData){
        function compare(a, b) {
            let itemA = a[sortKey];
            let itemB = b[sortKey];
            let comparison = 0;
            comparison = itemA > itemB ? 1 : 0;
            comparison = itemA < itemB ? -1 : 1;
            order === 'ascending' ? comparison *= 1 : comparison *= -1;
            return comparison;
        }
        if(!array.length)
        console.log('array', array);
        let sorted = array.sort(compare);
        return sorted;
    }

    changeButton(event){ 
        // find sorting button -> check if clicked button is it or different -> 
        //if same toggle between ascending and descending
        //if not the same toggle class from old and give ascending to new one
        console.log(event.target.classList);
        if(this.sortingBtn == event.target){
            this.sortingBtn.classList.toggle('descending') ? this.sortingBtn.classList.remove('ascending') : this.sortingBtn.classList.add('ascending');
        }else{
            this.sortingBtn.classList.remove('ascending');
            this.sortingBtn.classList.remove('descending');
            this.sortingBtn = event.target;
            this.sortingBtn.classList.add('ascending');
        }


        // this.sortingBtn = document.querySelector('.ascending') || document.querySelector('.descending');
        // this.sortingBtn == event.target ? 
        //     (this.sortingBtn.classList.toggle('ascending') ? this.sortingBtn.classList.remove('descending') : this.sortingBtn.classList.add('descending'))
        //     :
        //     if(this.sortingBtn.classList.toggle('ascending') this.sortingBtn.classList.remove('ascending'));

        this.showResults(this.sortResults(this.sortingBtn.getAttribute('data-header-id'), this.sortingBtn.classList[2]));
    }

    showResults(results){
        let dataRows = document.querySelector('.data-rows');
        let loading = document.querySelector('.loading');
        dataRows.innerHTML = '';
        results.forEach(result => {// CREATE ROWS
            let rowTemplate = `
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
        this.changePage();
    }

    drawPagination(array = this.wholeData, rowsInPage = 10){
        let paginationSelect = document.querySelector('.pagination__select')
        paginationSelect.addEventListener('change', (event) => {
            this.changePage(parseInt(event.target.value));
        });
        // CREATE PAGINATION BUTTONS
        paginationSelect.innerHTML = '';
        for(let j = 0; j < (array.length/10); j++){
            paginationSelect.insertAdjacentHTML('beforeend',
                `<option class="page">
                    ${j+1}
                </option>`);
        }
        // CREATE PAGINATION BUTTONS
    }

    changePage(firstRow = 0, rowsSeen = 10){
        Array.prototype.slice.call(document.querySelectorAll('.showed-row')) // Hiding all rows
        .map(row => row.setAttribute('class', 'hidden-row'));

        Array.prototype.slice.call(document.querySelectorAll('.hidden-row')) // Showing rows depending on start and how many
        .slice(firstRow, firstRow+rowsSeen).map(row => row.setAttribute('class', 'showed-row row'));
    }

    Round(n, k){
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
}