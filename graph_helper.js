const cell_size = 30;
var temp;
var newFrame = false;

class GraphHelper {
    constructor(graph, menu) {
        this.graph = graph;
        this.cells = null;
        this.menu = menu;
        this.start = null;
        this.finish = null;
    }

    DrawGraph() {
        if (!this.cells && temp) {
          this.cells = temp;
          this.RefreshCellsStatus();
          this.CreateGraph();
        }
        else if (this.cells) {
            for (let i = 0; i < this.cells.length; i++) {
                render_coord(cell_size + i * cell_size, 0, cell_size, cell_size, i);
                for (let j = 0; j < this.cells[i].length; j++) {
                    this.cells[i][j].display();
                }
            }
            for (let i = 0; i < this.cells[0].length; i++) {
                render_coord(0, cell_size + i * cell_size, cell_size, cell_size, i);
            }
        }
        newFrame = false;
    }

    RefreshCellsStatus() {
        if (this.cells) {
            for (let i = 0; i < this.cells.length; i++) {
                for (let j = 0; j < this.cells[i].length; j++) {
                    this.cells[i][j].status = CellStatus.Unvisited;
                    this.cells[i][j].value = this.cells[i][j].passable ? 0 : -1;
                }
            }
        }
        newFrame = true;
    }

    CreateCells() {
        temp = null;
        let rows = this.menu.createCellsMenu[0].value();
        let cols = this.menu.createCellsMenu[1].value();
        this.cells = [];
        for (let i = 0; i < cols; i++) {
            let row = [];
            for (let j = 0; j < rows; j++) {
                row.push(new Cell(cell_size + i * cell_size, cell_size + j * cell_size, cell_size, cell_size, true, 0));
            }
            this.cells.push(row);
        }
        newFrame = true;
    }

    CreateGraph() {
        if (this.cells) {
            for (let i = 0; i < this.cells.length; i++) {
                for (let j = 0; j < this.cells[i].length; j++) {
                    this.graph.addVertex(new Vertex(i + "." + j, this.cells[i][j].passable));
                }
            }
        }
    }

    SetOperator() {
        if (this.cells) {
            var operator = this.menu.startMenu[1].value();
            for (let i = 0; i < this.cells.length; i++) {
                for (let j = 0; j < this.cells[i].length; j++) {
                    let curV = this.graph.getVertex(i + "." + j);
                    curV.adjs = [];

                    if (operator == "verhor" || operator == "all") {
                        this.setConnection(curV, i + "." + (j - 1));
                        this.setConnection(curV, i + "." + (j + 1));
                        this.setConnection(curV, (i - 1) + "." + j);
                        this.setConnection(curV, (i + 1) + "." + j);
                    }
                    if (operator == "diag" || operator == "all") {
                        this.setConnection(curV, (i + 1) + "." + (j - 1));
                        this.setConnection(curV, (i + 1) + "." + (j + 1));
                        this.setConnection(curV, (i - 1) + "." + (j - 1));
                        this.setConnection(curV, (i - 1) + "." + (j + 1));
                    }
                }
            }
        }
    }


    setConnection(curV, label) {
        let v = this.graph.getVertex(label);
        if (v) {
            this.graph.addEdge(curV, v);
        }
    }


    ChangeVertexPurpose(is_for_passable) {
        if (this.cells) {
            for (let i = 0; i < this.cells.length; i++) {
                for (let j = 0; j < this.cells[i].length; j++) {
                    if (this.cells[i][j].isInside()) {
                        if (is_for_passable) {
                            this.cells[i][j].passable = !this.cells[i][j].passable;
                            let vertex = this.graph.getVertex(i + "." + j);
                            vertex.passable = this.cells[i][j].passable;
                            this.cells[i][j].value = this.cells[i][j].passable ? 0 : -1;
                        }
                        else if (this.cells[i][j].passable) {
                            if (!this.finish && this.start) {
                                this.finish = this.graph.getVertex(i + "." + j);
                                this.cells[i][j].purpose = CellPurpose.Finish;
                            }
                            else {
                                if (this.start) {
                                    let indexes = this.start.label.split('.');
                                    this.cells[indexes[0]][indexes[1]].purpose = CellPurpose.None;
                                    indexes = this.finish.label.split('.');
                                    this.cells[indexes[0]][indexes[1]].purpose = CellPurpose.None;
                                }
                                this.start = graph.getVertex(i + "." + j);
                                this.finish = null;
                                this.cells[i][j].purpose = CellPurpose.Start;
                            }
                        }
                        break;
                    }
                }
            }
        }
        newFrame = true;
    }

    async Start() {
        if (!(this.start && this.finish)) {
            return;
        }

        this.menu.resultTextArea.value('');
        this.menu.solutionTextArea.value('');

        this.graph.startSearch(this.start, this.finish, this.menu.startMenu[2].value());


        let str = '';

        if (this.menu.startMenu[2].value() == "onedir") {
            let lvl = 0;
            for (let i = 0; i < this.graph.result.length; i++) {
                if (this.graph.result[i].level > lvl) {
                    lvl += 1;
                    str = str.slice(0, -2);
                    str += " | ";
                    newFrame = true;
                    await delay(200);
                }
                str += this.graph.result[i].label + ', ';
                this.menu.resultTextArea.value(str);
                let indexes = this.graph.result[i].label.split('.');
                this.cells[indexes[0]][indexes[1]].status = CellStatus.Visited;
                this.cells[indexes[0]][indexes[1]].value = lvl;
            }
            
            newFrame = true;
            str = str.slice(0, -2);
            this.menu.resultTextArea.value(str);

            await delay(200);

            if (this.finish.mainParent != null) {
                str = '';
                let total_length = 0;
                let currentVertex = this.finish;
                while (currentVertex != null) {
                    let indexes = currentVertex.label.split('.');
                    let cell = this.cells[indexes[0]][indexes[1]];
                    if (cell.status == CellStatus.Path) {
                        break;
                    }
                    str = currentVertex.label + '->' + str;

                    total_length += 1;
                    this.menu.solutionTextArea.value(str);
                    cell.status = CellStatus.Path;
                    newFrame = true;
                    await delay(50);
                    currentVertex = currentVertex.mainParent;
                }
                
                newFrame = true;
                str = str.slice(0, -2);
                this.menu.solutionTextArea.value(str + "\nTotal Length: " + total_length);
            }
            else {
                this.menu.solutionTextArea.value("Path doesn't exist.");
            }
        }

        else {
            let lvl = 0;
            let target = "start";
            let i = 0;
            let j = 0;

            while (true) {
                if (target == "start") {
                    if (!this.graph.result[i] || this.graph.result[i].level > lvl) {
                        str = str.slice(0, -2);
                        str += " | ";
                        this.menu.resultTextArea.value(str);
                        target = "finish";
                    }
                    else {
                        str += this.graph.result[i].label + ', ';
                        let indexes = this.graph.result[i].label.split('.');
                        this.cells[indexes[0]][indexes[1]].status = CellStatus.Visited;
                        this.cells[indexes[0]][indexes[1]].value = lvl;
                        i++;
                    }
                }
                else {
                    if (!this.graph.result_2[j] || this.graph.result_2[j].level > lvl) {
                        if (!this.graph.result[i]) {
                            break;
                        }
                        str = str.slice(0, -2);
                        str += " | ";
                        this.menu.resultTextArea.value(str);
                        newFrame = true;
                        await delay(200);
                        lvl += 1;
                        target = "start";
                    }
                    else {
                        str += this.graph.result_2[j].label + ', ';
                        let indexes = this.graph.result_2[j].label.split('.');
                        this.cells[indexes[0]][indexes[1]].status = CellStatus.Visited2;
                        this.cells[indexes[0]][indexes[1]].value = lvl;
                        j++;
                    }
                }
            }
            str = str.slice(0, -2);
            this.menu.resultTextArea.value(str);
            
            newFrame = true;
            await delay(200);

            if (this.graph.finishMarker_2 != null) {
                str = '';
                let total_length = 0;
                let currentVertex_2 = this.graph.finishMarker_2;
                while (currentVertex_2 != null) {
                    let indexes = currentVertex_2.label.split('.');
                    let cell = this.cells[indexes[0]][indexes[1]];
                    if (cell.status == CellStatus.Path) {
                        break;
                    }
                    str = str + '->' + currentVertex_2.label;
                    total_length += 1;
                    this.menu.solutionTextArea.value(str);
                    cell.status = CellStatus.Path;
                    newFrame = true;
                    await delay(50);
                    currentVertex_2 = currentVertex_2.mainParent;
                }

                str = str.slice(2, str.length);

                let currentVertex_1 = this.graph.finishMarker_1;
                while (currentVertex_1 != null) {
                    let indexes = currentVertex_1.label.split('.');
                    let cell = this.cells[indexes[0]][indexes[1]];
                    if (cell.status == CellStatus.Path) {
                        break;
                    }
                    str = currentVertex_1.label + '->' + str;
                    total_length += 1;
                    this.menu.solutionTextArea.value(str);
                    cell.status = CellStatus.Path;
                    newFrame = true;
                    await delay(50);
                    currentVertex_1 = currentVertex_1.mainParent;
                }
                this.menu.solutionTextArea.value(str + "\nTotal Length: " + total_length);
            }
            else {
                this.menu.solutionTextArea.value("Path doesn't exist.");
            }
            
            newFrame = true;
        }
    }
    
    save_file() {
      var cells_json = [];
      for(let row of this.cells) {
        var row_json = [];
        for (let cell of row) {
          row_json.push(cell.value);
        }
        cells_json.push(row_json);
      }
      saveJSON(cells_json, this.menu.saveMenu[0].value());
    }
    
    load_file(file_name) {
      temp = null;
      this.cells = null;
      loadJSON(file_name, this.fill_cells);  
    }
    
    fill_cells(cells_json) {
      var cells = [];
        for (let i = 0; i < cells_json.length; i++) {
            let row = [];
            for (let j = 0; j < cells_json[i].length; j++) {
                let passable = cells_json[i][j] != -1;
                row.push(new Cell(cell_size + i * cell_size, cell_size + j * cell_size, cell_size, cell_size, passable, cells_json[i][j]));
            }
            cells.push(row);
        }
      temp = cells;
      newFrame = true;
    }
}

function render_coord(x, y, w, h, value) {
    noStroke();
    fill(255);
    textSize(15);
    text(value, x + (w - textWidth(value)) / 2, y + h / 2 + ((textAscent() + textDescent()) / 4));
}

const delay = ms => new Promise(res => setTimeout(res, ms));
