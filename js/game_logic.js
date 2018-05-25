
//class Tile

function Tile(tileType,wireType,rotation,isLit,row,col){
    this.tileType = tileType;
    this.wireType = wireType;
    this.rotation = rotation;
    this.isLit = isLit;
    this.row = row;
    this.col = col;
    
    this.isConnectedTo = function(anotherTile){

        var nowConnceted = this.wireType.connectedTo[this.rotation];
        
        var dr = [-1,0,1,0];
        var dc = [0,-1,0,1];
        
        for(var i=0;i<nowConnceted.length;i++){
            if ((anotherTile.row == this.row+dr[nowConnceted[i]]) 
                && (anotherTile.col == this.col+dc[nowConnceted[i]]))
                return true;                
        }
        
        return false;
    }
    
}


//class Game Logic
function GameLogic(){

var wire_types = [
    {
      id : 0,
      //shape : wire_type_0_shape,
      
      //in rotation i it is connected to squares 0 up 1 left 2 down 3 right
      
      connectedTo:[[0],[1],[2],[3]]      
    },
    
    { id : 1, connectedTo:[[0,2],[1,3],[0,2],[1,3]] },
    
    { id : 2, connectedTo : [[0,3],[0,1],[1,2],[2,3]] },
    
    { id : 3, connectedTo:[[0,1,3],[0,1,2],[1,2,3],[2,3,0]] }
    
];

var tile_types = [
                    { name : 'house' },
                    { name : 'power_plant' },
                    { name : 'wire' }
                ];


this.makeAProblem = function(numberOfXTiles,numberOfYTiles){
    
    var isLit = [true,false];
    
    var ans = [];
    
    var powerPlantRow = getRandomInt(0,numberOfYTiles-1);
    var powerPlantCol = getRandomInt(0,numberOfXTiles-1);
    
    var tree = this.makeATree(numberOfYTiles,numberOfXTiles);
    
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
    
    this.propagateLit(ans);
    
    return ans;
    
};


this.makeATree = function(rcnt,ccnt){

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
        
        if (ans[currentEdge.fr][currentEdge.fc].group 
            === ans[currentEdge.tr][currentEdge.tc].group) continue;
        
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
    
};


this.propagateLit = function(problem){
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
    
    
};

this.updateTileRotation = function(problem,r,c){
    problem[r][c].rotation = (problem[r][c].rotation +1)%4;
    this.propagateLit(problem);    
};


}

