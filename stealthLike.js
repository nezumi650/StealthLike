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

var footerElm = document.querySelector('div .site-footer');
footerElm.appendChild(buttonElement);


// post comment with selected text
function postLikeComment(comment) {
    var commentForm = document.querySelector( '#discussion_bucket .js-new-comment-form [id^="comment_body_"]' );
    commentForm.value = "Stealth Liked:\n > " + comment;

    var submitButton = document.querySelector('#discussion_bucket .js-new-comment-form button[type="submit"]:last-child');
    var mouseEvents = document.createEvent("MouseEvents");
    mouseEvents.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    submitButton.dispatchEvent( mouseEvents );
}




(function() {
    var stealthLikeBtn = $('#stealth-like-button');   
    stealthLikeBtn.hide();
    // 少しでもスクロールしたら表示
    $(window).scroll(function () {
        var currentUrl = location.href;
        result1 = currentUrl.match(/github\.com.*pull/);
        result2 = currentUrl.match(/commits$/);
        if (result1 && !result2) {
            if ($(this).scrollTop() > 1) {
                stealthLikeBtn.fadeIn();
            } else {
                stealthLikeBtn.fadeOut();
            }
        }
    });

    stealthLikeBtn.click(function () {
        postLikeComment(window.getSelection());
        return false;
    });
})();