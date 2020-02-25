class DataGrid {
    constructor($container) {
        if ($container instanceof HTMLElement === false) {
            throw Error("To initialize datagrid, you have to pass valid html element.");
        }

        this.$container = $container;
    }

    setDataGridTemplateHeaders(dataGridTemplateHeaders) {
        this.dataGridTemplateHeaders = dataGridTemplateHeaders;
    }

    setDataGridTemplateRowCreator(dataGridTemplateRowCreator) {
        this.dataGridTemplateRowCreator = dataGridTemplateRowCreator;
    }

    setDataFetcher(dataFetcher) {
        this.dataFetcher = dataFetcher;
    }

    build() {
        return this.dataFetcher()
            .then((dataList) => {
                this.clearDataGrid();
                this.drawHeader();
                this.drawBody(dataList)
            })
    }

    drawHeader() {
        this.$container.innerHTML = this.dataGridTemplateHeaders;
    }

    drawBody(dataList) {
        dataList.forEach((data) => {
            this.$container.insertAdjacentHTML('beforeend', this.dataGridTemplateRowCreator(data));
        });
    }

    clearDataGrid() {
        this.$container.innerHTML = "";
    };
}


export default DataGrid;