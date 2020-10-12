import Algorithms from './algo.js';


function select(t){
    if(type!=-1){
        document.querySelector("#btn-"+type).style.backgroundColor="";
    }
    if(t>-1){
        document.querySelector("#btn-"+t).style.backgroundColor="#dc3545";
        
    }
        type=t;
}

var arr = [], mouseDown=false, dragSrc=false, dragDest=false,g;
var start, end;

const src=`<div style="height:0px; width:0px; display:flex;color:white;align-items:center; pointer-events:none;"><i class="fas fa-running" style="font-size: 70%" aria-hidden="true"></i></div>`;
const dest = `<div style="height:0px; width:0px; display:flex;color:white;align-items:center; pointer-events: none;"><i class="fa fa-flag-checkered" style="font-size:70%;" aria-hidden="true"></i></div>`;

document.addEventListener('mouseup',()=>{mouseDown = false});

function markVisited(m)
{
    m.className = "cell visited";
}
function markEmpty(m)
{
    m.className = "cell";
}
function markFinalPath(m)
{
    m.className = "cell final"
}
function isFinal(m)
{
    return m.className == "cell final";
}
function isSrc(m){
    return m.innerHTML == src;
}
function isDest(m){
    return m.innerHTML == dest;
}
function isVisited(m){
    return m.className == "cell visited";
}
function isObstacle(m){
    return m.className == "cell obstacle";
}
function isEmpty(m){
    return m.className == "cell" && m.innerHTML=="";
}
function markObstacle(m){
    m.className = "cell obstacle";
}

async function makeCell(){
    
    if(g && g.inProgress){
        alert("A traversal already in progress. Please wait.");
        return;
    }
    
    $('#bars').hide();
    $('#table').show();
    $('#table').html("");
    arr=[];
    mouseDown = false;
    dragSrc = false;
    dragDest = false; 
    g=null;
    var table = $('#table');
    var height = table.height(), width = table.width(); 
    for(let i = 0; i<=height; i+=15){
        var row = document.createElement('tr');
        row.id="row"+(i/15);
        var matrix_row = [];
        for(let j = 0; j<=width; j+=15){
            var col = document.createElement('td');
            col.id=i/15+","+j/15;
            markEmpty(col);
            
            var mouse_down = function(e){
                mouseDown = true;
                if(isSrc(e.target))
                dragSrc = true;
                else if(isDest(e.target))
                dragDest = true;
            }
            
            col.addEventListener('touchstart',(e)=>{
                e.preventDefault();
                mouse_down(e);
            })
            
            col.addEventListener('mousedown',(e)=>{
                mouse_down(e);
            });
            
            var mouse_move = function(e){
                if(!mouseDown || isSrc(e.target) || isDest(e.target)) return;
                if(dragSrc){
                    e.target.innerHTML = src;
                    start = [parseInt(e.target.id.split(',')[0]),parseInt(e.target.id.split(',')[1])];
                }
                else if(dragDest){
                    e.target.innerHTML = dest;
                    end = [parseInt(e.target.id.split(',')[0]),parseInt(e.target.id.split(',')[1])];
                }
                
                else if(isEmpty(e.target)){
                    markObstacle(e.target);
                    e.target.isObstacle = true;
                }
                
            }
            
            var mouse_out = function(e){
                if(!mouseDown) return;
                if(dragSrc && !isDest(e.target) || dragDest && !isSrc(e.target)){
                    e.target.innerHTML = "";
                    if(e.target.isObstacle) 
                    markObstacle(e.target);
                    else
                    markEmpty(e.target);
                }
                
            }
            
            
            col.addEventListener('touchmove',(e)=>{
                e.preventDefault();
                var src = {target: document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)};
                if(src.target.tagName === "TD"){
                    if(dragSrc){
                        mouse_out(prevSrc);
                        prevSrc = src;
                    }else if(dragDest){
                        mouse_out(prevDest);
                        prevDest = src;
                    }
                    mouse_move(src);
                    prevSrc = src;
                }
                
                
            });
            
            col.addEventListener('mouseover',(e)=>{
                mouse_move(e);
            });
            
            col.addEventListener('mouseout', (e)=>{
                mouse_out(e);
            });
            
            
            var mouse_up = function(){
                dragDest = false;
                dragSrc = false;
            }
            
            col.addEventListener('mouseup', mouse_up);
            
            col.addEventListener('touchend',(e)=>{
                e.preventDefault();
                mouse_up();
            }); 
            
            
            row.appendChild(col);
            matrix_row.push(col);
        }
        table.append(row);
        arr.push(matrix_row);
    }
    let i = parseInt(arr.length/2);
    let j1 = parseInt(arr[0].length/4);
    let j2 = parseInt(arr[0].length/4)*3;
    $(arr[i][j1]).append(src);
    $(arr[i][j2]).append(dest);
    start = [i,j1];
    end = [i,j2];
    var prevSrc = {target: arr[i][j1]}, prevDest = {target: arr[i][j2]};
}


function start_graph()
{
    if(g && g.inProgress)
    {
        alert("Please Wait");
        return;
    }
    reset((obj)=>{
        return isVisited(obj) || isFinal(obj);
    });

    if(g)
    {
        g.setStart(start);
        g.setEnd(end);
    }
    else
    {
        g = new Algorithms(arr,start,end);
    }
    switch(type)
    {
        case 1: g.aStar();break;
        case 2: g.dijkstra();break;
        case 3: g.dfs();break;
        case 4: g.bfs();break;
        default: alert("Please Select an Algorithm");
    }
}

function reset(callback){
    
    for(let i = 0; i < arr.length; i++){
        for(let j = 0; j < arr[0].length; j++){
            if(callback(arr[i][j]))
            arr[i][j].className = "cell";
        }
    }
}

export {makeCell, start_graph, markVisited, markFinalPath, isVisited, isObstacle, reset, select};