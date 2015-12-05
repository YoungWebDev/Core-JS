var coreJS = coreJS || {};

(function (window, document, Observer) {
    'use strict';

    coreJS.node = function (query) {

        var t = this;
        var _ = {};
        this._lastQ = this._q || query;
        this._q = query;
        this._document = this._document || document;
        this._selectors = /^(#?[\w\-]+|\.[\w-.]+)$/;
        this._domCache = this._domCache || {};

        this._splitClassesByDots = function (classes) {
            return classes.replace(/\./g, ' ');
        };

        this._queryAnalyzer = function () {
            if (t._selectors.test(t._q)) {
                switch (t._q.charAt(0)) {
                case '#':
                    t._domCache[t._q] = t._document.getElementById(t._q.substr(1));
                    break;
                case '.':
                    t._domCache[t._q] = t._document.getElementsByClassName(t._splitClassesByDots(t._q));
                    break;
                default:
                    t._domCache[t._q] = t._document.getElementsByTagName(t._q);
                }
            } else {
                t._domCache[t._q] = t._document.querySelectorAll(t._q);
            }
        };
        
        this._find = function () {
            t._domCache[t._q] === undefined ? t._queryAnalyzer() : false; 
        };

        query ? this._find() : false;
        
        return this;
    };


}(window, document, window.MutationObserver));

coreJS.node('#parent');
coreJS.node('.child');

window.console.log(coreJS.node());











