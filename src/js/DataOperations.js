import {countIncomes} from './DataCalculations';

  /**
   * Using fetch(url) and get companies data, then convert response to json.
   * Next, Promise.all make sure that another data table is loaded and converted to json before next step which is modifying companies array.
   * Now the algorithm for every company object add some extra properties, which are calculated by function countIncomes.
   * Function fetchData is used in init() with then(), where class variable wholeData and filteredData is
   * filled with complete data about companies and their incomes.
   * @returns {object}
   */
// export const fetchData = async () => {
//     return connectToOrigin("https://recruitment.hal.skygate.io/companies")
//       .then((response) => response.json())
//       .then((companies) => {
//         // calculate total, average and last income
//         return Promise.all(
//           companies.map((company) =>
//             connectToOrigin(`https://recruitment.hal.skygate.io/incomes/${company.id}`)
//               .then((response) => response.json())
//         ))
//         .then((companyIncomes) => {
//           const mergedCompaniesIncomes = [];
//           companies.forEach((company, index) => {
//             mergedCompaniesIncomes.push({
//               ...company,
//               ...countIncomes(companyIncomes[index]),
//             });
//           });
//           return mergedCompaniesIncomes;
//         });
//       });
//   }

  export const fetchData = async (url) => {
    try {
      const response = await connectToOrigin(url);
      const companies = await response.json();

      return companies;
    } catch (error) {
      console.log(`There was an error in fetching ${url}:`);
      throw error;
    }
  }

  export const mergeData = async () => {
    const companies = await fetchData("https://recruitment.hal.skygate.io/companies");
      // calculate total, average and last income
      return Promise.all(companies.map(async (company) => {
        const companyIncomes = await fetchData(`https://recruitment.hal.skygate.io/incomes/${company.id}`);

        return{
            ...company,
            ...countIncomes(companyIncomes),
          };
      }));
    }

  /**
   * Returns data from API as JSON
   * @param {string} url
   * @returns {Promise}
   */
  const connectToOrigin = (url) => {
    try {
      return fetch(url);
    } catch (error) {
      console.log("There was a connection error: ", error);
    }
  }

  // SORTING
  /**
   * Function is using custom method to compare two items
   * Parameter from isAscending come from changeSortBtn
   * If true sorting ascending else descending
   * @param {string} sortKey Column symbol by which sorting is made
   * @param {boolean} isAscending If true sorting ascending, else descending
   * @param {array} array Filtered or not data from API
   * @returns {array}
   */
  export const sortResults = (sortKey, isAscending, array) => {
    // console.log("SORTING, DATA ", array);
    return [...array].sort((a, b) =>
        a[sortKey] === b[sortKey] ? 0 : 
        a[sortKey] > b[sortKey] ? 
          isAscending ? 1 : -1 : 
          isAscending ? -1 : 1
    );
  }
  // SORTING END

  /**
   * Filtering start when input text have some content and Search button is clickedSortBtn, if text is empty table will be filled with defaults start rows.
   * Function is using filter with callback on global variable companiesData. If one of the properties is similar to keyWords,
   * object from array is returning by filter to newArray. After complete filtering results are sorted by id, in ascending order.
   * @param {string} searchKeyword String from search input
   * @param {array} data All data from API
   * @returns {array}
   */
  export const filterByKeyword = (searchKeyword, data) => {
    return data.filter((company) =>
      Object.values(company).some((value) => {
        return String(value)
          .toUpperCase()
          .includes(searchKeyword.toUpperCase());
      })
    );
  }

  /**
   * Function serves for pagination, it needs filtered, or whole data, page which user requested and number of rows that will be rendered.
   * @param {array} filteredData
   * @param {number} pageNumber Requested page by user
   * @param {number} pageSize Default 10 rows on page
   * @returns {array} Part of data array which will fit in one page by, default 10 items
   */
  export const sliceData = (filteredData, pageNumber = 1, pageSize = 10) => {
    const firstRow = (pageNumber - 1) * pageSize;
    const lastRow = firstRow + pageSize;
    return filteredData.slice(firstRow, lastRow);
  }