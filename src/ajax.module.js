/*global console*/
/** CoreJS module which provide support for ajax calls **/

var coreJS = coreJS || {};

(function (coreJS) {
    'use strict';

    /**
     * coreJS.ajax allow you to call ajax requests in an elegant way. Support IE 8+. In case you are using sync request success and error methods won't work for you. You need to get '.request' from your ajax object which is a XMLHttpRequest Object.
     * @param   {object} opts Parameters require to make a request. You can set params as: url, method, dataType, data, async. Methods allowed: POST, GET. Data types allowed: JSON, TEXT, HTML, XML.
     * @returns {object}   Return functions you can use on it: success, error.
     */
    coreJS.ajax = function (opts) {

        /**
         * Default values
         */
        this.method = 'POST';
        this.dataType = 'JSON';
        this.async = true;

        /**
         * Allowed values
         */
        this.allowed = {
            method: ['POST', 'GET'],
            dataType: ['JSON', 'TEXT', 'HTML', 'XML']
        };

        /**
         * Function variables
         */
        this.errors = false;
        this.request;
        this.successFN;
        this.errorFN;
        //this.sync;

        /**
         * Options injection
         */
        if (typeof opts === 'object') {
            Object.keys(opts).forEach(function (opt) {
                this[opt] = opts[opt];
            }.bind(this));
        }

        if (this.method === 'GET' && typeof this.data !== 'undefined') {
            console.error('You cannot send data through GET request.');
            this.errors = true;
        }

        /**
         * Checking if user passed request url.
         */
        if (typeof this.url === 'undefined') {
            console.error('URL isn\'t specified.');
            this.errors = true;
        }

        /**
         * Checking if params given by user are correct.
         */
        Object.keys(this.allowed).forEach(function (param) {
            if (this.allowed[param].indexOf(this[param]) === -1) {
                console.error('The ' + param + ' given is incorrect or not supported. "' + this[param] + '"');
                this.errors = true;
            }
        }.bind(this));

        /**
         * If there were any errors the request won't be executed.
         */
        if (this.errors) {

            /**
             * To prevent unrelevant errors in console
             */
            return {
                success: function () {},
                error: function () {}
            };
        }

        this.warnMsgs = {
            dataType: 'Data type given indicates {{dataType}} but different was returned by the server. So response was left as it has been originally.'
        };

        this.warnHandler = function (type, value) {
            var warn = this.warnMsgs[type].replace('{{' + type + '}}', value);
            console.warn(warn);
        }.bind(this);

        this.isAFunction = function (FN, callback) {
            if (typeof FN === 'function') {
                callback();
            }
        };

        this.parseHTML = function (response) {
            var el = document.createElement('div');
            el.innerHTML = response.response;
            this.successFN(el.children);
        }.bind(this);

        this.parseJSON = function (response) {
            try {
                this.successFN(JSON.parse(response.response));
            } catch (error) {
                this.warnHandler('dataType', 'JSON');
                this.successFN(response.response);
            }
        }.bind(this);

        this.parseXML = function (response) {
            if (response.responseXML === null && response.response !== '') {
                this.warnHandler('dataType', 'XML');
                this.successFN(response.response);
            } else {
                this.successFN(response.responseXML);
            }
        }.bind(this);

        this.redirectToProperParser = function (request) {
            this.isAFunction(this.successFN, function () {
                if (typeof this['parse' + this.dataType] === 'function') {
                    this['parse' + this.dataType](request);
                } else {
                    this.successFN(request.responseText);
                }
            }.bind(this));
        }.bind(this);

        /**
         * Proccess the request call Callback.
         * @param {object} request XMLHttpRequest
         */
        this.proccessRequest = function (request) {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 400) {
                    this.redirectToProperParser(request);
                } else {
                    this.isAFunction(this.errorFN, function () {
                        console.error(request.status + ' ' + request.statusText + ' ('+ this.method +') - ' + request.responseURL);
                        this.errorFN(request);
                    }.bind(this));
                } // IF STATUS
            } // IF READY STATE  
        }.bind(this);

        this.request = new XMLHttpRequest();
        this.request.open(this.method, this.url, this.async);

        if (this.async) {

            /**
             * We cannot bind() this so we need to put it in to a variable.
             */

            var ajax = this;

            this.request.onreadystatechange = function () {
                ajax.proccessRequest(this);
            };
        } // ASYNC TRUE

        if (this.method === 'GET' || typeof this.data === 'undefined') {
            this.request.send();
        } else {
            this.request.send(this.data);
        }

        if (!this.async) {
            this.sync = this.request;
        } // ASYNC FALSE

        this.request = null;

        /**
         * This function will be launch if the request return code 200.
         * @param   {function} FN User's function which will be fired if request return code 200. The response will be passed as a function parameter.
         * @returns {object} Whole coreJS.ajax object.
         */
        this.success = function (FN) {
            this.successFN = FN;
            return {
                error: this.error
            };
        }.bind(this);

        /**This function will be launch if the requset attempt fail.
         * @param   {function} FN Error handler. Error response will be passed as a function parameter.
         * @returns {object} Whole coreJS.ajax object.
         */
        this.error = function (FN) {
            this.errorFN = FN;
            return {
                success: this.success
            };
        }.bind(this);

        if (typeof this.sync !== 'undefined') {
            return {
                request: this.sync
            };
        }

        return {
            success: this.success,
            error: this.error,
        };

    };

}(coreJS));