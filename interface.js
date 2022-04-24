class MenuInterface {
    constructor() {
        this.createCellsMenu = [];
        let createCellsMenuLabels = ['rows', 'cols', 'Create Cells'];
        CreateMenuGroupRow2(this.createCellsMenu, createCellsMenuLabels, 10);
        this.createCellsMenu[2].style('width', '100px');

        this.startMenu = [];
        this.startMenu[0] = createButton("Start");
        this.startMenu[0].position(width + 10, 90);
        this.startMenu[0].style('width', '280px');

        let radioOperator = createRadio();
        radioOperator.option(' ←↕→', 'verhor');
        radioOperator.option('⤡⤢', 'diag');
        radioOperator.option(' ←↕→ + ⤡⤢', 'all');
        radioOperator.selected('verhor');
        radioOperator.position(width + 10, 120);
        this.startMenu.push(radioOperator);

        let radioBothDirection = createRadio();
        radioBothDirection.option("one direction", "onedir");
        radioBothDirection.option("both direction", "bothdir");
        radioBothDirection.selected("onedir");
        radioBothDirection.position(width + 10, 140);
        this.startMenu.push(radioBothDirection);

        this.saveMenu = [];
        let saveFileMenuLabels = ['FileName', 'Save'];
        CreateMenuGroupRow1(this.saveMenu, saveFileMenuLabels, 180);
        this.loadMenu = [];

        let menuResultText = createElement('h5', "Passed cells");
        menuResultText.position(width + 10, 380);
        this.resultTextArea = createElement('textarea');
        this.resultTextArea.attribute("rows", "6");
        this.resultTextArea.attribute("disabled", "disabled");
        this.resultTextArea.style('width', '280px');
        this.resultTextArea.position(width + 10, 420);

        let menuSolutionText = createElement('h5', "Found path");
        menuSolutionText.position(width + 10, 510);
        this.solutionTextArea = createElement('textarea');
        this.solutionTextArea.attribute("rows", "6");
        this.solutionTextArea.attribute("disabled", "disabled");
        this.solutionTextArea.style('width', '280px');
        this.solutionTextArea.position(width + 10, 550);
    }
}

function CreateMenuGroupRow2(menuGroup, labels, row_Ypos) {
    menuGroup[0] = createInput();
    menuGroup[1] = createInput();
    menuGroup[2] = createButton(labels[2]);

    for (let i = 0; i < menuGroup.length; i++) {
        menuGroup[i].position(width + 10 + 90 * i, row_Ypos + 40);
        menuGroup[i].style('width', '80px');
    }

    let menuTextGroup = [];

    for (let i = 0; i < 2; i++) {
        menuTextGroup[i] = createElement('h5', labels[i]);
        menuTextGroup[i].position(width + 10 + 90 * i, row_Ypos);
    }
}

function CreateMenuGroupRow1(menuGroup, labels, row_Ypos) {
  menuGroup[0] = createInput(); 
  menuGroup[1] = createButton(labels[1]);

  menuGroup[0].position(width + 10, row_Ypos + 40);
  menuGroup[0].style('width', '170px');
  menuGroup[1].position(width + 190, row_Ypos + 40);
  menuGroup[1].style('width', '80px');

  let menuText = createElement('h6', labels[0]);
  menuText.position(width + 10, row_Ypos);
}
