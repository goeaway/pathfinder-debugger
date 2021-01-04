import { Algo } from "./types";

const algorithms : Array<Algo> = [
    {
        id: "astar",
        name: "A Star",
        type: "unweighted",
        source: `board.run(algorithm);

async function algorithm(settings, updater) {
    const { graph, start, end } = settings;
    
    let open = [createNode(start)];
    let closed = [];

    while(open.length != 0) {
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

        // use the current.pos in this string representation to query the graph
        const currentKey = current.pos.x + "," + current.pos.y;
        // get neighbours for current.
        const { neighbours } = graph[currentKey];

        for(let i = 0; i < neighbours.length; i++) {
            let n = neighbours[i];
            let newX = n.pos.x;
            let newY = n.pos.y;
            // don't continue if position is already closed
            if(closed.some(c => c.pos.x === newX && c.pos.y === newY)) {
                continue;
            }
            
            // call updater so debugger can see what we're touching
            await updater([{pos: n.pos, checkCountUpdate: 1}]);

            // if position is already in the open, just update it if we're now closer
            if(open.some(c => c.pos.x === newX && c.pos.y === newY)) {
                let openNode = open.find(o => o.pos.x === newX && o.pos.y === newY);
                var newFrom = Math.abs(newX - start.x) + Math.abs(newY - start.y);
                
                if(newFrom < openNode.fromStart) {
                    openNode.fromStart = newFrom;
                    openNode.previous = current;
                }
                
            } else { // otherwise add a new open node 
                open.push(createNode(
                    n.pos,
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
        return a.combined - b.combined;
    });
    
    return copy[0];
}`
    },
    {
        id: "dijkstra",
        name: "Dijkstra's",
        type: "weighted",
        source: `board.run(algorithm);
        
async function algorithm(settings, updater) {
    const { graph, start, end } = settings;
    
    // keep track of nodes that have been done so we don't go back to them
    const finished = [];
    // create a queue of nodes to visit with the start in it
    let queue = [createNode(start, 0, null)];
    
    // break cases inside!
    while(queue.length) {
        const current = queue[0];

        // add current to finished, remove from queue
        current.final = current.working;
        finished.push(current);
        
        // we've reached the end, and should backtrack through the finished collection
        // to find the shortest route
        if(current.pos.x === end.x && current.pos.y === end.y) {
            return current.getList();
        }
        
        // use the current.pos in this string representation to query the graph
        const currentKey = current.pos.x + "," + current.pos.y;
        // get neighbours for current.
        const { neighbours } = graph[currentKey];
        
        // check each neighbour
        // if in finished already, do nothing
        // if not, but already in queue, update its value in queue if the weight is less from current node
        // if not, and not in queue, add to queue with neighbour[i].working + current.working
        for(let i = 0; i < neighbours.length; i++) {
            const n = neighbours[i];
            if(finished.some(f => f.pos.x === n.pos.x && f.pos.y === n.pos.y)) {
                continue;
            }

            await updater([{pos: n.pos, checkCountUpdate: 1}]);
            
            const existingQueueIndex = queue.findIndex(q => q.pos.x === n.pos.x && q.pos.y === n.pos.y);
            // weight of node at n.pos is current working weight + weight from current to n (n.weightTo)
            const weight = current.working + n.weight;
            
            // if n.pos node is already in the queue, update its working weight if the weight from here
            // is lower
            if(existingQueueIndex > -1) {
                var neighbourCurrentWorking = queue[existingQueueIndex].working;
                if(neighbourCurrentWorking > weight) {
                    queue[existingQueueIndex].working = weight;
                }
            } else { // its not already in the queue, just add
                queue.push(createNode(n.pos, null, weight, current))
            }
        }
        
        queue.shift();
    
        // sort queue by working order
        queue.sort((a, b) => {
            if(a.working < b.working) {
                return -1;
            }
            
            if(a.working > b.working) {
                return 1;
            }
            
            return 0;
        });
    }
    
    // if we got here a path could not be found
    return null;
}

function createNode (pos, final, working, previous) {
    return {
        pos,
        final,
        working,
        previous,
        getList: function() {
            if(!this.previous) {
                return [this.pos];
            }
            
            const prev = this.previous.getList();
            prev.push(this.pos);
            return prev;
        }
    }
}`
    },
    {
        id: "custom",
        name: "Custom",
        type: "custom",
        source: `board.run(algorithm);
        
async function algorithm(settings, updater) {
    const { graph, start, end } = settings;
    
    // add your code here   
    
    // call updater within your algorithm to update the board whenever you want
    // await updater([{pos: {x:newX,y:newY}, checkCountUpdate: 1}]);

    // return an array of positions that are in the desired path or null if not possible
}`
    }
];

export default algorithms;