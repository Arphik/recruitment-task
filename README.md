# test-project
 
Documentation:

1. Download data
2. Sorting
3. Filtering
4. Pagination

 Application cam get companies data from API and show it as table. Can also filter, sort by all columns, sorting can be done ascended, and descended. Data is divided to 10 results per page.
 
 1. Downloading data is done by getData, which is using fetch(url) and get companies data, then convert response to json. 
 Next, Promise.all make sure that ano ther data table is loaded and converted to json before next step which is modifying companies array. 
 Now the algorithm for every company array row add some extra properties to object, which are calculated by functions declarated before Promise.all, getTotalIncome() and getLastIncome().
 Function getData is used on line 20 with then(), where global variable is filled with complete data about companies and their incomes.
 
2. Sorting is made by clicking on column name. Function has 3 arguments, per which column, then order, and array which must be sorted.
Array have default value from function transformRowsToArray. When page is loaded array comes from getData, after that by, clicking column name, data come from html elements which are converted to array.

3. Filtering start when input text have some content and Search button is clicked, if text is empty table will be filled with defaults start rows. Function is using filter with callback on global variable companiesData. If one of the properties is similar to keyWords, object from array is returning by filter to newArray. After complete filtering results are sorted by id, in ascending order.

4. Pagination is done by finding all html elements by querySelectorAll with class "hidden-row" which is given them when data is loaded.
On page loaded and data is completed function changePage is used and first ten rows is showed.
 To change to another results there are buttons on bottom. They have onclick function changePage(), it have two arguments, first set from which element for loop make up to ten elements visible by changing their classes, second limits the loop and by default is equal 10, but if on last page there are less results it is reduced.
 changPage is searching elements with class showed-row, and change them to class hidden-row
 then 