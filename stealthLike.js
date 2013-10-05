// ==UserScript==
// @name                Stealth Like
// @namespace           https://github.com/nezumi650/StealthLike
// @description         溢れる賞賛の気持ちを、そっと添えるためのスクリプトです @TODO 英語に翻訳する
// @include             https://github.com/*/*/pull/*
// @version             1
// @grant               none
// ==/UserScript==

(function() {

    'use strict';

    var defaultCommentForComments = 'Stealth Liked';
    var defaultCommentForDiff     = 'Nice Code!';

    // add a stealth-like-button
    var buttonElement = document.createElement('img');
    buttonElement.id = 'stealth-like-button';
    buttonElement.src = 'https://raw.github.com/nezumi650/StealthLike/master/sample.png'; //@TODO バイナリファイルにする
    buttonElement.width  = 50;
    buttonElement.height = 50;
    buttonElement.style.cssText = 'position: fixed;'
                                + 'bottom: 20px;'
                                + 'right: 20px;';

    var footerElement = document.querySelector('div .site-footer');
    footerElement.appendChild(buttonElement);


    var postLikeComment = function(commentObj) {
        var commentForm = document.querySelector( '#discussion_bucket .js-new-comment-form [id^=\'comment_body_\']' );

        if (location.pathname.match(/files/)) {
            var splitedParentTrId = commentObj.anchorNode.parentNode.parentNode.id.split('-');
            var fileExpansion     = splitedParentTrId[splitedParentTrId.length - 2];

            commentForm.value = defaultCommentForDiff + ' :+1:' + "\n\n```" + fileExpansion + "\n" + commentObj.toString() + "\n```";
        } else {
            commentForm.value = defaultCommentForComments + ' :+1:' + "\n" + ' > ' + commentObj.toString();
        }

        var submitButton = document.querySelector('#discussion_bucket .js-new-comment-form button[type=\'submit\']:last-child');
        var mouseEvents  = document.createEvent('MouseEvents');
        mouseEvents.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        submitButton.dispatchEvent( mouseEvents );
    }

    var hideStealthComments = function() {
        var discussionBubbles = document.querySelectorAll('.discussion-bubble');
        var targetTextsArray  = [];
        var likedAvatarArray  = [];

        for (var i = 0; i < discussionBubbles.length; i++) {
            var discussionBubble = discussionBubbles[i];
            var commentBody      = discussionBubble.querySelector('.comment-body');
            if (commentBody) {
                var commentBodyText = commentBody.textContent;
                if (commentBodyText.search(defaultCommentForComments) !== -1) {
                    var blockquoteBody  = discussionBubble.querySelector('blockquote p');
                    if (blockquoteBody != null) {
                        var blockquoteText = blockquoteBody.textContent;
                        var commentNumber  = targetTextsArray.indexOf(blockquoteText);
                        if (commentNumber == -1) {
                            targetTextsArray.push(blockquoteText);
                            commentNumber = targetTextsArray.length - 1;
                        }
                        if (likedAvatarArray[commentNumber] == undefined) {
                            likedAvatarArray[commentNumber] = [];
                        }
                        likedAvatarArray[commentNumber].push(discussionBubble.querySelector('.discussion-bubble-avatar').getAttribute('src'));
                    }                        
                    discussionBubble.style.display = 'none';
                    discussionBubble.remove();
                }

            }
        }
        hilightStealthComments(targetTextsArray);
        addLikedIcon(likedAvatarArray);
    }

    var hilightStealthComment = function(targetHtml, targetText, commentNumber) {
        var addslashesTargetText = targetText.replace(/[\^\[\]\-\?\{\}\$\|\!\\\"\'\.\,\=\(\)\/\;\+]/g, '\\$&').replace(/\u0000/g, '\\0').replace(/\s/g, '\\s');
        var reg = new RegExp(addslashesTargetText, 'g');
        return targetHtml.replace(reg, '<span style=\'background-color:#ffff99\'>' + targetText + '</span><span class=\'liked-comments-' + commentNumber + '\'></span>');
    }

    var hilightStealthComments = function(targetTextArray) {
        var jsDiscussionElement = document.querySelector('.js-discussion');
        var targetHtml          = jsDiscussionElement.innerHTML;
        var replacedHtml        = '';

        for (var commentNumber = 0; commentNumber < targetTextArray.length; commentNumber++) {
            var targetText = targetTextArray[commentNumber];
            replacedHtml   = hilightStealthComment(targetHtml, targetText, commentNumber);
            targetHtml     = replacedHtml;
        }
        document.querySelector('.js-discussion').innerHTML = replacedHtml;
    }


    var addLikedIcon = function(likedAvatarArray) {
        for (var commentNumber = 0; commentNumber < likedAvatarArray.length; commentNumber++) {
            var targetSpanElement = document.querySelector('.liked-comments-' + commentNumber);
            if (targetSpanElement) {
                for (var i = 0; i < likedAvatarArray[commentNumber].length; i++) {
                    var miniAvatar = document.createElement('img');
                    miniAvatar.src = likedAvatarArray[commentNumber][i];
                    miniAvatar.width  = 20;
                    miniAvatar.height = 20;
                    miniAvatar.style.cssText = 'padding: 2px;'
                                             + 'background-color:#ffff99;'
                    targetSpanElement.appendChild(miniAvatar);
                }
                var buttonElementMini = document.createElement('img');
                buttonElementMini.className = 'stealth-like-button-mini';
                buttonElementMini.src       = 'https://raw.github.com/nezumi650/StealthLike/master/sample.png';
                buttonElementMini.width     = 15;
                buttonElementMini.height    = 15;
                buttonElementMini.style.cssText = 'margin: 2px;'
                buttonElementMini.dataset.stealthPostValue = targetSpanElement.previousSibling.textContent;
                targetSpanElement.appendChild(buttonElementMini);
            }
        }
    }

    var stealthLikeButton = document.getElementById('stealth-like-button');   

    stealthLikeButton.addEventListener(
        'click', 
        function () {
            var selection = document.getSelection();
            if (selection.toString().length) {
                postLikeComment(selection);
            }
            return false;
        },
        false
    );

    hideStealthComments();


})();