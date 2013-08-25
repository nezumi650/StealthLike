//"use strict";

// add a stealth-like-button
var buttonElement = document.createElement('img');
buttonElement.id = 'stealth-like-button';
buttonElement.src = 'https://raw.github.com/nezumi650/StealthLike/master/sample.png';
buttonElement.width  = 50;
buttonElement.height = 50;
buttonElement.style.cssText = "position: fixed;"
                            + "bottom: 20px;"
                            + "right: 20px;";

// --discussions
var footerElm = document.querySelector('div .site-footer');
footerElm.appendChild(buttonElement);



$(function() {
    var topBtn = $('#stealth-like-button');   
    topBtn.hide();
    // 少しでもスクロールしたら表示
    $(window).scroll(function () {
        if ($(this).scrollTop() > 1) {
            topBtn.fadeIn();
        } else {
            topBtn.fadeOut();
        }
    });
});