import {markVisited,markFinalPath,isVisited,isObstacle,reset} from './graph.js';

class Algorithms
{
    constructor(arr,start,end)
    {
        this.arr = arr;
        this.start = start;
        this.end = end;
        this.inProgress =false;
    }

    setStart(start)
    {
        this.start = start;
    }
    setEnd(end)
    {
        this.end = end;
    }
    setNewArr(arr)
    {
        this.arr = arr;
    }

    /*****************Astar******************* */
    async aStar(){ 
        this.inProgress = true;
        var start = this.start, end = this.end, arr = this.arr;
        
        var OpSet = new Set([JSON.stringify([start[0],start[1]])]);
        var clSet = new Set();
        
        var gArray = [], fArray=[], parent=[];
        
        for(let i = 0; i < arr.length; i++){
            var temp = [];
            var temp1 = [];
            var temp2 = [];
            for(let j = 0; j < arr[0].length; j++){
                temp.push(Number.MAX_VALUE); 
                temp1.push(Number.MAX_VALUE); 
                temp2.push([-1,-1]); 
                
            }
            
            gArray.push(temp);
            fArray.push(temp1);
            parent.push(temp2);
        }
        gArray[start[0]][start[1]] = 0;
        fArray[start[0]][start[1]] = await getH(start[0],start[1]);
        parent[start[0]][start[1]] = [start[0],start[1]];
        async function getMinNbr(){
            var minF = Number.MAX_VALUE, i = undefined, j = undefined;
            OpSet.forEach(n=>{ 
                let nbr = JSON.parse(n); 
                if(minF > fArray[nbr[0]][nbr[1]]){
                    i = nbr[0];
                    j = nbr[1];
                    minF = fArray[nbr[0]][nbr[1]];
                }
            });
            return [i,j];
        }
        
        async function updateOpenSet(row,col){
            
            var off = [1,0,-1,0,1];
            for(let i = 0; i < 4; i++){
                let curr_row = row + off[i], curr_col = col + off[i+1];
                if(curr_row>=0 && curr_row<arr.length && curr_col>=0 && curr_col<arr[0].length && !clSet.has(JSON.stringify([curr_row,curr_col])) && arr[curr_row][curr_col].className !== "cell obstacle"){
                    
                    let g_score = gArray[row][col] + 1;
                    if(gArray[curr_row][curr_col] > g_score && !isObstacle(arr[curr_row][curr_col])){
                        gArray[curr_row][curr_col] = g_score;
                        fArray[curr_row][curr_col] = g_score + await getH(curr_row,curr_col);
                        parent[curr_row][curr_col] = [row,col];
                    }
                    if(OpSet.has(JSON.stringify([curr_row,curr_col]))==false && !isObstacle(arr[curr_row][curr_col])){
                        OpSet.add(JSON.stringify([curr_row,curr_col]));
                        markVisited(arr[curr_row][curr_col]);
                    }
                    
                }
            }
            
        }
        function getH(i,j){
            return Math.abs(i-end[0]) + Math.abs(j-end[1]);
        }
        var current = undefined , i = start[0], j = start[1];
        while(OpSet.size > 0 && current != arr[end[0]][end[1]]){ 
            await sleep(0.1);
            let temp = await getMinNbr();
            i = temp[0];
            j = temp[1]; 
            current = arr[i][j];
            OpSet.delete(JSON.stringify([i,j]));
            clSet.add(JSON.stringify([i,j]));
            await updateOpenSet(i,j)
            
        }
        current==arr[end[0]][end[1]] ? await this.tracePathByParentArray(parent) : alert('Oops! No path exists.');
        this.inProgress = false;
    }

    async dfs()
    {
        this.inProgress = true;
        var start = this.start, end=this.end, off=[1,0,-1,0,1], path=[], arr=this.arr;

        async function dfs_call(row,col)
        {
            if(row<0 || row>=arr.length || col<0 || col>=arr[0].length || await isObstacle(arr[row][col]) || await isVisited(arr[row][col]))
            return false;

            if(row==end[0] && col==end[1])
            {
                path.push([row,col]);
                return true;
            }
            await markVisited(arr[row][col]);
            for(let i=0;i<4;i++)
            {
                await sleep(7);
                if(await dfs_call(row+off[i], col+off[i+1]))
                {
                    path.push([row,col]);
                    return true;
                }
            }
            return false;
        }
        await dfs_call(start[0],start[1])? await this.tracePathByPathArray(path):alert("Oops! No path exist");
        this.inProgress = false;
    }


    async bfs(){
        this.inProgress = true;
        var start = this.start, end = this.end, parent = [],arr = this.arr;
        for(let i = 0; i < arr.length; i++){
            var temp = [];
            for(let j = 0; j < arr[0]; j++){
                temp.push([-1,-1]);
            }
            parent.push(temp);
        }
        parent[start[0]][start[1]] = [start[0],start[1]];
        async function calling_bfs(){
            var a = new Array(), off = [1,0,-1,0,1];
            a.push([start[0],start[1]]);
            while(a.length>0){
                await sleep(50);
                var size = a.length;
                for(let x = 0; x < size; x++){
                    
                    if(a[0][0]==end[0] && a[0][1]==end[1])
                    return true;
                    var front = a[0];
                    a.shift();
                    for(let i = 0; i < 4; i++){
                        let num_row = front[0] + off[i], num_col = front[1] + off[i+1];
                        if(num_row>=0 && num_row<arr.length && num_col>=0 && num_col<arr[0].length && !isObstacle(arr[num_row][num_col]) && !isVisited(arr[num_row][num_col])){
                            parent[num_row][num_col] = [front[0],front[1]];
                            if(num_row==end[0] && num_col==end[1])
                            return true;
                            
                            a.push([num_row,num_col]);
                            markVisited(arr[num_row][num_col]);
                        }
                    }
                }
                
            }
            return false;
        }
        
        await calling_bfs()? await this.tracePathByParentArray(parent): alert('Oops! No path exists.');
        this.inProgress = false;
        
    }



    async dijkstra(){
        this.inProgress = true;
        
        var start = this.start, end = this.end, arr = this.arr;
        var dist = [];
        var parent = [];
        for(let i = 0; i < arr.length; i++){
            var temp = [], temp1 = [];
            for(let j = 0; j < arr[0].length; j++){
                temp.push(Number.MAX_VALUE);
                temp1.push([-1,-1]);
            }
            dist.push(temp);
            parent.push(temp1);
        }
        dist[start[0]][start[1]] = 0;
        parent[start[0]][start[1]] = [start[0],start[1]];
        function getPriority(pq){
            let minDist = Number.MAX_VALUE, i = -1, j = -1;
            pq.forEach(str=>{
                let curr = JSON.parse(str);
                if(minDist > dist[curr[0]][curr[1]]){
                    minDist = dist[curr[0]][curr[1]];
                    i = curr[0];
                    j = curr[1];
                }
            });
            pq.delete(JSON.stringify([i,j]));
            return [i,j];
        }
        
        async function dijikstra_call(){
            var pq = new Set();
            pq.add(JSON.stringify([start[0],start[1]]));
            var off = [1,0,-1,0,1];
            while(pq.size){
                await sleep(1);
                var priority_cell = getPriority(pq); 
                
                if(priority_cell[0]==end[0] && priority_cell[1]==end[1])
                return true;
                
                for(let i = 0; i < 4; i++){ 
                    let currRow = priority_cell[0]+off[i], currCol = priority_cell[1]+off[i+1];
                    if(currRow>=0 && currRow<arr.length && currCol>=0 && currCol<arr[0].length && !isObstacle(arr[currRow][currCol])){
                        if(currRow==end[0] && currCol==end[1]){
                            parent[currRow][currCol] = [priority_cell[0],priority_cell[1]];
                            return true;
                        }
                        
                        if(!isVisited(arr[currRow][currCol]) || dist[currRow][currCol] > dist[priority_cell[0]][priority_cell[1]] + 1){
                            dist[currRow][currCol] = dist[priority_cell[0]][priority_cell[1]] + 1;
                            parent[currRow][currCol] = [priority_cell[0],priority_cell[1]];
                            pq.add(JSON.stringify([currRow,currCol]));
                            markVisited(arr[currRow][currCol]);
                        }
                    }
                }
                
            }
            return false;
        }
        
        await dijikstra_call()? await this.tracePathByParentArray(parent): alert('No path exists :(');
        this.inProgress = false;
    }



    async tracePathByPathArray(path){
        reset(isVisited);
        for(let i = 0; i < path.length; i++){
            await sleep(20);
            markFinalPath(this.arr[path[i][0]][path[i][1]]);
        }
    }
    async tracePathByParentArray(parent){
        reset(isVisited);
        var i = this.end[0], j = this.end[1];
        
        while(i!=this.start[0] || j!=this.start[1]){
            await sleep(18);
            markFinalPath(this.arr[i][j]);
            var temp = parent[i][j][0];
            j = parent[i][j][1];
            i = temp;
        }
        markFinalPath(this.arr[this.start[0]][this.start[1]])
    }
    
}

export default Algorithms;