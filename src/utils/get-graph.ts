import { Graph, Pos, PosAndNeighbours, PosAndWeight } from "@src/types";

export const getGraph = (rows: number, cols: number, walls: Pos[], weights: Array<PosAndWeight>) : Graph => {
    const graph: Graph = {};
    
    for(let row = 0; row < rows; row++) {
        for(let col = 0; col < cols; col++) {
            const pos = { x: col, y: row };
            if(!walls.some(w => w.x === pos.x && w.y === pos.y)) {
                const neighbours = getNeighbours(pos, rows, cols, walls, weights);
                const key = `${pos.x},${pos.y}`;
                graph[key] = {pos,neighbours};
            }
        }
    }

    return graph;
}

const getNeighbours = (pos: Pos, rows: number, cols: number, walls: Pos[], weights: Array<PosAndWeight>) : Array<PosAndWeight> => {
    const directions = [
        // left
        {x:-1,y: 0},
        // up
        {x: 0,y:-1},
        // right
        {x: 1,y: 0},
        // down
        {x: 0,y: 1}
    ];  
    
    const result = [];
    
    for(let i = 0; i < directions.length; i++) {
        const direction = directions[i];
        const newPosition = {x: pos.x + direction.x, y: pos.y + direction.y };
        
        // check new position is on board and not a wall
        if(newPosition.x > -1 && newPosition.x < cols &&
            newPosition.y > -1 && newPosition.y < rows &&
            !walls.some(w => w.x === newPosition.x && w.y === newPosition.y)
        ) {
            const existing = weights.find(w => w.pos.x === newPosition.x && w.pos.y === newPosition.y);
            const weight = existing?.weight || 1;
            result.push({pos: newPosition, weight});
        }
        
    }
    
    return result;
}