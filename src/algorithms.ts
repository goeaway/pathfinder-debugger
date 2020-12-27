import { Algo } from "./types";

const algorithms : Array<Algo> = [
    {
        id: "astar",
        name: "A Star",
        source: `board.run(algorithm);

async function algorithm(settings) {
    const { columns: x, rows: y, start, end, walls } = settings;
    let open = [createNode(start)];
    let closed = [];

    while(open.length != 0 && !board.cancelled()) {
        // get the current smallest length node in the open
        let current = getSmallest(open);
        
        // we've found the end node, and can therefore return 
        // the recursively built list of positions
        if(current.pos.x === end.x && current.pos.y === end.y) {
            return current.getList();
        }
        
        let indexOfCurrent = open.indexOf(current);
        open.splice(indexOfCurrent, 1);
        
        closed.push(current);
        let neighbours = getNeighbours();

        for(let i = 0; i < neighbours.length; i++) {
            let n = neighbours[i];
            let newX = current.pos.x + n.x;
            let newY = current.pos.y + n.y;
            // don't continue if position is off board, or a wall, or already closed
            if(!posValid({x:newX,y:newY}, x, y, walls) || closed.some(c => c.pos.x === newX && c.pos.y === newY)) {
                continue;
            }
            
            
            // if position is already in the open, just update it if we're now closer
            if(open.some(c => c.pos.x === newX && c.pos.y === newY)) {
                let openNode = open.find(o => o.pos.x === newX && o.pos.y === newY);
                var newFrom = Math.abs(newX - start.x) + Math.abs(newY - start.y);
                
                if(newFrom < openNode.fromStart) {
                    openNode.fromStart = newFrom;
                    openNode.previous = current;
                }
                
            } else { // otherwise add a new open node 
                // call updater so debugger can see what we're touching
                await board.updater([{pos: {x:newX,y:newY}, checkCountUpdate: 1}]);
                open.push(createNode(
                    {x:newX,y:newY},
                    Math.abs(newX - start.x) + Math.abs(newY - start.y),
                    Math.abs(newX - end.x) + Math.abs(newY - end.y),
                    current
                ));
            }
        }  
    }

    // was not possible to create a path
    return null;
}

function posValid(pos, xUpperBound, yUpperBound, walls) {
    // pos is in grid and not a wall
    return pos.x > -1 && pos.x < xUpperBound &&
            pos.y > -1 && pos.y < yUpperBound &&
        !walls.some(w => w.x === pos.x && w.y === pos.y);
}

function getNeighbours() {
    return [
        // left
        {x:-1,y: 0},
        // up
        {x: 0,y:-1},
        // right
        {x: 1,y: 0},
        // down
        {x: 0,y: 1}
    ];
}

function createNode(pos, fromStart, toEnd, previous) {
    fromStart = fromStart || 0;
    toEnd = toEnd || 0;

    return {
        pos,
        fromStart,
        toEnd,
        combined: fromStart + toEnd,
        previous,
        getList: function() {
            // recursively get a list of nodes, including this one and the one that lead to it (previous)
            if(!this.previous) {
                return [this.pos];
            }
            
            let prev = this.previous.getList();
            prev.push(this.pos);
            return prev;
        }
    }
}

function getSmallest(nodes) {
    // rank nodes by their combined size
    // of the smallest combined, return the one with the smallest toEnd value
    const copy = [...nodes];
    copy.sort((a,b) => {
        if(a.combined == b.combined) {
            return a.toEnd - b.toEnd;
        }
        return a.combined - b.combined;
    });
    return copy[0];
}
        `
    },
    {
        id: "custom",
        name: "Custom",
        source: `board.run(algorithm);
        
async function algorithm(settings) {
    const { columns, rows, start, end, walls } = settings;
    // add your code here   
    // call updater within your algorithm to update the board whenever you want
    // await board.updater([{pos: {x:newX,y:newY}, checkCountUpdate: 1}]);
}`
    }
];

export default algorithms;