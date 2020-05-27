import {connectToOrigin} from './utils';
import {dataRowTemplate, pageOption} from './htmlTemplates';

export default class CompaniesData{

    constructor(){
        this.wholeData = [];
        this.sortingBtn;
         this.jsInit();
    }

    setData(data){ this.wholeData = data; }

    fetchData(){ return this.wholeData; }

    jsInit(){
        this.sortingBtn = document.querySelector('.ascending');
        this.paginationSelect = document.querySelector('.pagination__select');
        this.prevBtn = document.querySelector('.previous-page');
        this.nextBtn = document.querySelector('.next-page');
        this.searchInput = document.querySelector('.search__input');
        this.headers = document.querySelectorAll('[data-header-id]');
        this.searchButton = document.querySelector('.search__button');

        this.addEventsListeners();
        
        this.fetchData().then((data) => {
            this.setData(data);
            this.showResults(this.sortResults('id', 'ascending', data));
            this.drawPagination();
        });
    }

    addEventsListeners(){
        // Search event listeners
        this.searchInput.addEventListener('keypress', () => this.filterResults());
        this.headers.forEach(el => el.addEventListener('click', (event) => {
            console.log(event.key);
            if(event.key === 'Enter')
                this.changeButton(event);
        }));
        this.searchButton.addEventListener('click', () => this.filterResults());
        this.headers.forEach(el => el.addEventListener('click', (event) => {
            this.changeButton(event);
        })); // Search event listeners END

        // Pagination event listeners
        this.prevBtn.addEventListener('click', () => {
            if(this.paginationSelect.value > 1){
                this.changePage(Number(this.paginationSelect.value)-1);
                this.paginationSelect.value = Number(this.paginationSelect.value)-1;
            }
        });
        this.nextBtn.addEventListener('click', () => {
            if(this.paginationSelect.value < this.paginationSelect.length){
                this.changePage(Number(this.paginationSelect.value)+1);
                this.paginationSelect.value = Number(this.paginationSelect.value)+1;
            }
        });
        this.paginationSelect.addEventListener('change', (event) => {
            this.changePage(Number(event.target.value));
        });// Pagination event listeners END
    }


    fetchData(){
        return connectToOrigin('https://recruitment.hal.skygate.io/companies')
        .then((response) => response.json())
        .then((companies) => {
            // calculate total, average and last income
            return Promise.all(
                companies.map((company) =>
                connectToOrigin(`https://recruitment.hal.skygate.io/incomes/${company.id}`)
                    .then((response) => response.json())
                )
            )
            .then((companyIncomes) => {
                let mergedCompaniesIncomes = [];
                companies.forEach((company, index) => {
                    mergedCompaniesIncomes.push({...company, ...this.countIncomes(companyIncomes[index])});
                });
                return mergedCompaniesIncomes;
            });
            
        })
    }

    countIncomes(companyIncomes){
        let sum = this.getTotalIncome(companyIncomes.incomes)
        return {
            totalIncome: sum,
            averageIncome: (sum/companyIncomes.incomes.length).toFixed(2),
            lastIncome: this.sortResults('date', 'descending', companyIncomes.incomes)[0].value
        }
    }

    getTotalIncome(incomesObjects){  
        return incomesObjects
                .reduce((prev, curr) => {
                    return prev + Number(curr.value);
                }, 0)
                .toFixed(2);
    }

    filterResults(){
        const searchKeyword = this.searchInput.value;
        let filteredCompanies = this.wholeData.filter(company => 
            Object
            .values(company)
            .some((value) => {
                return String(value).toUpperCase().includes(searchKeyword.toUpperCase());
            })
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
        let sorted = array.sort(compare);
        return sorted;
    }

    changeSortedCells(sortKey){
        document.querySelectorAll(sortKey)
    }

    changeButton(event){ 
        // find sorting button -> check if clicked button is it or different -> 
        //if same toggle between ascending and descending
        //if not the same toggle class from old and give ascending to new one
        if(this.sortingBtn == event.target){
            this.sortingBtn.classList.toggle('descending') ? this.sortingBtn.classList.remove('ascending') : this.sortingBtn.classList.add('ascending');
        }else{
            this.sortingBtn.classList.remove('ascending');
            this.sortingBtn.classList.remove('descending');
            this.sortingBtn = event.target;
            this.sortingBtn.classList.add('ascending');
        }
        let sorted = this.sortResults(this.sortingBtn.getAttribute('data-header-id'), this.sortingBtn.classList[2])
        this.showResults(sorted);
    }

    showResults(results){
        let dataRows = document.querySelector('.data-rows');
        let loading = document.querySelector('.loading');
        dataRows.innerHTML = '';
        results.forEach(result => {// CREATE ROWS
                dataRows.insertAdjacentHTML('beforeend', dataRowTemplate(result));
        });
        this.changePage();
    }

    drawPagination(array = this.wholeData){
        // CREATE PAGINATION BUTTONS
        this.paginationSelect.innerHTML = '';
        for(let j = 0; j < (array.length/10); j++){
            this.paginationSelect.insertAdjacentHTML('beforeend',pageOption(j))
        }
        // CREATE PAGINATION BUTTONS
    }

    changePage(requestedPage = 1, rowsSeen = 10){
        let firstRowLoaded = (requestedPage - 1) * 10;
        let lastRowLoaed = firstRowLoaded + rowsSeen;

        Array.prototype.slice.call(document.querySelectorAll('.showed-row')) // Hiding all rows
        .map(row => row.setAttribute('class', 'hidden-row'));

        Array.prototype.slice.call(document.querySelectorAll('.hidden-row')) // Showing rows depending on start and how many
        .slice(firstRowLoaded, lastRowLoaed).map(row => row.setAttribute('class', 'showed-row row'));
    }
}