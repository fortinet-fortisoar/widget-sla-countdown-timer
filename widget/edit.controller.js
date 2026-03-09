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
                        EDIT_PAGE_SELECT_SLA_COMPLETE_DATE: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_SELECT_SLA_COMPLETE_DATE'),
                        EDIT_PAGE_SELECT_SLA_DUE_DATE: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_SELECT_SLA_DUE_DATE'),
                        EDIT_PAGE_SELECT_SLA_PAUSED_DATE: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_SELECT_SLA_PAUSED_DATE'),
                        EDIT_PAGE_PAUSE_CLOCK: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_PAUSE_CLOCK'),
                        EDIT_PAGE_WHEN: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_WHEN'),
                        EDIT_PAGE_IS_SET_TO: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_IS_SET_TO'),
                        EDIT_PAGE_THEN_SET_TITLE_TO: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_THEN_SET_TITLE_TO'),
                        EDIT_PAGE_STOP_CLOCK: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_STOP_CLOCK'),
                        EDIT_PAGE_REMAINING_TIME: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_REMAINING_TIME'),
                        EDIT_PAGE_CONSUMED_TIME: widgetUtilityService.translate('slaCountDownClock.EDIT_PAGE_CONSUMED_TIME')
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
            const fieldMap = {
                [config.slaMappedOn]: 'mappedListItems',
                [config.slaPausedOn]: 'pauseListItems'
            };

            $scope.fieldsArray.forEach(function (field) {
                const targetField = fieldMap[field.name];
                if (targetField) {
                    picklistsService.loadPicklists(field).then(function (data) {
                        $scope[targetField] = data.options;
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
