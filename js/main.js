$(function(){
   //init the board
   initTheBoard(); 
});



var wire_type_0_shape = '<polygon id="TMPL_WIREID" class="wire" points="28 0 28 36 36 36 36 0" style="fill:yellow;" transform="rotate(TMPL_ROTANG, 32.5 32.5)" />'
var wire_type_1_shape = '<polygon id="TMPL_WIREID" class="wire" points="28 0 28 65 36 65 36 0" style="fill:yellow;" transform="rotate(TMPL_ROTANG 32.5 32.5)" />'
var wire_type_2_shape = '<polygon id="TMPL_WIREID" class="wire" points="28 0 28 36 65 36 65 28 36 28 36 0" style="fill:yellow;" transform="rotate(TMPL_ROTANG 32.5 32.5)" />'
var wire_type_3_shape = '<polygon id="TMPL_WIREID" class="wire" points="28 0 28 28 0 28 0 36 65 36 65 28 36 28 36 0" style="fill:yellow;" transform="rotate(TMPL_ROTANG 32.5 32.5)" />'

var wire_types = [
    {
      id : 0,
      shape : wire_type_0_shape,
      
      //in state i it is connected to squares 0 up 1 left 2 down 3 right
      
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


var tileSVG = '<svg id="TMPL_SVGID" height="65" width="65" style="background-color:black"><g id="TMPL_GID" >  <rect x="1" y="1" width="64" height="64" style="stroke:blue; stroke-width:1;" />  TMPL_WIRE_PLACE_HOLDER  TMPL_BUILDING_PLACE_HOLDER </g></svg>';
var trans = '';

var houseSvg = '<polygon id="TMPL_BUIDINGID" class="house" points="33 20 15 32 22 32 22 50 44 50 44 32 51 32" style="fill:white; stroke:gray;" />';
var powerPlantSvg = '<polygon id="TMPL_BUIDINGID" class="house" points="10 12 10 46 55 46 55 46 55 8 45 8 45 29" style="fill:white; stroke:gray;" />';



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
    wireStr = wireStr.replace("TMPL_ROTANG",""+(90*tile.rotation));
    
    
    ans = ans.replace('TMPL_WIRE_PLACE_HOLDER',wireStr);
    ans = ans.replace('TMPL_BUILDING_PLACE_HOLDER',tile.tileType.shape);
    ans = ans.replace('TMPL_BUIDINGID',"building-"+tile.row+"-"+tile.col)
    
    
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
        var nowConnceted = this.wireType.connectedTo[this.rotation];
        
        var dr = [-1,0,1,0];
        var dc = [0,-1,0,1];
        
        for(var i=0;i<nowConnceted.length;i++){
            if ((anotherTile.row == this.row+dr) && (anotherTile.col == this.col+dc))
                return true;                
        }
        
        return false;
    }
    
}




function initTheBoard(){
    

    
    //make a problem
    var problem = makeAProblem(8,9);    
    
    //draw images
    drawTheProblem(problem,'gameMainArea',8,9);
    
    
    //assign the event handlers
}


function drawTheProblem(problem,divName,numberOfXTiles,numberOfYTiles){

    alert('ht'+problem.length);

    var ans = "<table cellspacing='0px' cellpadding='0px'>";
    
    for(var i=0;i<numberOfYTiles;i++){
        ans+="<tr>"
        for(var j=0;j<numberOfXTiles;j++){
            //ans+="<td>"+"<img src='./images/elements/"+problem[i][j]+".png' />"+"</td>";
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
    
     
    
    
    for(var i=0;i<numberOfYTiles;i++){
        temp=[];
        for(var j=0;j<numberOfXTiles;j++){
            
            var wType = wire_types[getRandomInt(0,3)];
            
            
            
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
                                isLit[getRandomInt(0,1)],i,j));
        }
        
        ans.push(temp);
        
        
    }
    
    return ans;
    
}

