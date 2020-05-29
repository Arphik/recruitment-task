import Utils from "./Utils";
import { renderResults, renderPagination } from "./htmlTemplates";

export default class CompaniesData {
  /**
   * @constructor
   */
  constructor() {
    /** *
        * Data of companies gathered from two tables after summarize and calculate incomes for each one
        * @type {array}
        * @type {array} filteredData After application initialization contains full unfiltered data.
        * @type {number} pageNumber 
        this.wholeData;
        this.filteredData;
        this.pageNumber = 1;
        /**
        * @type {number} pageSize 
        */
    this.pageSize = 10;
    this.utils = new Utils();
    this.init();
  }

  setWholeData(data) {
    this.wholeData = data;
  }
  getWholeData() {
    return this.wholeData;
  }

  setFilteredData(data) {
    this.filteredData = data;
  }
  getFilteredData() {
    return this.filteredData;
  }

  /**
   *
   */
  init() {
    this.setupSelectors();

    this.fetchData().then((data) => {
      this.setWholeData(data);
      this.setFilteredData(data);
      const sorted = this.sortResults("id", true, this.wholeData);
      const sliced = this.slicedData(sorted);
      renderResults(sliced, this.dataRows);
      renderPagination(this.getWholeData(), this.paginationSelect);
      this.addEventsListeners();
    });
  }

  /**
   * Assigning to variable static elements of the HTML
   */
  setupSelectors() {
    // Search selectors
    this.searchInput = document.querySelector(".search__input");
    this.searchButton = document.querySelector(".search__button");
    // Pagination selectors
    this.paginationSelect = document.querySelector(".pagination__select");
    this.prevBtn = document.querySelector(".previous-page");
    this.nextBtn = document.querySelector(".next-page");
    // Table selectors
    this.headers = document.querySelectorAll("[data-header-id]");
    this.dataRows = document.querySelector(".data-rows");
    this.loading = document.querySelector(".loading");
  }

  /**
   * Assigning event listeners to static elements of the HTML
   */
  addEventsListeners() {
    // Search event listeners
    this.searchInput.addEventListener("submit", (event) => {
      event.preventDefault();
    });
    this.searchButton.addEventListener("click", () => {
      const filteredData = this.filterByKeyword(
        this.searchInput.value,
        this.wholeData
      );
      this.setFilteredData(filteredData);
      renderResults(this.slicedData(this.filteredData), this.dataRows);
      renderPagination(this.filteredData, this.paginationSelect);
    }); // Search event listeners END

    this.headers.forEach((el) =>
      el.addEventListener("click", (event) => {
        const clicked = event.target;
        if (clicked.hasAttribute("data-header-id") === false) {
          return;
        }

        if (!clicked.classList.contains("active")) {
          document.querySelector(".active").classList.remove("active");
          clicked.classList.add("active");
        }

        clicked.classList.toggle("ascending");

        const sortKey = clicked.getAttribute("data-header-id");
        const isAscending = clicked.classList.contains("ascending");
        const sorted = this.sortResults(
          sortKey,
          isAscending,
          this.getFilteredData()
        );
        const sliced = this.slicedData(sorted);

        renderResults(sliced, this.dataRows);
      })
    );

    // Pagination event listeners
    this.prevBtn.addEventListener("click", () => {
      if (this.paginationSelect.value > 1) {
        const sliced = this.slicedData(
          this.getFilteredData(),
          Number(this.paginationSelect.value) - 1
        );
        this.paginationSelect.value = Number(this.paginationSelect.value) - 1;
        renderResults(sliced, this.dataRows);
      }
    });
    this.nextBtn.addEventListener("click", () => {
      if (this.paginationSelect.value < this.paginationSelect.length) {
        const sliced = this.slicedData(
          this.getFilteredData(),
          Number(this.paginationSelect.value) + 1
        );
        this.paginationSelect.value = Number(this.paginationSelect.value) + 1;
        renderResults(sliced, this.dataRows);
      }
    });
    this.paginationSelect.addEventListener("change", (event) => {
      const sliced = this.slicedData(
        this.getFilteredData(),
        Number(event.target.value)
      );
      renderResults(sliced, this.dataRows);
    }); // Pagination event listeners END
  }

  /**
   * Using fetch(url) and get companies data, then convert response to json.
   * Next, Promise.all make sure that another data table is loaded and converted to json before next step which is modifying companies array.
   * Now the algorithm for every company object add some extra properties, which are calculated by function countIncomes.
   * Function fetchData is used in init() with then(), where class variable wholeData and filteredData is
   * filled with complete data about companies and their incomes.
   */
  fetchData() {
    return this.utils
      .connectToOrigin("https://recruitment.hal.skygate.io/companies")
      .then((response) => response.json())
      .then((companies) => {
        // calculate total, average and last income
        return Promise.all(
          companies.map((company) =>
            this.utils
              .connectToOrigin(
                `https://recruitment.hal.skygate.io/incomes/${company.id}`
              )
              .then((response) => response.json())
          )
        ).then((companyIncomes) => {
          const mergedCompaniesIncomes = [];
          companies.forEach((company, index) => {
            mergedCompaniesIncomes.push({
              ...company,
              ...this.countIncomes(companyIncomes[index]),
            });
          });
          return mergedCompaniesIncomes;
        });
      });
  }

  /**
   * Return object with calculated: sum of all company incomes, average income from sum, 
   * and sum of incomes from last month
   * @param {array} companyIncomes Array of objects with income and date
   */
  countIncomes(companyIncomes) {
    const sum = this.utils.getTotalIncome(companyIncomes.incomes);
    const sortedIncomes = this.sortResults(
      "date",
      false,
      companyIncomes.incomes
    );
    const lastDate = new Date(sortedIncomes[0].date);
    const lastMonthDate = new Date(lastDate.getFullYear(), lastDate.getMonth());
    return {
      totalIncome: sum,
      averageIncome: (sum / companyIncomes.incomes.length).toFixed(2),
      lastMonthIncomes: this.utils.getTotalIncome(
        sortedIncomes.filter((income) => new Date(income.date) >= lastMonthDate)
      ),
    };
  }

  /**
   * Function serves for pagination, it needs filtered, or whole data, page which user requested and number of rows that will be rendered.
   * @param {array} filteredData
   * @param {number} pageNumber Requested page by user
   * @param {number} pageSize Default 10 rows on page
   */
  slicedData(filteredData, pageNumber = 1, pageSize = 10) {
    const firstRow = (pageNumber - 1) * pageSize;
    const lastRow = firstRow + pageSize;
    return filteredData.slice(firstRow, lastRow);
  }

  /**
   * Filtering start when input text have some content and Search button is clicked, if text is empty table will be filled with defaults start rows.
   * Function is using filter with callback on global variable companiesData. If one of the properties is similar to keyWords,
   * object from array is returning by filter to newArray. After complete filtering results are sorted by id, in ascending order.
   * @param {string} searchKeyword String from search input
   * @param {array} data All data from API
   */
  filterByKeyword(searchKeyword, data) {
    searchKeyword = this.searchInput.value;
    this.setFilteredData();
    return data.filter((company) =>
      Object.values(company).some((value) => {
        return String(value)
          .toUpperCase()
          .includes(searchKeyword.toUpperCase());
      })
    );
  }

  // SORTING
  /**
   * 
   * @param {string} sortKey Column symbol by which sorting is made
   * @param {boolean} isAscending If true sorting ascending, else descending
   * @param {array} array Filtered or not data from API
   */
  sortResults(sortKey, isAscending, array) {
    function compare(a, b) {
      const itemA = a[sortKey];
      const itemB = b[sortKey];
      let comparison = 0;
      comparison = itemA > itemB ? 1 : 0;
      comparison = itemA < itemB ? -1 : 1;
      isAscending ? (comparison *= 1) : (comparison *= -1);
      return comparison;
    }
    const sorted = array.sort(compare);
    return sorted;
  }
  // SORTING END

  changeSortBtn() {}

  changePage(requestedPage = 1, rowsSeen = 10) {
    const firstRowLoaded = (requestedPage - 1) * 10;
    const lastRowLoaed = firstRowLoaded + rowsSeen;

    Array.prototype.slice
      .call(document.querySelectorAll(".showed-row")) // Hiding all rows
      .map((row) => row.setAttribute("class", "hidden-row"));

    Array.prototype.slice
      .call(document.querySelectorAll(".hidden-row")) // Showing rows depending on start and how many
      .slice(firstRowLoaded, lastRowLoaed)
      .map((row) => row.setAttribute("class", "showed-row row"));
  }
}
