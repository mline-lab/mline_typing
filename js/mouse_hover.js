$(function() {
    $('a img').hover(function() {
        $(this).attr('src', $(this).attr('src').replace('_off', '_on'));
    }, function() {
        $(this).attr('src', $(this).attr('src').replace('_on', '_off'));
    });
    $('a img').bind( 'touchstart', function(){
        $(this).attr('src', $(this).attr('src').replace('_off', '_on'));
    }).bind( 'touchend', function(){
        $(this).attr('src', $(this).attr('src').replace('_on', '_off'));
    });
});
