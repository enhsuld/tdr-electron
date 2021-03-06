angular
    .module('altairApp')
    .controller('contact_list_v2Ctrl', [
        '$rootScope',
        '$scope',
        'contact_list',
        function ($rootScope,$scope,contact_list) {

            $scope.contact_list = contact_list;

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $("#contact_list_v2").listnav({
                    filterSelector: '.listNavSelector',
                    onClick: function(letter) {
                        console.log(letter);
                    }
                });
            });
        }
    ]);