// ==UserScript==
// @name                Stealth Like
// @namespace           https://github.com/nezumi650/StealthLike
// @description         溢れる賞賛の気持ちを、そっと添えるためのスクリプトです @TODO 英語に翻訳する
// @include             https://github.com/*/*/pull/*
// @version             1
// @grant               none
// ==/UserScript==

'use strict';

window.addEventListener(
    'load', 
    function () {
        var defaultCommentForComments = 'Stealth Liked';
        var defaultCommentForDiff     = 'Nice!';

        var targetTextsArray = [];


        function postLikeComment(commentObj) {
            var commentForm = document.querySelector( '#discussion_bucket .js-new-comment-form [id^="comment_body_"]' );

            if (location.pathname.match(/files/)) {
                var splitedParentTrId = commentObj.anchorNode.parentNode.parentNode.id.split('-');
                var fileExpansion     = splitedParentTrId[splitedParentTrId.length - 2];

                commentForm.value = defaultCommentForDiff + ' :+1:' + "\n\n```" + fileExpansion + "\n" + commentObj.toString() + "\n```";
            } else {
                commentForm.value = defaultCommentForComments + ' :+1:' + "\n" + ' > ' + commentObj.toString();
            }

            var submitButton = document.querySelector('#discussion_bucket .js-new-comment-form button[type="submit"]:last-child');
            var mouseEvents  = document.createEvent('MouseEvents');
            mouseEvents.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            submitButton.dispatchEvent( mouseEvents );
            return true;
        };

        function hideStealthComments() {
            var discussionBubbles   = document.querySelectorAll('.discussion-bubble');
            var targetTextsArrayTmp = [];
            var likedAvatarArrayTmp = [];

            for (var i = 0; i < discussionBubbles.length; i++) {
                var discussionBubble = discussionBubbles[i];
                var blockquoteText   = getStealthLikedBlockquoteText(discussionBubble);
                if (blockquoteText) {
                    var commentNumber  = targetTextsArray.indexOf(blockquoteText);
                    if (commentNumber === -1) {
                        targetTextsArray.push(blockquoteText);
                        targetTextsArrayTmp.push(blockquoteText);
                        commentNumber = targetTextsArray.length - 1;
                    }
                    if (!likedAvatarArrayTmp[commentNumber]) {
                        likedAvatarArrayTmp[commentNumber] = [];
                    }
                    likedAvatarArrayTmp[commentNumber].push(discussionBubble.querySelector('.discussion-bubble-avatar').getAttribute('src'));
                    discussionBubble.style.display = 'none';
                    discussionBubble.parentNode.removeChild(discussionBubble);
                }
            }
            
            if (targetTextsArrayTmp.length > 0) {
                hilightStealthComments(targetTextsArrayTmp);
            }
            if (likedAvatarArrayTmp.length > 0) {
                addLikedIcon(likedAvatarArrayTmp);
            }
        };


        function getStealthLikedBlockquoteText(discussionBubble) {
            if (isStealthLikedDiscussionBubble(discussionBubble)) {
                var blockquoteBody  = discussionBubble.querySelector('blockquote p');
                if (blockquoteBody) {
                    return blockquoteBody.textContent;
                }
            }
            return false;
        }

        function isStealthLikedDiscussionBubble(discussionBubble) {
            var commentBody = discussionBubble.querySelector('.comment-body');
            if (commentBody) {
                var commentBodyText = commentBody.textContent;
                return (commentBodyText.search(defaultCommentForComments) !== -1);
            }
            return false;
        }

        function hilightStealthComment(targetHtml, targetText, commentNumber) {
            var addslashesTargetText = targetText.replace(/[\^\[\]\-\?\{\}\$\|\!\\\"\'\.\,\=\(\)\/\;\+]/g, '\\$&').replace(/\u0000/g, '\\0').replace(/\s/g, '\\s');
            var reg = new RegExp(addslashesTargetText, 'g');
            return targetHtml.replace(reg, '<span style=\'background-color:#ffff99\'>' + targetText + '</span><span class=\'liked-comments-' + commentNumber + '\'></span>');
        };

        function hilightStealthComments(targetTextArray) {
            var jsDiscussionElement = document.querySelector('.js-discussion');
            var targetHtml          = jsDiscussionElement.innerHTML;
            var replacedHtml        = '';

            for (var commentNumber = 0; commentNumber < targetTextArray.length; commentNumber++) {
                var targetText = targetTextArray[commentNumber];
                replacedHtml   = hilightStealthComment(targetHtml, targetText, commentNumber);
                targetHtml     = replacedHtml;
            }
            document.querySelector('.js-discussion').innerHTML = replacedHtml;
        };


        function addLikedIcon(likedAvatarArray) {
            for (var i = 0; i < likedAvatarArray.length; i++) {
                var commentNumber = likedAvatarArray.indexOf(likedAvatarArray[i]);
                var targetSpanElement = document.querySelector('.liked-comments-' + commentNumber);
                if (targetSpanElement) {
                    var buttonElementMini = document.getElementById('stealth-like-button-mini-' + commentNumber);
                    if (!buttonElementMini) {
                        var buttonElementMini = document.createElement('img');
                        buttonElementMini.id        = 'stealth-like-button-mini-' + commentNumber;
                        buttonElementMini.src       = 'https://raw.github.com/nezumi650/StealthLike/master/sample-mini.png';
                        buttonElementMini.width     = 15;
                        buttonElementMini.height    = 15;
                        buttonElementMini.style.cssText = 'margin: 2px;'
                        buttonElementMini.dataset.stealthPostValue = targetSpanElement.previousSibling.textContent;
                        targetSpanElement.appendChild(buttonElementMini);
                    }
                    for (var j = 0; j < likedAvatarArray[commentNumber].length; j++) {
                        var miniAvatar = document.createElement('img');
                        miniAvatar.src = likedAvatarArray[commentNumber][j];
                        miniAvatar.width  = 20;
                        miniAvatar.height = 20;
                        miniAvatar.style.cssText = 'padding: 2px;'
                                                 + 'background-color:#ffff99;'
                        targetSpanElement.insertBefore(miniAvatar, buttonElementMini);
                    }
                }
            }
        };

        function stealthLikeMain() {
            hideStealthComments();

            var stealthLikeButtonMini = document.querySelectorAll( '[id^="stealth-like-button-mini"]');

            for (var i = 0; i < stealthLikeButtonMini.length; i++) {
                var selection = stealthLikeButtonMini[i].dataset.stealthPostValue;
                stealthLikeButtonMini[i].addEventListener(
                    'click',
                    function () {
                        var selection = this.dataset.stealthPostValue;
                        if (selection.toString().length) {
                            postLikeComment(selection);
                        }
                    },
                    false
                );
            }
        }


        // add a stealth-like-button
        var stealthLikeButton = document.createElement('img');
        stealthLikeButton.id = 'stealth-like-button';
        stealthLikeButton.src = 'https://raw.github.com/nezumi650/StealthLike/master/sample.png'; //@TODO バイナリファイルにする
        stealthLikeButton.width  = 50;
        stealthLikeButton.height = 50;
        stealthLikeButton.style.cssText = 'position: fixed;'
                                        + 'bottom: 20px;'
                                        + 'right: 20px;';

        var footerElement = document.querySelector('div .site-footer');
        footerElement.appendChild(stealthLikeButton);

        stealthLikeButton.addEventListener(
            'click', 
            function () {
                var selection = document.getSelection();
                if (selection.toString().length) {
                    postLikeComment(selection);
                    stealthLikeMain();
                }
            },
            false
        );

        stealthLikeMain();

        window.addEventListener(
            'DOMNodeInserted',
            stealthLikeMain,
            false
        );

    },
    false
);
