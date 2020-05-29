export default class Utils {
  constructor() {}

  connectToOrigin(url) {
    try {
      return fetch(url);
    } catch (error) {
      console.log("There was a connection error: ", error);
    }
  }

  /**
   *
   * @param {array} incomesObjects Array of objects each one contains income and date
   */
  getTotalIncome(incomesObjects) {
    const calc = incomesObjects
      .reduce((prev, curr) => {
        return prev + Number(curr.value);
      }, 0)
      .toFixed(2);
    return calc;
  }
}
