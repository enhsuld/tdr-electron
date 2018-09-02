altairApp
    .factory('windowDimensions', [
        '$window',
        function($window) {
            return {
                height: function() {
                    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                },
                width: function() {
                    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                }
            }
        }
    ])



    .factory('CsrfTokenInterceptorService', ['$q',
        function CsrfTokenInterceptorService($q) {

            // Private constants.
            var CSRF_TOKEN_HEADER = 'X-CSRF-TOKEN',
                HTTP_TYPES_TO_ADD_TOKEN = ['DELETE', 'POST', 'PUT'];

            // Private properties.
            var token;

            // Public interface.
            var service = {
                response: onSuccess,
                responseError: onFailure,
                request: onRequest,
            };

            return service;

            // Private functions.
            function onFailure(response) {
                if (response.status === 403) {
                    console.log('Request forbidden. Ensure CSRF token is sent for non-idempotent requests.');
                }

                return $q.reject(response);
            }

            function onRequest(config) {
                if (HTTP_TYPES_TO_ADD_TOKEN.indexOf(config.method.toUpperCase()) !== -1) {
                    config.headers[CSRF_TOKEN_HEADER] = token;
                }

                return config;
            }

            function onSuccess(response) {
                var newToken = response.headers(CSRF_TOKEN_HEADER);

                if (newToken) {
                    token = newToken;
                }

                return response;
            }
        }])

    .factory('utils', [
        function () {
            return {
                // Util for finding an object by its 'id' property among an array
                findByItemId: function findById(a, id) {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].item_id == id) return a[i];
                    }
                    return null;
                },
                findById: function findById(a, id) {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].id == id) return a[i];
                    }
                    return null;
                },
                // serialize form
                serializeObject: function (form) {
                    var o = {};
                    var a = form.serializeArray();
                    $.each(a, function () {
                        if (o[this.name] !== undefined) {
                            if (!o[this.name].push) {
                                o[this.name] = [o[this.name]];
                            }
                            o[this.name].push(this.value || '');
                        } else {
                            o[this.name] = this.value || '';
                        }
                    });
                    return o;
                },
                // high density test
                isHighDensity: function () {
                    return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
                },
                // touch device test
                isTouchDevice: function () {
                    return !!('ontouchstart' in window);
                },
                // local storage test
                lsTest: function () {
                    var test = 'test';
                    try {
                        localStorage.setItem(test, test);
                        localStorage.removeItem(test);
                        return true;
                    } catch (e) {
                        return false;
                    }
                },
                // show/hide card
                card_show_hide: function (card, begin_callback, complete_callback, callback_element) {
                    $(card)
                        .velocity({
                            scale: 0,
                            opacity: 0.2
                        }, {
                            duration: 400,
                            easing: [0.4, 0, 0.2, 1],
                            // on begin callback
                            begin: function () {
                                if (typeof begin_callback !== 'undefined') {
                                    begin_callback(callback_element);
                                }
                            },
                            // on complete callback
                            complete: function () {
                                if (typeof complete_callback !== 'undefined') {
                                    complete_callback(callback_element);
                                }
                            }
                        })
                        .velocity('reverse');
                }
            };
        }]
    )

    .factory('user', ['$rootScope',
        function ($rootScope) {
            return {
                user: $rootScope.user ? $rootScope.user : null,
                isAuth: function () {
                    return localStorage.getItem('authenticated') ? localStorage.getItem('authenticated') : false;;
                },
                setAuth: function (user) {
                    localStorage.setItem('authenticated', true);
                    $rootScope.user = user;
                },
                removeAuth: function () {
                    localStorage.removeItem('authenticated');
                    $rootScope.user = null;
                }
            }
        }
    ])
;

angular.module("ConsoleLogger", [])
    .factory("PrintToConsole", ["$rootScope", function ($rootScope) {
        var handler = { active: false };
        handler.toggle = function () { handler.active = !handler.active; };
        if (handler.active) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                console.log("$stateChangeStart --- event, toState, toParams, fromState, fromParams");
                console.log(arguments);
            });
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                console.log("$stateChangeError --- event, toState, toParams, fromState, fromParams, error");
                console.log(arguments);
            });
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                console.log("$stateChangeSuccess --- event, toState, toParams, fromState, fromParams");
                console.log(arguments);
            });
            $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
                console.log("$viewContentLoading --- event, viewConfig");
                console.log(arguments);
            });
            $rootScope.$on('$viewContentLoaded', function (event) {
                console.log("$viewContentLoaded --- event");
                console.log(arguments);
            });
            $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                console.log("$stateNotFound --- event, unfoundState, fromState, fromParams");
                console.log(arguments);
            });
        };
        return handler;
    }]);