import { connectToOrigin } from './utils';
import { renderResults, renderPagination} from './htmlTemplates';

export default class CompaniesData{

    constructor(){
        this.wholeData = [];
        this.filteredData;
        this.pageNumber = 1;
        this.pageSize = 10;
         this.jsInit();
    }

    setWholeData(data){ this.wholeData = data; }
    getWholeData(){ return this.wholeData; }

    setFilteredData(data){ this.filteredData = data; }
    getFilteredData(){ return this.filteredData; }


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

        
        this.fetchData().then((data) => {
            this.setWholeData(data);
            this.setFilteredData(data);
            let sorted = this.sortResults('id', 'ascending', this.wholeData);
            let sliced = this.slicedData(sorted);
            renderResults(sliced, this.dataRows);
            renderPagination(this.getWholeData(), this.paginationSelect);
            this.addEventsListeners();
        });
    }

    addEventsListeners(){
        // Search event listeners
        this.searchInput.addEventListener('submit', () => this.filterResults());
        this.headers.forEach(el => el.addEventListener('click', (event) => {
            event.preventDefault();
        }));
        this.searchButton.addEventListener('click', () => {
            const filteredData = this.filterByKeyword(this.searchInput.value, this.wholeData);
            this.setFilteredData(filteredData);
            renderResults(this.slicedData(this.filteredData), this.dataRows);
            renderPagination(this.filteredData, this.paginationSelect);
        }); // Search event listeners END
        
        this.headers.forEach(el => el.addEventListener('click', (event) => {
            let sortKey = event.target.getAttribute('data-header-id');
            let order = this.changeButton(event);
            let sorted = this.sortResults(sortKey, order, this.getFilteredData());
            let sliced = this.slicedData(sorted);
            renderResults(sliced, this.dataRows);
        }));

        // Pagination event listeners
        this.prevBtn.addEventListener('click', () => {
            if(this.paginationSelect.value > 1){
                let sliced = this.slicedData(this.getFilteredData(), Number(this.paginationSelect.value)-1)
                this.paginationSelect.value = Number(this.paginationSelect.value)-1;
                renderResults(sliced, this.dataRows);
            }
        });
        this.nextBtn.addEventListener('click', () => {
            if(this.paginationSelect.value < this.paginationSelect.length){
                let sliced = this.slicedData(this.getFilteredData(), Number(this.paginationSelect.value)+1)
                this.paginationSelect.value = Number(this.paginationSelect.value)+1;
                renderResults(sliced, this.dataRows);
            }
        });
        this.paginationSelect.addEventListener('change', (event) => {
            let sliced = this.slicedData(this.getFilteredData(), Number(this.paginationSelect.value))
            renderResults(sliced, this.dataRows);
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

// SORTING
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
        document.querySelectorAll(sortKey);
    }
    changeButton(event){
        let clicked = event.target;
        if(!clicked.classList.has('active'))
        document.querySelector('.active').classList.remove('.active');
        
        clicked.classList.toggle('descending');

        clicked.classList.add('.active');
        clicked.classList.has('ascending') ? clicked.classList.add('descending') : clicked.classList.add('ascending');

        if(this.sortingBtn == event.target){
            // Here is situation where user clicked the same button as before, so we are checking which class it has
            // Toggle function returns boolean value, if given class is added returns true, otherwise false.
            //
            this.sortingBtn.classList.toggle('descending') ? this.sortingBtn.classList.remove('ascending') : this.sortingBtn.classList.add('ascending');
        }else{
            // Cause user clicked now different sorting button we look for previous one and remove its ascending/descending class
            let prevBtn = document.querySelector('.ascending');
            prevBtn != undefined ? prevBtn.classList.remove('ascending') : 
                document.querySelector('.descending').classList.remove('descending');
            // After class is removed we add ascending class to new button
            event.target.classList.add('ascending');
            this.sortingBtn = event.target;
        }
        return event.target.classList[event.target.classList.length-1];
    }
// SORTING END

    changePage(requestedPage = 1, rowsSeen = 10){
        let firstRowLoaded = (requestedPage - 1) * 10;
        let lastRowLoaed = firstRowLoaded + rowsSeen;

        Array.prototype.slice.call(document.querySelectorAll('.showed-row')) // Hiding all rows
        .map(row => row.setAttribute('class', 'hidden-row'));

        Array.prototype.slice.call(document.querySelectorAll('.hidden-row')) // Showing rows depending on start and how many
        .slice(firstRowLoaded, lastRowLoaed).map(row => row.setAttribute('class', 'showed-row row'));
    }
}