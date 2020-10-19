
import {renderResults, renderPagination} from './RenderingFunctions';
import {mergeData, sortResults,  sliceData} from './DataOperations';
import UserFunctions from './UserFunctions';

export default class CompaniesData {
  /**
   * @constructor
   */
  constructor() {
    this.wholeData;
    this.filteredData;
    this.pageNumber = 1;
    this.pageSize = 10;
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
   * When application is loaded, it assigning static elements to variables
   * fetch and then sort data ascending, slice from it 10 first items and render them.
   * It also render pagination and add event listeners to static elements
   */
  init() {
    mergeData().then((data) => {

      this.setWholeData(data);
      this.setFilteredData(data);
      
      const sorted = sortResults("id", true, this.wholeData);
      const sliced = sliceData(sorted);

      renderResults(sliced);
      renderPagination(this.getWholeData());

      console.log('INIT DATA', this.getWholeData());

    });
  }
}
