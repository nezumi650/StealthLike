//'use strict';

// add a stealth-like-button
var buttonElement = document.createElement('img');
buttonElement.id = 'stealth-like-button';
buttonElement.src = 'https://raw.github.com/nezumi650/StealthLike/master/sample.png';
buttonElement.width  = 50;
buttonElement.height = 50;
buttonElement.style.cssText = 'position: fixed;'
                            + 'bottom: 20px;'
                            + 'right: 20px;';

var footerElement = document.querySelector('div .site-footer');
footerElement.appendChild(buttonElement);


// post comment with selected text
function postLikeComment(comment) {
    var commentForm = document.querySelector( '#discussion_bucket .js-new-comment-form [id^=\'comment_body_\']' );
    commentForm.value = "Stealth Liked:\n > " + comment;

    var submitButton = document.querySelector('#discussion_bucket .js-new-comment-form button[type=\'submit\']:last-child');
    var mouseEvents = document.createEvent('MouseEvents');
    mouseEvents.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    submitButton.dispatchEvent( mouseEvents );
}




(function() {
    var stealthLikeButton = $('#stealth-like-button');   
    stealthLikeButton.hide();
    // 少しでもスクロールしたら表示
    $(window).scroll(function () {
        var currentUrl    = location.href;
        var isGithub      = currentUrl.match(/github\.com.*pull/);
        var isCommitsPage = currentUrl.match(/commits$/);
        if (isGithub && !isCommitsPage) {
            if ($(this).scrollTop() > 1) {
                stealthLikeButton.fadeIn();
            } else {
                stealthLikeButton.fadeOut();
            }
        }
    });

    stealthLikeButton.click(function () {
        postLikeComment(window.getSelection());
        return false;
    });
})();