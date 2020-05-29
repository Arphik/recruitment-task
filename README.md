# test-project
 
Documentation:

1. Download data
2. Sorting
3. Filtering
4. Pagination

 Application cam get companies data from API and show it as table. Can also filter, sort by all columns, sorting can be done ascended, and descended. Data is divided to 10 results per page.
 
 1. 
 
2. 

3. 

4. Pagination is done by finding all html elements by querySelectorAll with class "hidden-row" which is given them when data is loaded.
On page loaded and data is completed function changePage is used and first ten rows is showed.
 To change to another results there are buttons on bottom. They have onclick function changePage(), it have two arguments, first set from which element for loop make up to ten elements visible by changing their classes, second limits the loop and by default is equal 10, but if on last page there are less results it is reduced. Also changPage is searching elements with class showed-row, and change them to class hidden-row.
