const CellStatus = {
    Unvisited: 1,
    Visited: 2,
    Visited2: 3,
    Path: 4
};

const CellPurpose = {
    None: 1,
    Start: 2,
    Finish: 3
};

class Cell {
    constructor(x, y, w = 30, h = 30, passable = true, value = 0, status = CellStatus.Unvisited) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.passable = passable;
        this.status = status;
        this.purpose = CellPurpose.None;
        this.value = value;
    }

    display() {
        this.render_square();
        this.render_text();
    }

    isInside() {
        return mouseX > this.x && mouseX < this.x + this.w &&
            mouseY > this.y && mouseY < this.y + this.h;
    }

    render_square() {
        let highlight = 0;
        //if (this.isInside()) {
        //    highlight += 40;
        //}

        stroke(150);
        strokeWeight(1);

        if (this.passable) {
            switch (this.status) {
                case (CellStatus.Unvisited):
                    fill(215 + highlight);
                    break;
                case (CellStatus.Visited):
                    fill(66 + highlight, 155 + highlight, 184 + highlight);
                    break;
                case (CellStatus.Visited2):
                    fill(255, 211 + highlight, highlight);
                    break;
                case (CellStatus.Path):
                    fill(210 + highlight, 31 + highlight, 60 + highlight);
                    break;
            }
        }
        else {
            fill(highlight);
        }

        rect(this.x, this.y, this.w, this.h);

        if (this.passable && this.purpose != CellPurpose.None) {
            switch (this.purpose) {
                case (CellPurpose.Start):
                    stroke(253, 106, 2);
                    strokeWeight(3);
                    break;
                case (CellPurpose.Finish):
                    stroke(0, 168, 107);
                    strokeWeight(3);
                    break;
            }
            noFill();
            rect(this.x + 2, this.y + 2, this.w - 4, this.h - 4);
        }
    }

    render_text() {
        noStroke();
        if (this.passable && this.status == CellStatus.Unvisited) {
            fill(0);
        }
        else {
            fill(255);
        }
        textSize(15);
        text(this.value, this.x + (this.w - textWidth(this.value)) / 2, this.y + this.h / 2 + ((textAscent() + textDescent()) / 4));
    }
}
