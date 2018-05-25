function init_game(game_container,row_cnt,col_cnt){

   log.log_control = document.getElementById('log');
   
   new GameUI(game_container,row_cnt,col_cnt);
   
}

