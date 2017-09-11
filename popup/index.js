$('.toggle').click(() => {
    $('.blur').toggleClass('displaynone');
});

$('.addbutton').click(() => {
    $('.blur').toggleClass('displaynone');
    $('.modal').toggleClass('displaynone');
    $('.toggle').toggleClass('displaybehind');
});

$('.modalclose').click(() => {
    $('.blur').toggleClass('displaynone');
    $('.modal').toggleClass('displaynone');
    $('.toggle').toggleClass('displaybehind');
});