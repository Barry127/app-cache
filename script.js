$(document).ready(function () {

  var $window = $(window),
    $nav = $('nav'),
    $navUl = $('nav > ul'),
    navTop = $navUl.offset().top;

  function highlightMenu (scrollTop) {
    var target;
    var titles = [];

    $('h1, h2').each(function () {
      var $this = $(this);

      titles.push({
        id: '#' + $this.attr('id'),
        top: $this.offset().top + 50
      });
    });

    titles.reverse().pop();

    for (var i = 0; i < titles.length; i++) {
      if(titles[i].top >= scrollTop) {
        target = titles[i].id;
      }
    }

    setTimeout(function () {
      var $allA = $nav.find('a').removeClass('active');

      if (target !== '#undefined') {
        var $a = $allA.filter('[href="' + target + '"]').addClass('active');
        if($a.parent().parent().hasClass('sub')) {
          $a.parent().parent().parent().find('a').first().addClass('active');
        }
      }
    }, 0);
  }

  $window.on('scroll', function () {
    var scrollTop = $window.scrollTop();

    if (scrollTop > navTop - 10) {
      $navUl.css('position', 'fixed');
      $navUl.css('top', 10);
    } else {
      $navUl.css('position', 'static');
    }

    highlightMenu(scrollTop);
  });

  $('a[href^="#"]').on('click', function (ev) {
    if (ev.which === 2) return;

    ev.preventDefault();

    var $this = $(this);
    var target = $this.attr('href');

    $('html, body').animate({
      scrollTop: $(target).offset().top - 10
    }, 350);
  });

  highlightMenu($window.scrollTop());

});
