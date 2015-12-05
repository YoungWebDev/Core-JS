var coreJS = coreJS || {};

(function (window, document, Observer) {
    'use strict';

    coreJS.node = function (query) {

        var t = this;
        var _ = _ || {};
        t.lastQ = t.lastQ || '';
        t.q = query || t.q;
        t.domCache = t.domCache || {};

        /*/
         * PRIVATE VARIABLES & METHODS
        /*/

        _.document = document;
        _.selectors = /^(#?[\w\-]+|\.[\w-.]+)$/;

        _.splitClassesByDots = function (classes) {
            return classes.replace(/\./g, ' ');
        };

        _.queryAnalyzer = function (selector) {
            if (_.selectors.test(selector)) {
                switch (selector.charAt(0)) {
                case '#':
                    t.domCache[selector] = _.document.getElementById(selector.substr(1));
                    break;
                case '.':
                    t.domCache[selector] = _.document.getElementsByClassName(_.splitClassesByDots(selector));
                    break;
                default:
                    t.domCache[selector] = _.document.getElementsByTagName(selector);
                }
            } else {
                t.domCache[selector] = _.document.querySelectorAll(selector);
            }

            return t.domCache[selector];
        };

        _.escapeHtml = function (string) {
            return string
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        };

        _.find = function (selector) {
            var find = t.domCache[selector] === undefined ? _.queryAnalyzer(selector) : t.domCache[selector];
            t.lastQ = find;
            return find;
        };

        _.isAnObject = function (element) {
            if (typeof element === 'object' && element.length === undefined) {
                return true;
            } else {
                return false;
            }
        };

        _.isAString = function (element) {
            if (typeof element === 'string') {
                return true;
            } else {
                return false;
            }
        };

        _.isAnArray = function (element) {
            if (typeof element === 'object' && element.length !== undefined) {
                return true;
            } else {
                return false;
            }
        };

        _.each = function (callback, params) {
            Object.keys(t.lastQ).forEach(function (key) {
                callback(t.lastQ[key], params);
            });
        };

        query ? _.find(t.q) : false;

        /*/
         * PUBLIC VARIABLES & METHODS
        /*/

        t.html = function (html) {

            html = html || undefined;

            if (html) {
                if (_.isAnArray(t.lastQ)) {
                    _.each(function (node, html) {
                        node.innerHTML = html;
                    }, html);
                } else {
                    t.lastQ.innerHTML = html;
                }
            } else {
                if (_.isAnObject(t.lastQ)) {
                    return t.lastQ.innerHTML;
                }
            }

            return t;
        };

        t.text = function (text) {

            text = text || undefined;

            if (text) {
                text = _.escapeHtml(text);
                if (_.isAnArray(t.lastQ)) {
                    _.each(function (node, text) {
                        node.innerText = text;
                    }, text);
                } else {
                    t.lastQ.innerText = text;
                }
            } else {
                if (_.isAnObject(t.lastQ)) {
                    return t.lastQ.innerText;
                }
            }

            return t;
        };

        t.get = function () {
            return t.lastQ;
        };

        return this;
    };


}(window, document, window.MutationObserver));

coreJS.node('#parent').html('#parent');
coreJS.node('.child').text('.child').html('script');

window.console.log(coreJS.node('#parent').text());