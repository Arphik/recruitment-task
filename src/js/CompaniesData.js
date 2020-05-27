import {connectToOrigin} from './utils';
import { showResults, drawPagination} from './htmlTemplates';

export default class CompaniesData{

    constructor(){
        this.wholeData = [];
        this.filteredData;
        this.sortingBtn;
        this.pageNumber = 1;
        this.pageSize = 10;
         this.jsInit();
    }

    setData(data){
        this.wholeData = data;
        this.filteredData = data;
    }

    setFilteredData(data){
        this.wholeData = data;
        this.filteredData = data;
    }

    fetchData(){ return this.wholeData; }

    jsInit(){
        this.sortingBtn = document.querySelector('.ascending');
        this.paginationSelect = document.querySelector('.pagination__select');
        this.prevBtn = document.querySelector('.previous-page');
        this.nextBtn = document.querySelector('.next-page');
        this.searchInput = document.querySelector('.search__input');
        this.headers = document.querySelectorAll('[data-header-id]');
        this.searchButton = document.querySelector('.search__button');
        this.dataRows = document.querySelector('.data-rows');
        this.loading = document.querySelector('.loading');

        this.addEventsListeners();
        
        this.fetchData().then((data) => {
            this.setData(data);
            this.setFilteredData(data);
            console.log(this.wholeData);
            let sorted = this.sortResults('id', 'ascending', this.wholeData);
            let sliced = this.slicedData(sorted);
            showResults(sliced);
            drawPagination();
        });
    }

    addEventsListeners(){
        // Search event listeners
        // this.searchInput.addEventListener('submit', () => this.filterResults());
        // this.headers.forEach(el => el.addEventListener('click', (event) => {
        //     console.log(event.key);
        //     event.preventDefault();
        //         this.changeButton(event);
        // }));
        this.searchButton.addEventListener('click', () => {
            const filteredData = this.filterByKeyword(this.searchInput.value, this.wholeData);
            this.setFilteredData(filteredData);
            showResults(this.slicedData(this.filteredData));
        });
        
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

    slicedData(filteredData, pageNumber = 1, pageSize = 10){
        let firstRow = (pageNumber-1)*pageSize;
        let lastRow = firstRow + pageSize;
        return filteredData.slice(firstRow, lastRow);
    }

    filterByKeyword(searchKeyword, data){
        searchKeyword = this.searchInput.value;
        this.setFilteredData()
        return data.filter(company => 
            Object
            .values(company)
            .some((value) => {
                return String(value).toUpperCase().includes(searchKeyword.toUpperCase());
            })
        );
    }

    refreshResults(){
        this.filteredData = this.wholeData;
        showResults(this.sortResults('id', 'ascending', filteredCompanies));
        drawPagination(filteredCompanies);
    }

    sortResults(sortKey, order, array){
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
        showResults(sorted);
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