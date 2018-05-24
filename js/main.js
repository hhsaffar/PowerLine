$(function(){
   //init the board
   initTheBoard(); 
});




function initTheBoard(){
    
    //draw the board
    
    drawTheBoard('gameMainDiv');
    
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
            ans+="<td>"+"<img src='./images/elements/"+problem[i][j]+".png' />"+"</td>";
        }
        ans+="</tr>"
    }
    
    $("#"+divName).html(ans);

}

function makeAProblem(numberOfXTiles,numberOfYTiles){

    
    var tileTypes = [{id:0,numberOfPossibleRots:0},
                     {id:1,numberOfPossibleRots:2},
                     {id:2,numberOfPossibleRots:4},
                     {id:3,numberOfPossibleRots:4}];
    
    
    var ans = [];
    
    for(var i=0;i<numberOfYTiles;i++){
        temp=[];
        for(var j=0;j<numberOfXTiles;j++){
            var theTile = tileTypes[getRandomInt(0,tileTypes.length-1)];
             
            temp.push(theTile.id+'-'+getRandomInt(Math.min(1,theTile.numberOfPossibleRots),theTile.numberOfPossibleRots)+'-'+getRandomInt(0,1));
        }
        
        ans.push(temp);
        
        
    }
    
    return ans;
    
}

