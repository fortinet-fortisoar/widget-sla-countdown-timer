/* Copyright start
    MIT License
    Copyright (c) 2026 Fortinet Inc
Copyright end */
(function () {
    angular
        .module('cybersponse')
        .controller('editSlaCountDownClock202Ctrl', editSlaCountDownClock202Ctrl);

    editSlaCountDownClock202Ctrl.$inject = ['$scope', '$uibModalInstance', '$state', 'config', 'appModulesService', 'Entity', 'picklistsService', 'widgetUtilityService'];

    function editSlaCountDownClock202Ctrl($scope, $uibModalInstance, $state, config, appModulesService, Entity, picklistsService, widgetUtilityService) {
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.config = config;

        function _handleTranslations() {
            let widgetData = {
                name: $scope.config.name,
                version: $scope.config.version
            };
            let widgetNameVersion = widgetUtilityService.getWidgetNameVersion(widgetData);
            if (widgetNameVersion) {
                widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
                    $scope.viewWidgetVars = {
                        // Create your translating static string variables here
                        EDIT_PAGE_WIDGET_TITLE: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_WIDGET_TITLE'),
                        EDIT_PAGE_TITLE: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_TITLE'),
                        EDIT_PAGE_SELECT_AN_OPTION: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_SELECT_AN_OPTION'),
                        EDIT_PAGE_SELECT_SLA_COMPLETE_DATE: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_SELECT_SLA_COMPLETE_DATE'),
                        EDIT_PAGE_SELECT_SLA_DUE_DATE: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_SELECT_SLA_DUE_DATE'),
                        EDIT_PAGE_SELECT_SLA_PAUSED_DATE: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_SELECT_SLA_PAUSED_DATE'),
                        EDIT_PAGE_PAUSE_CLOCK: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_PAUSE_CLOCK'),
                        EDIT_PAGE_WHEN: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_WHEN'),
                        EDIT_PAGE_IS_SET_TO: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_IS_SET_TO'),
                        EDIT_PAGE_THEN_SET_TITLE_TO: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_THEN_SET_TITLE_TO'),
                        EDIT_PAGE_STOP_CLOCK: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_STOP_CLOCK'),
                        EDIT_PAGE_SHOW: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_SHOW'),
                        EDIT_PAGE_REMAINING_TIME: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_REMAINING_TIME'),
                        EDIT_PAGE_CONSUMED_TIME: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_CONSUMED_TIME'),
                        EDIT_PAGE_SAVE_BUTTON: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_SAVE_BUTTON'),
                        EDIT_PAGE_CANCEL_BUTTON: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_CANCEL_BUTTON')
                    };
                });
            }
            else {
                $timeout(function () {
                    $scope.cancel();
                }, 100)
            }
        }

        function _init() {

            _handleTranslations();

            if ($state.params.module) {
                loadAttributes();
            }

        }
        _init();

        function loadAttributes() {
            $scope.fieldsArray = [];
            var entity = new Entity($state.params.module);
            entity.loadFields().then(function () {
                $scope.fieldsArray = entity.getFormFieldsArray();
                if (config.slaMappedOn || config.slaPausedOn) {
                    $scope.loadlistitem();
                }

            });
        }

        $scope.loadlistitem = function () {
            $scope.fieldsArray.forEach(function (value, index, array) {
                if (value.name === config.slaMappedOn || value.name === config.slaPausedOn) {
                    picklistsService.loadPicklists(value).then(function (data) {
                        $scope.listItems = data.options;
                    });
                }
            });
        };

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
        function save() {
            $uibModalInstance.close($scope.config);
        }
    }
})();
