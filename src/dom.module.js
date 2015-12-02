var coreJS = coreJS || {};
var $scope = $scope || {};

(function (coreJS) {
    'use strict';

    var compile = function (key, value) {

        var isAnObject = function (element) {
            if (typeof element === 'object' && element.length === undefined) {
                return true;
            } else {
                return false;
            }
        };

        var isAString = function (element) {
            if (typeof element === 'string') {
                return true;
            } else {
                return false;
            }
        };

        var isAnArray = function (element) {
            if (typeof element === 'object' && element.length !== undefined) {
                return true;
            } else {
                return false;
            }
        };

        var escapeHtml = function (string) {
            return string
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
        };

        var escapeRegExp = function (string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        };

        var replaceAll = function (string, old, replacement) {
            var replacement = replacement.toString();
            replacement = escapeHtml(replacement);
            return string.replace(new RegExp(escapeRegExp(old), 'g'), replacement);
        };

        var changeInnerHTML = function (domElement, value) {
            domElement.innerHTML = value;
        };

        var replaceVariable = function (domElement, key, value) {
            var html = domElement.innerHTML;
            domElement.innerHTML = html.replace('{{' + key + '}}', value);
        };

        var replaceVariables = function (domElement, value) {
            Object.keys(value).forEach(function (key) {
                replaceVariable(domElement, key, value[key]);
            });
        };

        var handleArrayReplacement = function (domElement, value) {
            var replacement = [];
            var nodeCopy = domElement.cloneNode(true);

            Object.keys(value).forEach(function (key) {
                replacement[key] = nodeCopy.cloneNode(true);
                Object.keys(value[key]).forEach(function (childKey) {
                    replacement[key].innerHTML = replaceAll(replacement[key].innerHTML, '{{' + childKey + '}}', value[key][childKey]);
                });
            });

            replacement.forEach(function (node) {
                domElement.parentElement.insertBefore(node, domElement);
            });

            domElement.parentElement.removeChild(domElement);
        };

        var parse = function (domElement, value) {
            if (isAString(value)) {
                changeInnerHTML(domElement, value);
            } else if (isAnObject(value)) {
                replaceVariables(domElement, value);
            } else if (isAnArray(value)) {
                handleArrayReplacement(domElement, value);
            }
        };

        var searchInDom = function (key, callback) {
            var domElements = document.querySelectorAll('[data-bind="' + key + '"]');
            callback(domElements);
        };

        if (value === undefined) {

            Object.keys(key).forEach(function (domElementKey) {
                value = key[domElementKey];

                searchInDom(domElementKey, function (domElements) {

                    Object.keys(domElements).forEach(function (domElementKey) {
                        parse(domElements[domElementKey], value);
                    });

                });
            });

        } else {
            searchInDom(key, function (domElements) {

                Object.keys(domElements).forEach(function (domElementKey) {
                    parse(domElements[domElementKey], value);
                });

            });

        }



    };

    coreJS.$scope = function (key, value) {

        this._data = this._data || {};

        var _refresh = function (data) {
            if (data != undefined) {
                Object.keys(data).forEach(function (key) {
                    this._data[key] = data[key];
                }.bind(this));
            }
            var data = data || this._data;
            compile(data);
        }.bind(this);

        var _setScopeValue = function (key, value) {
            this._data[key] = value;
            compile(key, value);
        }.bind(this);

        if (typeof key === 'object') {
            _refresh(key);
            return this._data;
        }

        if (value === undefined) {
            if (key === undefined) {
                setTimeout(function () {
                    _refresh();
                }.bind(this), 10);
                this._data._refresh = _refresh;
                return this._data;
            } else {
                return this._data[key];
            }
        } else {
            _setScopeValue(key, value);
        }
    };
    
    $scope = new coreJS.$scope();

}(coreJS));