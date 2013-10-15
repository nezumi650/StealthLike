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
            var discussionBubbles = document.querySelectorAll('.discussion-bubble');
            var targetTextsArray  = [];
            var likedAvatarArray  = [];

            for (var i = 0; i < discussionBubbles.length; i++) {
                var discussionBubble = discussionBubbles[i];
                var blockquoteText   = getStealthLikedBlockquoteText(discussionBubble);
                if (blockquoteText) {
                    var commentNumber  = targetTextsArray.indexOf(blockquoteText);
                    if (commentNumber === -1) {
                        targetTextsArray.push(blockquoteText);
                        commentNumber = targetTextsArray.length - 1;
                    }
                    if (!likedAvatarArray[commentNumber]) {
                        likedAvatarArray[commentNumber] = [];
                    }
                    likedAvatarArray[commentNumber].push(discussionBubble.querySelector('.discussion-bubble-avatar').getAttribute('src'));
                    discussionBubble.style.display = 'none';
                    discussionBubble.parentNode.removeChild(discussionBubble);
                }
            }
            if (targetTextsArray.length > 0) {
                hilightStealthComments(targetTextsArray);
                addLikedIcon(likedAvatarArray);
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
                    buttonElementMini.src       = 'https://raw.github.com/nezumi650/StealthLike/master/sample-mini.png';
                    buttonElementMini.width     = 15;
                    buttonElementMini.height    = 15;
                    buttonElementMini.style.cssText = 'margin: 2px;'
                    buttonElementMini.dataset.stealthPostValue = targetSpanElement.previousSibling.textContent;
                    targetSpanElement.appendChild(buttonElementMini);
                }
            }
        };

        function stealthLikeMain() {
            hideStealthComments();

            var stealthLikeButtonMini = document.getElementsByClassName('stealth-like-button-mini');
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

            var stealthLikeButton = document.getElementById('stealth-like-button');
            stealthLikeButton.addEventListener(
                'click', 
                function () {
                    var selection = document.getSelection();
                    if (selection.toString().length) {
                        postLikeComment(selection);
                    }
                },
                false
            );
        }


        stealthLikeMain();
        window.addEventListener(
            'DOMNodeInserted',
            stealthLikeMain,
            false
        );

    },
    false
);
