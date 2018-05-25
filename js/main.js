var logger = null;

$(function(){
   logger = document.getElementById('log');
   
   initTheBoard(); 
});

function log(obj){
    logger.innerHTML+=(""+obj+"<br />");
}


var wire_type_0_shape = '<polygon id="TMPL_WIREID" class="wire TMPL_LITNOLIT" points="28 0 28 36 36 36 36 0" transform="rotate(TMPL_ROTANG, 32.5 32.5)" />'
var wire_type_1_shape = '<polygon id="TMPL_WIREID" class="wire TMPL_LITNOLIT" points="28 0 28 65 36 65 36 0" transform="rotate(TMPL_ROTANG 32.5 32.5)" />'
var wire_type_2_shape = '<polygon id="TMPL_WIREID" class="wire TMPL_LITNOLIT" points="28 0 28 36 65 36 65 28 36 28 36 0" transform="rotate(TMPL_ROTANG 32.5 32.5)" />'
var wire_type_3_shape = '<polygon id="TMPL_WIREID" class="wire TMPL_LITNOLIT" points="28 0 28 28 0 28 0 36 65 36 65 28 36 28 36 0" transform="rotate(TMPL_ROTANG 32.5 32.5)" />'

var wire_types = [
    {
      id : 0,
      shape : wire_type_0_shape,
      
      //in rotation i it is connected to squares 0 up 1 left 2 down 3 right
      
      connectedTo:[[0],[1],[2],[3]]      
    },
    
    {
        id : 1,
        shape : wire_type_1_shape,
        connectedTo:[[0,2],[1,3],[0,2],[1,3]]
    },
    
    {
        id : 2,
        shape : wire_type_2_shape,
        connectedTo : [[0,3],[0,1],[1,2],[2,3]]
    },
    
    {
        id : 3,
        shape : wire_type_3_shape,
        connectedTo:[[0,1,3],[0,1,2],[1,2,3],[2,3,0]]
    }
    
];


var tileSVG = '<svg id="TMPL_SVGID" height="65" width="65" style="background-color:black"><g class="tile" id="TMPL_GID" >  <rect x="1" y="1" width="64" height="64" style="stroke:blue; stroke-width:1;" />  TMPL_WIRE_PLACE_HOLDER  TMPL_BUILDING_PLACE_HOLDER </g></svg>';
var houseSvg = '<polygon id="TMPL_BUIDINGID" class="house TMPL_LITNOLIT" points="33 20 15 32 22 32 22 50 44 50 44 32 51 32" style=" stroke:gray;" />';
var powerPlantSvg = '<polygon id="TMPL_BUIDINGID" class="house TMPL_LITNOLIT" points="10 12 10 46 55 46 55 46 55 8 45 8 45 29" style=" stroke:gray;" />';



var tile_types = [
                    { 
                        name : 'house',
                        shape : houseSvg
                    },
                    {
                        name : 'power_plant',
                        shape : powerPlantSvg
                    },
                    {
                        name : 'wire',
                        shape : ''
                    }
                ];


function drawTile(tile){
    
    var ans = tileSVG;
    
    var wireStr = tile.wireType.shape;
    
    ans = ans.replace("TMPL_SVGID","tilesvg-"+tile.row+"-"+tile.col);
    ans = ans.replace("TMPL_GID","grp-"+tile.row+"-"+tile.col);
    
    wireStr = wireStr.replace("TMPL_WIREID","wire-"+tile.row+"-"+tile.col);
    wireStr = wireStr.replace("TMPL_ROTANG",""+(-90*tile.rotation));
    
    ans = ans.replace('TMPL_WIRE_PLACE_HOLDER',wireStr);
    ans = ans.replace('TMPL_BUILDING_PLACE_HOLDER',tile.tileType.shape);
    ans = ans.replace('TMPL_BUIDINGID',"building-"+tile.row+"-"+tile.col)
    
    var find = 'TMPL_LITNOLIT';
    var re = new RegExp(find, 'g');
    
    ans = ans.replace(re,(tile.isLit)?'lit':'nolit');
    
    return ans;
    
}




function Tile(tileType,wireType,rotation,isLit,row,col){
    this.tileType = tileType;
    this.wireType = wireType;
    this.rotation = rotation;
    this.isLit = isLit;
    this.row = row;
    this.col = col;
    
    this.isConnectedTo = function(anotherTile){
       ///alert('11');
        var nowConnceted = this.wireType.connectedTo[this.rotation];
        
        var dr = [-1,0,1,0];
        var dc = [0,-1,0,1];
        
        for(var i=0;i<nowConnceted.length;i++){
            if ((anotherTile.row == this.row+dr[nowConnceted[i]]) && (anotherTile.col == this.col+dc[nowConnceted[i]]))
                return true;                
        }
        
        return false;
    }
    
}


var theProblem = null;
var gameWidth = 5;
var gameHeight = 5;

function initTheBoard(){
    
    //make a problem
    theProblem = makeAProblem(gameWidth,gameHeight);    
    
    //draw images
    drawTheProblem(theProblem,'gameMainArea',gameWidth,gameHeight);
    
    //assign the event handlers
    assignEventHandlers();
}


function assignEventHandlers(){
    $('g.tile').click(function(){
        var a = this.id.split('-');
        updateTileRotation(parseInt(a[1]),parseInt(a[2]));
    })
}

function updateTileRotation(r,c){
    theProblem[r][c].rotation = (theProblem[r][c].rotation +1)%4;
    propagateLit(theProblem);
    drawTheProblem(theProblem,'gameMainArea',gameWidth,gameHeight);
    assignEventHandlers();    
}

function drawTheProblem(problem,divName,numberOfXTiles,numberOfYTiles){

    var ans = "<table cellspacing='0px' cellpadding='0px'>";
    
    for(var i=0;i<numberOfYTiles;i++){
        ans+="<tr>"
        for(var j=0;j<numberOfXTiles;j++){
            ans+="<td id='"+"boardtd-"+i+"-"+j+"'>"+drawTile(problem[i][j])+"</td>";
        }
        ans+="</tr>"
    }
    
    $("#"+divName).html(ans);

}



function makeAProblem(numberOfXTiles,numberOfYTiles){
    
    var isLit = [true,false];
    
    var ans = [];
    
    var powerPlantRow = getRandomInt(0,numberOfYTiles-1);
    var powerPlantCol = getRandomInt(0,numberOfXTiles-1);
    
    var tree = makeATree(numberOfYTiles,numberOfXTiles);
    
    for(var i=0;i<numberOfYTiles;i++){
        temp=[];
        for(var j=0;j<numberOfXTiles;j++){
            
            var wType = wire_types[tree[i][j]];
            
            var buildingType = 2;
            
            if (i==powerPlantRow && j == powerPlantCol){
                buildingType = 1;
            }
            else if (wType.id == 0 ){
                buildingType = 0;
            }
                   
            temp.push(new Tile(tile_types[buildingType],
                                wType,
                                getRandomInt(0,3),
                                buildingType == 1,i,j));
        }
        
        ans.push(temp);
        
    }
    
    propagateLit(ans);
    
    return ans;
    
}


function makeATree(rcnt,ccnt){
    
    
    //alert('lll');
    var ans = [];
    
    for(var i = 0; i<rcnt;i++){
        var temp = [];
        
        for(var j = 0; j<ccnt;j++){
            temp.push([]);
            temp[j].group = i+','+j;
        }    
        ans.push(temp);
    }

    var edges = [];
    
    for(var i = 0; i<rcnt-1;i++){
        for(var j = 0; j<ccnt-1;j++){
            edges.push({fr:i,fc:j,tr:i+1,tc:j});
            edges.push({fr:i,fc:j,tr:i,tc:j+1});
        }
    }
    
    for(var i = 0; i<rcnt-1;i++)
       edges.push({fr:i,fc:ccnt-1,tr:i+1,tc:ccnt-1});

    for(var i = 0; i<ccnt-1;i++)
       edges.push({fr:rcnt-1,fc:i,tr:rcnt-1,tc:i+1});
    
    edges = shuffle(edges);
    
    var edgesWeNeed = rcnt*ccnt-1;
    
    var i=-1;
    var edgesTaken=0;
    while(edgesTaken<edgesWeNeed && (i+1)<edges.length){
        
        i++;
        
        var currentEdge = edges[i];
        
        if (ans[currentEdge.fr][currentEdge.fc].length == 3) continue;
        if (ans[currentEdge.tr][currentEdge.tc].length == 3) continue;
        
        if (ans[currentEdge.fr][currentEdge.fc].group === ans[currentEdge.tr][currentEdge.tc].group) continue;
        
        var tempg = ans[currentEdge.fr][currentEdge.fc].group;
    
        
         for(var ii = 0; ii<rcnt;ii++){
           for(var jj = 0; jj<ccnt;jj++){
                if (ans[ii][jj].group==tempg){
                    
                    
                    ans[ii][jj].group = ans[currentEdge.tr][currentEdge.tc].group;}
           }
        }   
        
        ans[currentEdge.fr][currentEdge.fc].push(currentEdge);
        ans[currentEdge.tr][currentEdge.tc].push(currentEdge);
    
        edgesTaken++;
        
    }
     
    for(var i = 0; i<rcnt;i++){
        for(var j = 0; j<ccnt;j++){
            if (ans[i][j].length == 2){
                var dr1 =ans[i][j][0].tr-ans[i][j][0].fr;
                var dc1 =ans[i][j][0].tc-ans[i][j][0].fc;
                var dr2 =ans[i][j][1].tr-ans[i][j][1].fr;
                var dc2 =ans[i][j][1].tc-ans[i][j][1].fc;
                
                ans[i][j] = 2;
                if (dr1+dr2==0) ans[i][j]=1;
                if (dc1+dc2==0) ans[i][j]=1;
            }
            else{
                ans[i][j]=(ans[i][j].length==1)?0:3;
            }        
        }
    }
    
    return ans;
    
}


function propagateLit(problem){
    var rcnt = problem.length;
    var ccnt = problem[0].length;
    
    var powerPlantRow = -1;
    var powerPlantCol = -1;
    
    var visited = [];
    
    for(var i = 0; i<rcnt;i++){
        var temp = [];
        for(var j = 0; j<ccnt;j++){
            if (problem[i][j].tileType.name === "power_plant"){
                    var powerPlantRow = i;
                    var powerPlantCol = j;
                    temp.push(true);
            }
            else
            {
                problem[i][j].isLit=false;
                temp.push(false);
            }
        }
        visited.push(temp);
    }
        
    
    
    var dr = [-1,0,1,0];
    var dc = [0,-1,0,1];
    
    var queue = [{r:powerPlantRow,c:powerPlantCol}];
    
    while(queue.length>0){
        
        var newNode = queue.shift();
        visited[newNode.r][newNode.c] = true;
                
        for(var i=0;i<4;i++){
            
            var nextr = newNode.r+dr[i];
            var nextc = newNode.c+dc[i];
            
            if (nextr<0 || nextr>=rcnt) continue;
            if (nextc<0 || nextc>=ccnt) continue;
            if (visited[nextr][nextc]) continue;
            
            if (problem[newNode.r][newNode.c].isConnectedTo(problem[nextr][nextc])
                &&  problem[nextr][nextc].isConnectedTo(problem[newNode.r][newNode.c])){
                    problem[nextr][nextc].isLit = true;
                    queue.push({r:nextr,c:nextc});
                }
            
        }    
    }
    
    
    return problem;
    
    
}