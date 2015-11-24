/*global console*/
/** CoreJS module which provide template engine **/

var coreJS = coreJS || {};

(function (coreJS) {
    'use strict';

    coreJS.tpl = function (jsonDOM) {

        var tpl = this;
        this.jsonDOM = jsonDOM;
        this.dataBind = '[data-bind="{{name}}"]';
        this.pageDOM = document;

        this.searchInDOM = function (dataElement) {
            var prepareSearch = tpl.dataBind.replace('{{name}}', dataElement);
            var DOMelement = tpl.pageDOM.querySelectorAll(prepareSearch);
            return DOMelement;
        };

        this.replaceInDOM = function (DOM) {

        };

        this.isAnObject = function (element) {
            if (typeof element === 'object' && element.length === undefined) {
                return true;
            } else {
                return false;
            }
        };

        this.isAString = function (element) {
            if (typeof element === 'string') {
                return true;
            } else {
                return false;
            }
        };

        this.isAnArray = function (element) {
            if (typeof element === 'object' && element.length !== undefined) {
                return true;
            } else {
                return false;
            }
        };

        this.handleStringBind = function (bindName, bindDOM) {
            var bindElements = tpl.searchInDOM(bindName);
            Object.keys(bindElements).forEach(function (bindElement) {
                bindElements[bindElement].innerHTML = bindDOM;
            });
        };

        this.handleArrayBind = function (bindName, bindDOM) {
            var originalElements = tpl.searchInDOM(bindName);
            var cloneElements = [];
            var cloneElement;
            var cloneElementHTML;
            var originalsNODES = [];

            Object.keys(tpl.jsonDOM[bindName]).forEach(function (key) {

                Object.keys(originalElements).forEach(function (originalElement) {
                    originalsNODES.push(originalElements[originalElement]);
                    cloneElement = originalElements[originalElement].cloneNode(true);
                    cloneElementHTML = cloneElement.innerHTML;

                    Object.keys(tpl.jsonDOM[bindName][key]).forEach(function (child) {
                        cloneElementHTML = cloneElementHTML.replace('{{' + child + '}}', tpl.jsonDOM[bindName][key][child]);
                        cloneElement.innerHTML = cloneElementHTML;
                        cloneElements.push(cloneElement);
                    });
                });
            });

            originalsNODES.forEach(function (originalElement) {
                var parent = originalElement.parentElement;
                cloneElements.forEach(function (element) {
                    parent.insertBefore(element, originalElement);
                });
            });
            originalsNODES.forEach(function (originalElement) {
                try {
                    originalElement.parentElement.removeChild(originalElement);
                } catch (error) {
                    console.warn(error);
                }
            });
        };

        this.handleObjectBind = function (bindName, bindDOM) {

            var originalElements = tpl.searchInDOM(bindName);
            var elements = [];
            var innerHTML;
            Object.keys(originalElements).forEach(function (key) {
                innerHTML = originalElements[key].innerHTML;

                Object.keys(bindDOM).forEach(function (name) {
                    innerHTML = innerHTML.replace('{{' + name + '}}', bindDOM[name]);
                });

                originalElements[key].innerHTML = innerHTML;
            });

        };

        this.compile = function () {
            Object.keys(this.jsonDOM).forEach(function (key) {
                if (tpl.isAString(tpl.jsonDOM[key])) {
                    tpl.handleStringBind(key, tpl.jsonDOM[key]);
                } else if (tpl.isAnArray(tpl.jsonDOM[key])) {
                    tpl.handleArrayBind(key, tpl.jsonDOM[key]);
                } else if (tpl.isAnObject(tpl.jsonDOM[key])) {
                    tpl.handleObjectBind(key, tpl.jsonDOM[key]);
                }

            });
        }
        
        document.addEventListener('DOMContentLoaded', this.compile());

    };

}(coreJS));
