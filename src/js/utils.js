export default class Utils {
  constructor() {}

  /**
   * Returns data from API as JSON
   * @param {string} url
   * @returns {Promise}
   */
  connectToOrigin(url) {
    try {
      return fetch(url);
    } catch (error) {
      console.log("There was a connection error: ", error);
    }
  }

  /**
   * Calculate sum of properties of array
   * @param {array} incomesObjects Array of objects each one contains income and date
   * @returns {string} Sum
   */
  getTotalIncome(incomesObjects) {
    const calc = incomesObjects
      .reduce((prev, curr) => prev + Number(curr.value), 0)
      .toFixed(2);
    return calc;
  }
}
