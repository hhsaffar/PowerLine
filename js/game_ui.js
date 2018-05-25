
function GameUI(game_container,row_count, col_count){

    var theProblem = null;
    var gameWidth = col_count;
    var gameHeight = row_count;
    var game_logic = new GameLogic();

    var wire_type_0_shape = '<polygon id="TMPL_WIREID" class="wire TMPL_LITNOLIT" points="28 0 28 36 36 36 36 0" transform="rotate(TMPL_ROTANG, 32.5 32.5)" />'
    var wire_type_1_shape = '<polygon id="TMPL_WIREID" class="wire TMPL_LITNOLIT" points="28 0 28 65 36 65 36 0" transform="rotate(TMPL_ROTANG 32.5 32.5)" />'
    var wire_type_2_shape = '<polygon id="TMPL_WIREID" class="wire TMPL_LITNOLIT" points="28 0 28 36 65 36 65 28 36 28 36 0" transform="rotate(TMPL_ROTANG 32.5 32.5)" />'
    var wire_type_3_shape = '<polygon id="TMPL_WIREID" class="wire TMPL_LITNOLIT" points="28 0 28 28 0 28 0 36 65 36 65 28 36 28 36 0" transform="rotate(TMPL_ROTANG 32.5 32.5)" />'

    var tile_width = 65;
    var tileSVG = '<svg id="TMPL_SVGID" height="65" width="65" style="background-color:black"><g class="tile" id="TMPL_GID" >  <rect x="1" y="1" width="64" height="64" style="stroke:blue; stroke-width:1;" />  TMPL_WIRE_PLACE_HOLDER  TMPL_BUILDING_PLACE_HOLDER </g></svg>';
    var houseSvg = '<polygon id="TMPL_BUIDINGID" class="house TMPL_LITNOLIT" points="33 20 15 32 22 32 22 50 44 50 44 32 51 32" style=" stroke:gray;" />';
    var powerPlantSvg = '<polygon id="TMPL_BUIDINGID" class="house TMPL_LITNOLIT" points="10 12 10 46 55 46 55 46 55 8 45 8 45 29" style=" stroke:gray;" />';

    this.game_over = false;

    function drawTile(tile){

        var wire_shapes = [wire_type_0_shape,wire_type_1_shape,wire_type_2_shape,wire_type_3_shape];

        var building_shapes = {house : houseSvg, power_plant: powerPlantSvg, wire:''};

        var ans = tileSVG;

        var wireStr = wire_shapes[tile.wireType.id];

        ans = ans.replace("TMPL_SVGID","tilesvg-"+tile.row+"-"+tile.col);
        ans = ans.replace("TMPL_GID","grp-"+tile.row+"-"+tile.col);

        wireStr = wireStr.replace("TMPL_WIREID","wire-"+tile.row+"-"+tile.col);
        wireStr = wireStr.replace("TMPL_ROTANG",""+(-90*tile.rotation));

        ans = ans.replace('TMPL_WIRE_PLACE_HOLDER',wireStr);
        ans = ans.replace('TMPL_BUILDING_PLACE_HOLDER',building_shapes[tile.tileType.name]);
        ans = ans.replace('TMPL_BUIDINGID',"building-"+tile.row+"-"+tile.col)

        var find = 'TMPL_LITNOLIT';
        var re = new RegExp(find, 'g');

        ans = ans.replace(re,(tile.isLit)?'lit':'nolit');

        return ans;

    }

    function initTheBoard(){

        //make a problem
        theProblem = game_logic.makeAProblem(gameWidth,gameHeight);    

        //draw images
        drawTheProblem(theProblem,game_container,gameWidth,gameHeight);

        //assign the event handlers
        assignEventHandlers();
    }


    function assignEventHandlers(){

        var g_tiles = document.getElementsByClassName('tile');

        for(var i=0;i<g_tiles.length;i++){
            g_tiles[i].onclick = function(){
                            if (this.game_over) return;
                            var a = this.id.split('-');
                            game_logic.updateTileRotation(theProblem,parseInt(a[1]),parseInt(a[2]));
                            
                            this.game_over = game_logic.isSolved(theProblem);
                            
                            drawTheProblem(theProblem,'gameMainArea',gameWidth,gameHeight);
                            
                            if (this.game_over){
                                log("You won!");
                                return;
                            }
                            
                            assignEventHandlers();
                            }; 
        }

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

        var game_div = document.getElementById(divName);
        game_div.innerHTML=ans;
        game_div.style.width = numberOfXTiles * tile_width;
        
    }

    initTheBoard();

}