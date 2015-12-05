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

        _.each = function (callback, params) {
            Object.keys(t.lastQ).forEach(function (key) {
                callback(t.lastQ[key], params);
            });
        };

        query ? _.find(t.q) : false;

        /*/
         * PUBLIC VARIABLES & METHODS
        /*/

        t.isAnObject = function (element) {
            if (typeof element === 'object' && element.length === undefined) {
                return true;
            } else {
                return false;
            }
        };

        t.isAString = function (element) {
            if (typeof element === 'string') {
                return true;
            } else {
                return false;
            }
        };

        t.isAnArray = function (element) {
            if (typeof element === 'object' && element.length !== undefined) {
                return true;
            } else {
                return false;
            }
        };

        t.html = function (html) {
            if (t.isAnArray(t.lastQ)) {
                _.each(function (node, html) {
                    node.innerHTML = html;
                }, html);
            } else {
                t.lastQ.innerHTML = html;
            }
            
            return t;
        };

        t.text = function (text) {
            text = _.escapeHtml(text);
            if (t.isAnArray(t.lastQ)) {
                _.each(function (node, text) {
                    node.innerHTML = text;
                }, text);
            } else {
                t.lastQ.innerHTML = text;
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

window.console.log(coreJS.node());