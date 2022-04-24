var graph;
var menu;

function setup() {
    createCanvas(660, 660);
    background(0);
        
    graph = new Graph();
    menu = new MenuInterface();
    graphHelper = new GraphHelper(graph, menu);

    menu.createCellsMenu[2].mousePressed(GraphHelperCreateCells);
    menu.startMenu[0].mousePressed(GraphHelperStart);
    menu.saveMenu[1].mousePressed(GraphHelperSave);
    var input = createFileInput(HandleFile);
    input.position(width + 10, 250);
}

function draw() {
    if (newFrame) {
        background(0);
        graphHelper.DrawGraph();
    }
}

function mousePressed() {
    graphHelper.ChangeVertexPurpose(keyCode != 17);
}

function keyReleased() {
    keyCode = null;
}

function GraphHelperCreateCells() {
    graphHelper.CreateCells();
    graphHelper.CreateGraph();
}

function GraphHelperStart() {
    graphHelper.CreateGraph();
    graphHelper.SetOperator();
    graphHelper.RefreshCellsStatus();
    graphHelper.Start();
}

function GraphHelperSave() {
    graphHelper.save_file();
}

function HandleFile(file) {
    graphHelper.load_file(file.name);
}
