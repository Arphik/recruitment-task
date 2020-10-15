import {sortResults, sliceData, filterByKeyword} from './DataOperations';
import {renderResults, renderPagination, changeSortBtn} from './RenderingFunctions';
import CompaniesData from './CompaniesData';

export default class UserFunctions{

    constructor(){
        this.cData = new CompaniesData();
        this.paginationSelect = document.querySelector(".pagination__select");
        this.addEventsListeners();
    }

    /**
     * 
     * @param {string} keyword 
     */
    searchData(keyword){
      const filteredData = filterByKeyword(
        keyword,
        this.cData.getWholeData()
      );
      this.cData.setFilteredData(filteredData);
      renderResults(sliceData(this.cData.getFilteredData()), this.dataRows);
      renderPagination(this.cData.getFilteredData(), this.paginationSelect);
    }
  
    /**
     * 
     * @param {string} sortKey 
     * @param {boolean} isAscending 
     */
    sortData(sortKey, isAscending){
      const sorted = sortResults(
        sortKey,
        isAscending,
        this.cData.getFilteredData()
      );
  
      this.cData.setFilteredData(sorted);
      const sliced = sliceData(sorted, this.paginationSelect.value);
  
      renderResults(sliced, this.dataRows);
    }
  
    /**
     * 
     * @param {number} page 
     */
    changePage(page){
      const sliced = sliceData(
        this.cData.getFilteredData(),
        page
      );
      this.paginationSelect.value = page;
      renderResults(sliced, this.dataRows);
    }

    /**
     * Assigning event listeners to static elements of the HTML
     */
    addEventsListeners() {
      /**
       * Search event listener
       */
      document.querySelector(".search__button").addEventListener("click", () => {
        this.searchData(document.querySelector(".search__input").value);
      }); // Search event listeners END
  
      /**
       * Check what header button user clicked, get boolean from function
       * changeSortBtn and pass them to sorting method with filtered data
       * After that get array from sliceData method and pass it
       * to renderResults function
       */
      document.querySelectorAll("[data-header-id]").forEach((el) =>
        el.addEventListener("click", (event) => {
          const sortKey = event.target.getAttribute("data-header-id");
          const isAscending = changeSortBtn(event.target);
          this.sortData(sortKey, isAscending);
        })
      );
  
      // Pagination event listeners
      document.querySelector(".previous-page").addEventListener("click", () => {
        if(this.paginationSelect.value > 1){
          this.changePage(Number(this.paginationSelect.value) - 1);
        }
      });
      document.querySelector(".next-page").addEventListener("click", () => {
        if (this.paginationSelect.value < this.paginationSelect.length) {
          this.changePage(Number(this.paginationSelect.value) + 1);
        }
      });
      this.paginationSelect.addEventListener("change", (event) => {
        this.changePage(Number(event.target.value));
      }); // Pagination event listeners END
    }
}