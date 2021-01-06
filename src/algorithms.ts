import { Algo } from "./types";

const algorithms : Array<Algo> = [
    {
        id: "astar",
        name: "A Star",
        type: "weighted",
        source: `class Solution {
    async algorithm(settings, updater, canceller) {
        const { graph, start, end } = settings;
        
        const open = [this.createNode(start)];
        const closed = [];

        while(open.length != 0) {
            canceller();

            // get the current smallest length node in the open
            const current = this.getSmallest(open);
            
            // we've found the end node, and can therefore return 
            // the recursively built list of positions
            if(current.pos.x === end.x && current.pos.y === end.y) {
                return current.getList();
            }
            
            const indexOfCurrent = open.indexOf(current);
            open.splice(indexOfCurrent, 1);
            
            closed.push(current);

            // use the current.pos in this string representation to query the graph
            const currentKey = current.pos.x + "," + current.pos.y;
            // get neighbours for current.
            const { neighbours } = graph[currentKey];

            for(let i = 0; i < neighbours.length; i++) {
                const n = neighbours[i];
                const newX = n.pos.x;
                const newY = n.pos.y;
                
                // don't continue if position is already closed
                if(closed.some(c => c.pos.x === newX && c.pos.y === newY)) {
                    continue;
                }
                
                // call updater so debugger can see what we're touching
                await updater([{pos: n.pos, checkCountUpdate: 1}]);

                // if position is already in the open, just update it if we're now closer
                const existingOpenIndex = open.findIndex(o => o.pos.x === newX && o.pos.y === newY);
                const nodeFromStart = current.fromStart + n.weight;

                if(existingOpenIndex > -1) {
                    const openNode = open[existingOpenIndex];
                    
                    if(nodeFromStart < openNode.fromStart) {
                        openNode.fromStart = nodeFromStart;
                        openNode.previous = current;
                    }
                    
                } else { // otherwise add a new open node 
                    open.push(this.createNode(
                        n.pos,
                        nodeFromStart,
                        Math.abs(newX - end.x) + Math.abs(newY - end.y),
                        current
                    ));
                }
            }  
        }

        // was not possible to create a path
        return null;
    }

    createNode(pos, fromStart, toEnd, previous) {
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

    getSmallest(nodes) {
        // rank nodes by their combined size
        // of the smallest combined, return the one with the smallest toEnd value
        const copy = [...nodes];
        copy.sort((a,b) => {
            return a.combined - b.combined;
        });
        
        return copy[0];
    }
}`
    },
    {
        id: "dijkstra",
        name: "Dijkstra's",
        type: "weighted",
        source: `class Solution {
    async algorithm(settings, updater, canceller) {
        const { graph, start, end } = settings;
        
        // keep track of nodes that have been done so we don't go back to them
        const finished = [];
        // create a queue of nodes to visit with the start in it
        let queue = [this.createNode(start, 0, null)];
        
        // break cases inside!
        while(queue.length) {
            canceller();

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
                    queue.push(this.createNode(n.pos, null, weight, current))
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

    createNode (pos, final, working, previous) {
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
    }
}`
    },
    {
        id: "bfs",
        name: "BFS",
        type: "unweighted",
        source: `class Solution {
    // The pathfinder debugger API will call this function when the run starts
    async algorithm(settings, updater, canceller) {
        // get the graph, start and end from the settings provided
        const { graph, start, end } = settings;
        
        const root = this.createNode(start);
        const finished = [root];
        const queue = [root];
        
        while(queue.length) {
            canceller();
            const node = queue.shift();
            if(node.pos.x === end.x && node.pos.y === end.y) {
                return node.getList();
            }
            
            const nodeKey = node.pos.x + "," + node.pos.y;
            
            const { neighbours } = graph[nodeKey];
            
            for(const n of neighbours) {
                // don't add if already finished
                if(finished.findIndex(f => f.pos.x === n.pos.x && f.pos.y === n.pos.y) !== -1) {
                    continue;
                }
            
                await updater([{pos: n.pos, checkCountUpdate: 1}]);
                
                // create node
                const nNode = this.createNode(n.pos, node);
                queue.push(nNode);
                finished.push(nNode);
            }
        }
        
        // return null to signify a complete path from start to end could not be found
        return null;
    }
    
    createNode(pos, previous) {
        return {
            pos,
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
        };
    }
}`
    },
    {
        id: "custom",
        name: "Custom",
        type: "custom",
        source: `class Solution {
    // The pathfinder debugger API will call this function when the run starts
    async algorithm(settings, updater, canceller) {
        // get the graph, start and end from the settings provided
        const { graph, start, end } = settings;
        
        // todo: implement your algorithm here
        // - if a valid route is found between start and end, 
        //   return an array of all the positions on the route
        
        // - query the graph object to get the neighbours of a position:
        //   const myPos = {x: 1, y: 1};
        //   const myKey = myPos.x + "," + myPos.y; // object key should be in this string format

        // - below extracts collection in the format {pos: {x: number,y:number},weight: number}[]
        //   const { neighbours } = graph[myKey]; 
        
        // - call updater to update the board with the latest changes
        // - provide an array of positions you'd like to udpate, with the amount they should be updated by
        //   await updater([{pos: {x: 0, y: 0}, checkCountUpdate: 1 }])

        // - call canceller to stop your algorithm run when you press the stop button,
        // - this should be called regularly within your main loop 
        // - if a cancellation is detected it will throw an error, which will be handled by the pathfinder debugger API
        //   canceller();
        
        // return null to signify a complete path from start to end could not be found
        return null;
    }
}`
    }
];

export default algorithms;