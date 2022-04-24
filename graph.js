class Graph {
    constructor() {
        this.vertexes = [];
        this.result = [];
        this.result_2 = [];
        this.startVertex = null;
        this.finishVertex = null;
        this.finishMarker_1 = null;
        this.finishMarker_2 = null;
        this.success = false;
    }

    getVertex(vertex_label) {
        for (let i = 0; i < this.vertexes.length; i++) {
            if (this.vertexes[i].label == vertex_label) {
                return this.vertexes[i];
            }
        }
        return false;
    }

    addVertex(vertex) {
        this.vertexes.push(vertex);
    }

    delVertex(vertex) {
        for (let i = 0; i < this.vertexes.length; i++) {
            this.delEdge(this.vertexes[i], vertex);
        }
        for (let i = 0; i < this.vertexes.length; i++) {
            if (this.vertexes[i].label == vertex.label) {
                this.vertexes.splice(i, 1);
                break;
            }
        }
    }

    addEdge(vertex1, vertex2) {
        vertex1.adjs.push(vertex2);
    }

    delEdge(vertex1, vertex2) {
        for (let i = 0; i < vertex1.adjs.length; i++) {
            if (vertex1.adjs[i].label == vertex2.label) {
                vertex1.adjs.splice(i, 1);
                break;
            }
        }
    }

    edgeExists(vertex1, vertex2) {
        for (let i = 0; i < vertex1.adjs.length; i++) {
            if (vertex1.adjs[i].label == vertex2.label) {
                return true;
            }
        }
        return false;
    }

    BFS() {
        this.startVertex.visited = true;
        this.result.push(this.startVertex);

        let queue = [];
        queue.push(this.startVertex);


        while (queue.length != 0) {
            let currentVertex = queue.shift();
            for (let i = 0; i < currentVertex.adjs.length; i++) {
                if (currentVertex.adjs[i].visited == false) {
                    currentVertex.adjs[i].visited = true;
                    currentVertex.adjs[i].mainParent = currentVertex;
                    currentVertex.adjs[i].level = currentVertex.level + 1;
                    this.result.push(currentVertex.adjs[i]);
                    if (currentVertex.adjs[i].label == this.finishVertex.label) {
                        return;
                    }
                    queue.push(currentVertex.adjs[i]);
                }
            }
        }
    }


    BFS_2() {
        this.startVertex.visited = true;
        this.finishVertex.visited = true;
        this.result.push(this.startVertex);
        this.result_2.push(this.finishVertex);

        let queue_1 = [];
        queue_1.push(this.startVertex);
        let queue_2 = [];
        queue_2.push(this.finishVertex);

        let level_1 = 0;
        let level_2 = 0;
        let target = "start";

        while (queue_1.length != 0 || queue_2.length != 0) {
            if (queue_1.length == 0) {
                target = "finish";
            }
            if (target == "start") {
                let currentVertex_1 = queue_1.shift();
                for (let i = 0; i < currentVertex_1.adjs.length; i++) {
                    let new_level;
                    if (currentVertex_1.adjs[i].visited == false) {
                        new_level = currentVertex_1.level + 1;
                        if (new_level > level_1) {
                            queue_1.push(currentVertex_1);
                            level_1 = new_level;
                            target = "finish";
                            break;
                        }
                        else {
                            currentVertex_1.adjs[i].mainParent = currentVertex_1;
                            currentVertex_1.adjs[i].level = new_level;
                            currentVertex_1.adjs[i].visited = true;
                            queue_1.push(currentVertex_1.adjs[i]);
                            this.result.push(currentVertex_1.adjs[i]);
                            for (let m = 0; m < currentVertex_1.adjs[i].adjs.length; m++) {
                                for (let n = 0; n < this.result_2.length; n++) {
                                    if (currentVertex_1.adjs[i].adjs[m] == this.result_2[n]) {
                                        this.finishMarker_1 = currentVertex_1.adjs[i];
                                        this.finishMarker_2 = this.result_2[n];
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (queue_2.length == 0) {
                target = "start";
            }
            if (target == "finish") {
                let currentVertex_2 = queue_2.shift();
                for (let i = 0; i < currentVertex_2.adjs.length; i++) {
                    let new_level;
                    if (currentVertex_2.adjs[i].visited == false) {
                        new_level = currentVertex_2.level + 1;
                        if (new_level > level_2) {
                            queue_2.push(currentVertex_2);
                            level_2 = new_level;
                            target = "start";
                            break;
                        }
                        else {
                            currentVertex_2.adjs[i].mainParent = currentVertex_2;
                            currentVertex_2.adjs[i].level = new_level;
                            currentVertex_2.adjs[i].visited = true;
                            queue_2.push(currentVertex_2.adjs[i]);
                            this.result_2.push(currentVertex_2.adjs[i]);

                            for (let m = 0; m < currentVertex_2.adjs[i].adjs.length; m++) {
                                for (let n = 0; n < this.result.length; n++) {
                                    if (currentVertex_2.adjs[i].adjs[m] == this.result[n]) {
                                        this.finishMarker_2 = currentVertex_2.adjs[i];
                                        this.finishMarker_1 = this.result[n];
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    startSearch(startVertex, finishVertex, direction) {
        this.result = [];
        this.result_2 = [];
        this.startVertex = startVertex;
        this.finishVertex = finishVertex;
        this.success = false;

        for (let i = 0; i < this.vertexes.length; i++) {
            this.vertexes[i].visited = !this.vertexes[i].passable;
            this.vertexes[i].level = 0;
            this.vertexes[i].mainParent = null;
        }

        if (direction == "onedir") {
            this.BFS();
        }
        else {
            this.BFS_2();
        }
    }
}

class Vertex {
    constructor(label, passable = true) {
        this.label = label;
        this.level = 0;
        this.visited = false;
        this.passable = passable;
        this.adjs = [];
        this.mainParent = null;
    }
}
