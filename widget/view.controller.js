(function () {
    angular
        .module('cybersponse')
        .controller('slaCountDownClock201Ctrl', slaCountDownClock201Ctrl);
    slaCountDownClock201Ctrl.$inject = ['$scope', '$state', '$filter', '$interval', 'Modules', 'config', 'websocketService'];
    function slaCountDownClock201Ctrl($scope, $state, $filter, $interval, Modules, config, websocketService) {
        $scope.config = config;
        $scope.title = config.title;
        $scope.timeinterval = 0;
        $scope.slastate = "Active";
        var widgetsubscription;
        Modules.get({
            module: $state.params.module,
            id: $state.params.id,
            __selectFields: config.duedate + ',' + config.sladate + ',' + config.slaMappedOn + ',' + 'createDate' + ',' + config.slapaused
        }
        ).$promise.then(function (result) {
            $scope.pausedate = new Date($filter('unixToDate')(result[config.slapaused]));
            $scope.duedate = new Date($filter('unixToDate')(result[config.duedate]));
            if (result[config.duedate] === null || result[config.duedate] === '') {
                $scope.slastate = "NotSet";
                $scope.title = "SLA Not Applicable";
            }
            else if (result[config.slaMappedOn].itemValue === config.pausedItemvalue) {
                $scope.slastate = "Paused";
                $scope.title = "SLA Paused";
                stopCountDown('clockdiv', $scope.duedate, $scope.pausedate);
            }
            else if (result[config.slaMappedOn].itemValue != config.metItemvalue && result[config.duedate]) {
                $scope.slastate = "Active";
                $scope.title = config.title;
                initializeClock('clockdiv', $scope.duedate);
            }
            else if (result[config.duedate]) {
                $scope.sladate = new Date($filter('unixToDate')(result[config.sladate]));
                $scope.createdate = new Date($filter('unixToDate')(result['createDate']));
                $scope.title = config.stopStateTitle;
                $scope.slastate = "Met";
                if (config.timeToDisplay === "consumedTime") {
                    stopCountDown('clockdiv', $scope.duedate, $scope.sladate, $scope.createdate);
                }
                else {
                    stopCountDown('clockdiv', $scope.duedate, $scope.sladate);
                }
            }
        }
        );
        $scope.$on('$destroy', function () {
            if (widgetsubscription) {
                websocketService.unsubscribe(widgetsubscription);
            }
            $interval.cancel($scope.timeinterval);
        }
        );
        $scope.$on('websocket:reconnect', function () {
            widgetWSSubscribe();
        }
        );
        function widgetWSSubscribe() {
            if (widgetsubscription) {
                websocketService.unsubscribe(widgetsubscription);
            }
            websocketService.subscribe($state.params.module + '/' + $state.params.id, function (result) {
                var changedAttribute;
                if (angular.isDefined(result['changeData'])) {
                    if (result['changeData'].includes(config.duedate)) {
                        changedAttribute = config.duedate;
                    }
                    else if (result['changeData'].includes(config.slaMappedOn)) {
                        changedAttribute = config.slaMappedOn;
                    }
                }
                if (changedAttribute) {
                    Modules.get({
                        module: $state.params.module,
                        id: $state.params.id,
                        __selectFields: config.duedate + ',' + config.sladate + ',' + config.slaMappedOn + ',' + 'createDate' + ',' + config.slapaused
                    }
                    ).$promise.then(function (result) {
                        if (changedAttribute === config.duedate) {
                            if (result[config.slaMappedOn].itemValue == "NA") {
                                $scope.slastate = "NotSet";
                                $scope.title = "SLA Not Applicable";
                                return true;
                            }
                            $interval.cancel($scope.timeinterval);
                            $scope.duedate = new Date($filter('unixToDate')(result[config.duedate]));
                            if (result[config.slaMappedOn].itemValue != config.metItemvalue) {
                                $interval.cancel($scope.timeinterval);
                                initializeClock('clockdiv', $scope.duedate);
                                $scope.title = config.title;
                                $scope.slastate = "Active";
                            }
                        }
                        else {
                            if (result[config.slaMappedOn].itemValue == config.metItemvalue) {
                                $interval.cancel($scope.timeinterval);
                                $scope.sladate = new Date($filter('unixToDate')(result[config.sladate]));
                                $scope.duedate = new Date($filter('unixToDate')(result[config.duedate]));
                                $scope.createdate = new Date($filter('unixToDate')(result['createDate']));

                                $scope.title = config.stopStateTitle;
                                $scope.slastate = "Met";
                                if (config.timeToDisplay === "consumedTime") {
                                    stopCountDown('clockdiv', $scope.duedate, $scope.sladate, $scope.createdate);
                                }
                                else {
                                    stopCountDown('clockdiv', $scope.duedate, $scope.sladate);
                                }
                            }
                            else if (result[config.slaMappedOn].itemValue === config.pausedItemvalue) {
                                $interval.cancel($scope.timeinterval);
                                $scope.slastate = "Paused";
                                $scope.title = "SLA Paused"
                                $scope.pausedate = new Date($filter('unixToDate')(result[config.slapaused]));
                                stopCountDown('clockdiv', $scope.duedate, $scope.pausedate);
                            }
                        }
                    });
                }
            }
            ).then(function (subscription) {
                widgetsubscription = subscription;
            });
        }
        widgetWSSubscribe();
        function getTimeRemaining(duedate, slatime, consumedtime) {
            var total = 0;
            if (slatime && !consumedtime) {
                total = Date.parse(duedate) - Date.parse(slatime);
            }
            else if (slatime && consumedtime) {
                total = Date.parse(slatime) - Date.parse(consumedtime);
            }
            else {
                total = Date.parse(duedate) - Date.parse(new Date());
            }
            var seconds = 0;
            var minutes = 0;
            var hours = 0;
            var days = 0;
            if (total > 0) {
                seconds = Math.floor((total / 1000) % 60);
                minutes = Math.floor((total / 1000 / 60) % 60);
                hours = Math.floor((total / (1000 * 60 * 60)) % 24);
                days = Math.floor(total / (1000 * 60 * 60 * 24));

            }
            return {
                total,
                days,
                hours,
                minutes,
                seconds
            };
        }
        function initializeClock(id, duedate) {
            function updateClock() {
                var t = getTimeRemaining(duedate);
                $scope.daysSpan = t.days;
                $scope.hoursSpan = ('0' + t.hours).slice(-2);
                $scope.minutesSpan = ('0' + t.minutes).slice(-2);
                $scope.secondsSpan = ('0' + t.seconds).slice(-2);
                if (t.total <= 0) {
                    websocketService.unsubscribe($scope.wsid);
                    $interval.cancel($scope.timeinterval);
                    $scope.slastate = "Missed";
                }
            }
            updateClock();
            $scope.timeinterval = $interval(updateClock, 1000);
        }

        function stopCountDown(id, duedate, slatime, consumedtime) {
            var t = 0;
            if (slatime && !consumedtime) {
                t = getTimeRemaining(duedate, slatime);
            }
            else if (slatime && consumedtime) {
                t = getTimeRemaining(duedate, slatime, consumedtime);
            }
            else {
                t = getTimeRemaining(duedate);
            }
            $scope.daysSpan = t.days;
            $scope.hoursSpan = ('0' + t.hours).slice(-2);
            $scope.minutesSpan = ('0' + t.minutes).slice(-2);
            $scope.secondsSpan = ('0' + t.seconds).slice(-2);
        }
    }
}
)();
