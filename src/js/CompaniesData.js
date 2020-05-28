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
            let sorted = this.sortResults('id', true, this.wholeData);
            let sliced = this.slicedData(sorted);
            renderResults(sliced, this.dataRows);
            renderPagination(this.getWholeData(), this.paginationSelect);
            this.addEventsListeners();
        });
    }

    addEventsListeners(){
        // Search event listeners
        this.searchInput.addEventListener('submit', (event) => {
        });
        this.searchButton.addEventListener('click', () => {
            const filteredData = this.filterByKeyword(this.searchInput.value, this.wholeData);
            this.setFilteredData(filteredData);
            renderResults(this.slicedData(this.filteredData), this.dataRows);
            renderPagination(this.filteredData, this.paginationSelect);
        }); // Search event listeners END
        
        this.headers.forEach(el => el.addEventListener('click', (event) => {
            const clicked = event.target;
            if(clicked.hasAttribute('data-header-id') === false){ return; }
            if  (!clicked.classList.contains('active')) {
                document.querySelector('.active').classList.remove('active');
                clicked.classList.add("active");
            }

            clicked.classList.toggle("ascending");
            
            const sortKey = clicked.getAttribute('data-header-id');
            const isAscending =  clicked.classList.contains("ascending");
            const sorted = this.sortResults(sortKey, isAscending, this.getFilteredData());
            const sliced = this.slicedData(sorted);
            
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
    sortResults(sortKey, isAscending, array){
        function compare(a, b) {
            let itemA = a[sortKey];
            let itemB = b[sortKey];
            let comparison = 0;
            comparison = itemA > itemB ? 1 : 0;
            comparison = itemA < itemB ? -1 : 1;
            isAscending ? comparison *= 1 : comparison *= -1;
            return comparison;
        }
        let sorted = array.sort(compare);
        return sorted;
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