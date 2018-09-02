/*
 *  Altair Admin angularjs
 *  controller
 */

angular
    .module('altairApp')
    .controller('top_headerCtrl', [ '$rootScope',
        '$scope',
        '$timeout',
        'mainService',
        '$state',
        '$location',
        '$translate',
        '$ocLazyLoad',
        function ($rootScope,$scope,$timeout,mainService,$state,$location,$translate,$ocLazyLoad) {
            //$rootScope.menuList=menuList;
          //  $rootScope.toBarActive = true;
          //  $rootScope.topMenuActive = true;

            $scope.langSwitcherModel = 'mn';
            $scope.langEng=false;

            $scope.changeLang = function (lang) {
                switch (lang) {
                    case 'gb':
                        $translate.use(lang);
                        $scope.langSwitcherModel = lang;
                        $scope.langEng = true;
                        break;
                    case 'mn':
                        $translate.use(lang);
                        $scope.langSwitcherModel = lang;
                        $scope.langEng = false;
                        break;
                }
            };

            $scope.formatRoute = function (route) {
                return route.toString().replace(/[\. ,:-]+/g, "-");
            };

            if(typeof(Storage) !== "undefined" && localStorage.getItem("listOfCustomers") !== null) {
                var backup = JSON.parse(localStorage.getItem('listOfCustomers'));
                var js = [];
                $rootScope.listCustomers=[backup[0]];//$rootScope.listCustomers[0];

                js.push('lazy_parsleyjs');
                for (var i = 1; i < backup.length; i++) {
                    js.push(backup[i].js);
                }
                $ocLazyLoad.load(js).then(function(){
                    var activeIndex = 0;
                    for(var i=1; i<backup.length; i++){
                        if(backup[i].active == true){
                            activeIndex = i;
                        }
                        $rootScope.listCustomers.push(backup[i]);
                    }
                    $location.path('/'+backup[activeIndex].route);
                    localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                });
            }

            function linkToRoute(link){
                link = link.replace('.', '/');
                return link.replace('.', '/');
            }
            function routeToLink(route){
                route = route.replace('/', '.');
                return route.replace('/', '.');
            }
            function recursiveSearchFromMenus(menus, link) {
                for (var i = 0; i < menus.length; i++) {
                    if (menus[i].link) {
                        if(link == menus[i].link){
                            return menus[i];
                        }
                    }
                    if (menus[i].submenu) {
                        if(menus[i].submenu.length != 0){
                            var check = recursiveSearchFromMenus(menus[i].submenu, link);
                            if(check){
                                return check;
                            }
                        }
                    }
                }
                return false;
            }
            $rootScope.$on('$locationChangeStart', function($event, next, current){
                var menuList = $rootScope.menuList;
                /*if(typeof(Storage) !== "undefined" && localStorage.getItem("menuList") !== null) {
                    menuList = JSON.parse(localStorage.getItem("menuList"));
                }*/
                var locationPath = $location.path().startsWith('/') ? $location.path().substr(1) : $location.path();
                locationPath = routeToLink(locationPath);
                var value = recursiveSearchFromMenus(menuList, locationPath);
                if (value) {
                    $rootScope.showTab(value);
                } else if(locationPath == 'restricted.dashboard'){
                    $rootScope.showTab({link: 'restricted.dashboard', index: 0});
                } else if(locationPath == 'login') {
                    $state.go('login');
                } else if(locationPath != ''){
                        $state.go('error');
                }
            });

            $rootScope.switchTab = function(currentState){
                var link = linkToRoute(currentState.route)// ? currentState.route : currentState.link
                if($location.path() != link){
                    $location.path('/'+link);//$rootScope.listCustomers[index].route);
                }
                setTimeout(function () {
                    localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                }, 500);
            };

            $rootScope.addTab = function(currentState){
                if($location.path() != '/'+currentState.link){
                    $location.path('/'+linkToRoute(currentState.link));
                } else {
                    var tab = $("#" + $scope.formatRoute(currentState.link) + "-tab");
                    if (!tab.hasClass('highlight')) {
                        tab.addClass('highlight');
                        setTimeout(function () {
                            tab.removeClass('highlight');
                        }, 2000);
                    }
                }
            };

            $rootScope.showTab = function (currentState) {
                var checker=false;
                var arr=[];
                var index = 0;
                angular.forEach($rootScope.listCustomers, function(item, key) {
                    if (currentState.link == item.route) {
                        checker=true;
                        index = key;
                    }
                    arr.push(item);
                });
                if(!checker){
                    if($rootScope.listCustomers.length>6){
                        UIkit.notify("Өмнөх цэсээ хаана уу.", {status:'warning', pos: 'top-center'});
                    } else {
                        /*else if(currentState.link==='restricted.mtf.fiscalInterface'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/ceiling/exp/fiscalInterfaceController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/exp/fiscalInterfaceView.html',
                                        js:'app/mtef/mtf/ceiling/exp/fiscalInterfaceController.js' }
                                );
                            });
                        }*/

                        /**
                         * System configration
                         */

                        if(currentState.link==='restricted.user.registration'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/mtef/cmm/user/userRgstController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/user/userRgstView.html',
                                        js:'app/mtef/cmm/user/userRgstController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.user.log'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/user/userLogController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/user/userLogView.html',
                                        js:'app/mtef/cmm/user/userLogController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.user.stat'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/user/userStatController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/user/userStatView.html',
                                        js:'app/mtef/cmm/user/userStatController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.user.search'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/user/userSearchController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/user/userSearchView.html',
                                        js:'app/mtef/cmm/user/userSearchController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.user.userorg'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/user/userOrgMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/user/userOrgMgmtView.html',
                                        js:'app/mtef/cmm/user/userOrgMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.cmm.menu'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/program/menuController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/program/menuView.html',
                                        js:'app/mtef/cmm/program/menuController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.cmm.program'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/program/pgmMenuController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/program/pgmMenuView.html',
                                        js:'app/mtef/cmm/program/pgmMenuController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.cmm.orgcode'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/user/orgCodeMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/user/orgCodeMgmtView.html',
                                        js:'app/mtef/cmm/user/orgCodeMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.cmm.auth'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/auth/authMenuMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/auth/authMenuView.html',
                                        js:'app/mtef/cmm/auth/authMenuMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.cmm.userauthchg'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/auth/userAuthChgController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/auth/userAuthChgView.html',
                                        js:'app/mtef/cmm/auth/userAuthChgController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.cmm.userauth'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/auth/userAuthMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/auth/userAuthMgmtView.html',
                                        js:'app/mtef/cmm/auth/userAuthMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.cmm.exchrate'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/etc/exchRateMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/etc/exchRateMgmtView.html',
                                        js:'app/mtef/cmm/etc/exchRateMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.cmm.faq'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/etc/faqMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/etc/faqMgmtView.html',
                                        js:'app/mtef/cmm/etc/faqMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.cmm.qna'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/etc/qnaMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/etc/qnaMgmtView.html',
                                        js:'app/mtef/cmm/etc/qnaMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.cmm.useraudit'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/common/userAuditController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/common/userAuditView.html',
                                        js:'app/mtef/cmm/common/userAuditController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.cmm.msgmgmt'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/common/msgMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/common/msgMgmtView.html',
                                        js:'app/mtef/cmm/common/msgMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }

                        else if(currentState.link==='restricted.cmm.businessclose'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/common/busiCloseDateController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/common/busiCloseDateView.html',
                                        js:'app/mtef/cmm/common/busiCloseDateController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }

                        /**
                         * MTEF
                         *
                         */

                        else if(currentState.link==='restricted.mtf.expoffer'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/ceiling/exp/expOfferByAgencyController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/exp/expOfferByAgencyView.html',
                                        js:'app/mtef/mtf/ceiling/exp/expOfferByAgencyController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.budgetcode'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/common/budgetCodeController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/common/budgetCodeView.html',
                                        js:'app/mtef/mtf/common/budgetCodeController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.orgncode'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/common/orgnCodeController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/common/orgnCodeView.html',
                                        js:'app/mtef/mtf/common/orgnCodeController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.addresscode'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/common/addressCodeController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/common/addressCodeView.html',
                                        js:'app/mtef/mtf/common/addressCodeController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.etc'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/common/etcCodeController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/common/etcCodeView.html',
                                        js:'app/mtef/mtf/common/etcCodeController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.ecoCd'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/common/ecoCodeController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/common/ecoCodeView.html',
                                        js:'app/mtef/mtf/common/ecoCodeController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.pgmCd'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/common/pgmCodeController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/common/pgmCodeView.html',
                                        js:'app/mtef/mtf/common/pgmCodeController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.actCd'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/common/actCodeController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/common/actCodeView.html',
                                        js:'app/mtef/mtf/common/actCodeController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.debtInfo'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/information/debtInfoController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/information/debtInfoView.html',
                                        js:'app/mtef/mtf/information/debtInfoController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.macroeconomic'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/information/macroeconomicController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/information/macroeconomicView.html',
                                        js:'app/mtef/mtf/information/macroeconomicController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.indicator'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/information/indicatorController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/information/indicatorView.html',
                                        js:'app/mtef/mtf/information/indicatorController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.exportproductprice'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/information/exportProductPriceController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/information/exportProductPriceView.html',
                                        js:'app/mtef/mtf/information/exportProductPriceController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.tradebalance'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/information/tradeBalanceController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/information/tradeBalanceView.html',
                                        js:'app/mtef/mtf/information/tradeBalanceController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.importproductprice'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/information/importProductPriceController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/information/importProductPriceView.html',
                                        js:'app/mtef/mtf/information/importProductPriceController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.pipbudgetlimitforecast'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/information/PIPBudgetLimitForecastController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/information/PIPBudgetLimitForecastView.html',
                                        js:'app/mtef/mtf/information/PIPBudgetLimitForecastController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.fiscalInterface'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/ceiling/exp/fiscalInterfaceController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/exp/fiscalInterfaceView.html',
                                        js:'app/mtef/mtf/ceiling/exp/fiscalInterfaceController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.expdefaultlimit'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/ceiling/exp/expDefaultLimitController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/exp/expDefaultLimitView.html',
                                        js:'app/mtef/mtf/ceiling/exp/expDefaultLimitController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.explimitbyagency'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/ceiling/exp/expLimitByAgencyController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/exp/expLimitByAgencyView.html',
                                        js:'app/mtef/mtf/ceiling/exp/expLimitByAgencyController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.limitapproved'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/ceiling/exp/expApproveLimitController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/exp/expApproveLimitView.html',
                                        js:'app/mtef/mtf/ceiling/exp/expApproveLimitController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.expfeedbackcollection'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/ceiling/exp/expFeedbackCollectionController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/exp/expFeedbackCollectionView.html',
                                        js:'app/mtef/mtf/ceiling/exp/expFeedbackCollectionController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.explimitconfirm'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/ceiling/exp/expLimitConfirmController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/exp/expLimitConfirmView.html',
                                        js:'app/mtef/mtf/ceiling/exp/expLimitConfirmController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.revLimit'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/ceiling/rev/revLimitController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/rev/revLimitView.html',
                                        js:'app/mtef/mtf/ceiling/rev/revLimitController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.revforecastcollection'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'lazy_character_counter',
                                'app/mtef/mtf/ceiling/rev/revForecastCollectionController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/rev/revForecastCollectionView.html',
                                        js:'app/mtef/mtf/ceiling/rev/revForecastCollectionController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.revlimitconfirm'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/ceiling/rev/revLimitConfirmController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/rev/revLimitConfirmView.html',
                                        js:'app/mtef/mtf/ceiling/rev/revLimitConfirmController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.revresign'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/ceiling/rev/revResignController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/ceiling/rev/revResignView.html',
                                        js:'app/mtef/mtf/ceiling/rev/revResignController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.debtresign'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/confirmation/debtResignController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/confirmation/debtResignView.html',
                                        js:'app/mtef/mtf/confirmation/debtResignController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.mtfcheckgeneraldivision'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/confirmation/mtfCheckGeneralDivisionController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/confirmation/mtfCheckGeneralDivisionView.html',
                                        js:'app/mtef/mtf/confirmation/mtfCheckGeneralDivisionController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.mtfconfirm'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/confirmation/mtfConfirmController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/confirmation/mtfConfirmView.html',
                                        js:'app/mtef/mtf/confirmation/mtfConfirmController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.mtfsubmitcabinet'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/confirmation/mtfSubmitCabinetController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/confirmation/mtfSubmitCabinetView.html',
                                        js:'app/mtef/mtf/confirmation/mtfSubmitCabinetController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.totalfinancestastics'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/statistics/totalFinanceStasticsController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/statistics/totalFinanceStasticsView.html',
                                        js:'app/mtef/mtf/statistics/totalFinanceStasticsController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.variousindicatorstastics'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/statistics/variousIndicatorStasticsController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/statistics/variousIndicatorStasticsView.html',
                                        js:'app/mtef/mtf/statistics/variousIndicatorStasticsController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.fiscalinterfacestastics'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/statistics/fiscalInterfaceStasticsController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/statistics/fiscalInterfaceStasticsView.html',
                                        js:'app/mtef/mtf/statistics/fiscalInterfaceStasticsController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.lblcd'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/lbl/lblCdController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/lbl/lblCdView.html',
                                        js:'app/mtef/pip/lbl/lblCdController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.forecast'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/common/GBGforecasrLimitDistrController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/common/GBGforecasrLimitDistrView.html',
                                        js:'app/mtef/pip/common/GBGforecasrLimitDistrController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.standartprice'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/common/stndPriceManageController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/common/stndPriceManageView.html',
                                        js:'app/mtef/pip/common/stndPriceManageController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.lawdoc'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/common/lawDocManageController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/common/lawDocManageView.html',
                                        js:'app/mtef/pip/common/lawDocManageController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.mapmanage'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/common/mapManageController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/common/mapManageView.html',
                                        js:'app/mtef/pip/common/mapManageController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.ldi'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/common/ldiController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/common/ldiView.html',
                                        js:'app/mtef/pip/common/ldiController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.productcd'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'lazy_character_counter',
                                'app/mtef/pip/common/prodctCdController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/common/prodctCdView.html',
                                        js:'app/mtef/pip/common/prodctCdController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.profescd'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/common/profesCdController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/common/profesCdView.html',
                                        js:'app/mtef/pip/common/profesCdController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.projbasic'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'lazy_wizard',
                                'app/mtef/pip/register/projInfoMgmtBasicController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/register/projInfoMgmtBasicView.html',
                                        js:'app/mtef/pip/register/projInfoMgmtBasicController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.projdetails'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/register/projInfoMgmtDtlController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/register/projInfoMgmtDtlView.html',
                                        js:'app/mtef/pip/register/projInfoMgmtDtlController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link.startsWith('restricted.pip.projdetails')){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/register/projInfoMgmtFullDtlController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/register/projInfoMgmtFullDtlView.html',
                                        js:'app/mtef/pip/register/projInfoMgmtFullDtlController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.projfinance'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/register/projFinPlanMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/register/projFinPlanMgmtView.html',
                                        js:'app/mtef/pip/register/projFinPlanMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.runcost'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/register/projRunCostMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/register/projRunCostMgmtView.html',
                                        js:'app/mtef/pip/register/projRunCostMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.projreqprofes'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/register/projReqProfesMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/register/projReqProfesMgmtView.html',
                                        js:'app/mtef/pip/register/projReqProfesMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.projproduct'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/register/projReqProdctMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/register/projReqProdctMgmtView.html',
                                        js:'app/mtef/pip/register/projReqProdctMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.priortytemplate'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/priorty/prioTmplMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/priorty/prioTmplMgmtView.html',
                                        js:'app/mtef/pip/priorty/prioTmplMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.gbgpriorty'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/priorty/prioTmplGBGMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/priorty/prioTmplGBGMgmtView.html',
                                        js:'app/mtef/pip/priorty/prioTmplGBGMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.ndapriorty'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/priorty/prioTmplNDAMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/priorty/prioTmplNDAMgmtView.html',
                                        js:'app/mtef/pip/priorty/prioTmplNDAMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.estimate'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/priorty/prioEstmController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/priorty/prioEstmView.html',
                                        js:'app/mtef/pip/priorty/prioEstmController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.estimateresult'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/priorty/prioEstmRsltController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/priorty/prioEstmRsltView.html',
                                        js:'app/mtef/pip/priorty/prioEstmRsltController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.projselection'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/manage/projSlctMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/manage/projSlctMgmtView.html',
                                        js:'app/mtef/pip/manage/projSlctMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.cabinet'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/manage/submitByCabinetController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/manage/submitByCabinetView.html',
                                        js:'app/mtef/pip/manage/submitByCabinetController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.mtf.mtfsubmitparliament'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/mtf/confirmation/mtfSubmitParliamentController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/mtf/confirmation/mtfSubmitParliamentView.html',
                                        js:'app/mtef/mtf/confirmation/mtfSubmitParliamentController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.parlament'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/manage/submitByParlController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/manage/submitByParlView.html',
                                        js:'app/mtef/pip/manage/submitByParlController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.prefs'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/manage/preFeasRsltMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/manage/preFeasRsltMgmtView.html',
                                        js:'app/mtef/pip/manage/preFeasRsltMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.fs'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/manage/feasRstlMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/manage/feasRsltMgmtView.html',
                                        js:'app/mtef/pip/manage/feasRstlMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.finschedule'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/manage/fincPlanSchdlController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/manage/fincPlanSchdlView.html',
                                        js:'app/mtef/pip/manage/fincPlanSchdlController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.finscheduleconfirm'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/manage/fincPlanSchdlCfmController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/manage/fincPlanSchdlCfmView.html',
                                        js:'app/mtef/pip/manage/fincPlanSchdlCfmController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.execplan'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/execution/execBdgPlanController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/execution/execBdgPlanView.html',
                                        js:'app/mtef/pip/execution/execBdgPlanController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.contract'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/execution/contractRsltMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/execution/contractRsltMgmtView.html',
                                        js:'app/mtef/pip/execution/contractRsltMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.bdgexec'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/execution/bdgExecRsltMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/execution/bdgExecRsltMgmtView.html',
                                        js:'app/mtef/pip/execution/bdgExecRsltMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.projchange'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/execution/projChgMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/execution/projChgMgmtView.html',
                                        js:'app/mtef/pip/execution/projChgMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.projresult'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/execution/projRsltMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/execution/projRsltMgmtView.html',
                                        js:'app/mtef/pip/execution/projRsltMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.ldiapply'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/execution/ldiApplyController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/execution/ldiApplyView.html',
                                        js:'app/mtef/pip/execution/ldiApplyController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.projstatsearch'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/pip/statistics/projStatSearchController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/pip/statistics/projStatSearchView.html',
                                        js:'app/mtef/pip/statistics/projStatSearchController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pip.projstat'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/common/commonCodeMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/common/commonCodeMgmtView.htm',
                                        js:'app/mtef/cmm/common/commonCodeMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        }
                        else if(currentState.link==='restricted.pages.pcode'){
                            $ocLazyLoad.load([
                                'lazy_parsleyjs',
                                'app/mtef/cmm/common/commonCodeMgmtController.js'
                            ]).then(function(){
                                $rootScope.listCustomers.push(
                                    { heading: currentState.title, route:currentState.link, tabId: $scope.formatRoute(currentState.link)+"-tab", active:true, content:'app/mtef/cmm/common/commonCodeMgmtView.html',
                                        js:'app/mtef/cmm/common/commonCodeMgmtController.js' }
                                );
                                localStorage.setItem('listOfCustomers', JSON.stringify($rootScope.listCustomers));
                            });
                        } else {
                            $ocLazyLoad.load([
                                'lazy_parsleyjs'
                            ]).then(function(){
                                //$location.path('/404');
                            });
                        }
                    }
                }
                else {
                    $rootScope.openTab(index);
                }
                if($rootScope.listCustomers.length>6){
                    $rootScope.listCustomers[6].active=true;
                }

                setTimeout(onResize, 500);
            };

            $rootScope.removeTab = function (event, index) {
                event.preventDefault();
                event.stopPropagation();
                var currentLoc = $location.path();
                angular.forEach($rootScope.listCustomers, function(item, key){
                    if(index == key && currentLoc == '/'+linkToRoute(item.route)){
                        var pointer = -1//;(index == $rootScope.listCustomers.length - 1) ? -1: 1;
                        $rootScope.switchTab($rootScope.listCustomers[index+pointer]);
                    }
                });
                $rootScope.listCustomers.splice(index, 1);
                localStorage.setItem('listOfCustomers',JSON.stringify($rootScope.listCustomers));
                setTimeout(onResize, 500);
            };
            
            $rootScope.openTab = function (index) {
                $rootScope.listCustomers[index].active=true;
                localStorage.setItem('listOfCustomers',JSON.stringify($rootScope.listCustomers));
            };

            var detectWrap = function(className) {
                var items = document.getElementsByClassName(className);
                var wrappedItems = [];
                var frstItem = items.length ? items[0] : {};
                var currItem = {};

                for (var i = 1; i < items.length; i++) {
                    currItem = items[i].getBoundingClientRect();
                    if (frstItem && frstItem.getBoundingClientRect().top < currItem.top) {
                        wrappedItems.push(items[i]);
                    }
                };

                return wrappedItems;
            };

            var onNoWrap = function () {
                $("#main-tab-chooser").hide();
            };

            var onWrapped = function (wrappedItems) {
                $("#main-tab-chooser").show();
                var hiddenListCustomers = [];
                for (var i = 0; i < wrappedItems.length; i++) {
                    angular.forEach($rootScope.listCustomers, function(item){
                        if (wrappedItems[i].id == $scope.formatRoute(item.route)+"-tab") {
                            hiddenListCustomers.push(item);
                        }
                    });
                }
                $rootScope.hiddenListCustomers = hiddenListCustomers;
            };

            var onResize = function () {
                var className = 'main-tab';
                var wrappedClassName = 'main-tab-wrapped';
                var normalItems = document.getElementsByClassName(className);
                var wrappedItems = detectWrap(className);
                for (var k = 0; k < normalItems.length; k++) {
                    var isWrapped = false;
                    for (var j = 0; j < wrappedItems.length; j++) {
                        if (normalItems[k] === wrappedItems[j]) {
                            isWrapped = true;
                            break;
                        }
                    }

                    if (isWrapped) {
                        normalItems[k].classList.add(wrappedClassName);
                    } else {
                        normalItems[k].classList.remove(wrappedClassName);
                    }
                }
                if (wrappedItems.length != 0) {
                    onWrapped(wrappedItems);
                } else {
                    onNoWrap();
                }
            };

            window.onresize = function () {
                onResize();
            };

            $(document).ready(function () {
                setTimeout(onResize, 1000);
            });
        }
    ])
;
