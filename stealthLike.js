//'use strict';

var defaultComment = 'Stealth Liked';

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
    commentForm.value = defaultComment + ' :+1:' + "\n" + ' > ' + comment;

    var submitButton = document.querySelector('#discussion_bucket .js-new-comment-form button[type=\'submit\']:last-child');
    var mouseEvents = document.createEvent('MouseEvents');
    mouseEvents.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    submitButton.dispatchEvent( mouseEvents );
}

function hideStealthComments() {
    var discussionBubbles = document.querySelectorAll('.discussion-bubble');
    var targetTextsArray  = [];

    for (var i = 0; i < discussionBubbles.length; i++) {
        var discussionBubble = discussionBubbles[i];
        var commentBody      = discussionBubble.querySelector('.comment-body');

        if (commentBody != null) {
            var commentBodyText = commentBody.textContent;
            if (commentBodyText.search(defaultComment) != -1) {
                var blockquoteBody  = discussionBubble.querySelector('blockquote p');
                if (blockquoteBody != null) {
                    targetTextsArray.push(blockquoteBody.innerHTML);
                }
                discussionBubble.style.display = 'none';
                discussionBubble.remove();
            }

        }
    }

//    hilightStealthComments(targetTextsArray);
}

function hilightStealthComment(targetHtml, targetText) {
        return targetHtml.replace(targetText, '<span style=\'background-color:yellow\' >' + targetText + '</span>');
}

function hilightStealthComments(targetTextArray) {
    var jsDiscussionElement = document.querySelector('.js-discussion');
    var targetHtml          = jsDiscussionElement.innerHTML;
    var replacedHtml        = '';

    for (var i = 0; i < targetTextArray.length; i++) {
        var targetText = targetTextArray[i];
        replacedHtml   = hilightStealthComment(targetHtml, targetText);
        targetHtml     = replacedHtml;
    }
    document.querySelector('.js-discussion').innerHTML = replacedHtml;
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

    // 非推奨..
    var targetElement = document.querySelector('.js-task-list-container');
    targetElement.addEventListener("DOMNodeInserted", function () {
        hideStealthComments();
    });

})();