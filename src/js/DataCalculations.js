import {sortResults} from './DataOperations';

/**
 * Return object with calculated: sum of all company incomes, average income from sum,
 * and sum of incomes from last month
 * @param {array} companyIncomes Array of objects with income and date
 * @returns {{totalIncome: string, averageIncome: string, lastMonthIncomes: string}}
 */
export const countIncomes = (companyIncomes) => {
    const sum = countTotalIncome(companyIncomes.incomes);
    const sortedIncomes = sortResults("date", false, companyIncomes.incomes);
    const lastDate = new Date(sortedIncomes[0].date);
    const lastMonthDate = new Date(lastDate.getFullYear(), lastDate.getMonth());
    return {
      totalIncome: sum,
      averageIncome: Number((sum / companyIncomes.incomes.length).toFixed(2)),
      lastMonthIncomes: countTotalIncome(sortedIncomes.filter((income) => new Date(income.date) >= lastMonthDate)),
    };
}
  

/**
 * Calculate sum of properties of array
 * @param {array} incomesObjects Array of objects each one contains income and date
 * @returns {string} Sum
 */
export const countTotalIncome = (incomesObjects) => {
    const calc = incomesObjects
        .reduce((prev, curr) => prev + Number(curr.value), 0)
        .toFixed(2);
    return Number(calc);
}