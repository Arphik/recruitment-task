import DataGrid from './DataGrid.js';

document.addEventListener("DOMContentLoaded", function() {
    const datagrid = new DataGrid(document.querySelector("#grid-container"));

    datagrid.setDataGridTemplateHeaders(`
        <div class="dataGridHeader">
            <div>Id</div>
            <div>Name</div>
            <div>City</div>
            <div>Total Income</div>
            <div>Average Income</div>
            <div>Last Income</div>
        </div>
    `);

    datagrid.setDataGridTemplateRowCreator(function (data) {
        return `
            <div class="dataGridBody">
                <div data-key="id">${data.id} ${data.name.toUpperCase()}</div>
                <div data-key="name">${data.name}</div>
                <div data-key="city">${data.city}</div>
                <div>${data.totalIncome}</div>
                <div>${data.averageIncome}</div>
                <div>${data.lastIncome}</div>
            </div> 
        `
    });

    /*
    datagrid.setSortOptions({
        id: () => {
            const rawData = datagrid.getStoredData();
            const sortedData = rawData.sort() 
            datagrid.drawBody(sortedData);
        }
    })
    */

    datagrid.setDataFetcher(function() {
        return fetch("https://recruitment.hal.skygate.io/companies")
            .then((response) => response.json())
            .then((dataListGeneral) => {

                function getTotalIncome(detailsList) {
                    return 1; 
                }

                function getAverageIncome(detailsList) {
                    return 2;
                }

                function getLastIncome(detailsList) {
                    return new Date();
                }

                return Promise.all(
                    dataListGeneral.map((dataDetails) => 
                        fetch(`https://recruitment.hal.skygate.io/incomes/${dataDetails.id}`)
                            .then((x) => x.json())
                        )
                ).then((detailsPromises) => {
                    const targetDataList = [];

                    dataListGeneral.forEach((dataGeneral, index) => {
                        targetDataList.push({                        
                            id: dataGeneral.id,
                            name: dataGeneral.name,
                            city: dataGeneral.city,
                            totalIncome: getTotalIncome(detailsPromises[index]),
                            averageIncome: getAverageIncome(detailsPromises[index]),
                            lastIncome: getLastIncome(detailsPromises[index])
                        })
                    });

                    return targetDataList;
                })

            })
    });

    // a na koncu build, ktory uruchomi juz wszystko w odpowiedniej kolejnosci
    datagrid.build();

});// strzalkowe mogles zostawic to akurat ogarniam, ok inny przyklad



function dodaj(fn1, fn2) {
    return fn1(1) + fn2(1);
}

dodaj((a) => a + 1, (b) => b + 1); // teraz bedzie ile? 4 tak