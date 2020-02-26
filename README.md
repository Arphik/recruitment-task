# test-project
 
Spis treści:
1. Download data
2. Sort
3. Filter
4. Pagination
5. CSS
6. RWD

 Application cam get companies data from API and show it as table. Can also filter, sort by all columns, sorting can be done ascended, and descended. Data is divided to 10 results per page.
 
 1. Downloading data:
 It is done by getData, which is using fetch(url) and get companies data, then convert response to json. 
 Next, Promise.all make sure that ano ther data table is loaded and converted to json before next step which is modifying companies array. 
 Now the algorithm for every company array row add some extra properties to object, which are calculated by functions declarated before Promise.all, getTotalIncome() and getLastIncome().
 Function getData is used on line 20 with then(), where global variable is filled with complete data about companies and their incomes.
