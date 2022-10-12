$(document).ready(function () {
    $( "#player_form" ).hide();
    $( ".player_btn" ).click(function() {
        $( ".choose_player" ).hide();
        $( "#player_form" ).show();    
    });
})