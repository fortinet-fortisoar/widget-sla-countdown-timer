/* Copyright start
    MIT License
    Copyright (c) 2026 Fortinet Inc
Copyright end */
(function () {
    angular
        .module('cybersponse')
        .controller('editSlaCountDownClock202Ctrl', editSlaCountDownClock202Ctrl);

    editSlaCountDownClock202Ctrl.$inject = ['$scope', '$uibModalInstance', '$state', 'config', 'appModulesService', 'Entity', 'picklistsService'];

    function editSlaCountDownClock202Ctrl($scope, $uibModalInstance, $state, config, appModulesService, Entity, picklistsService) {
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.config = config;


        function _init() {

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
              if(config.slaMappedOn || config.slaPausedOn){
                $scope.loadlistitem();
              }
                
            });
        }
        
        $scope.loadlistitem = function () {
           	$scope.fieldsArray.forEach(function(value, index, array)
        {
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
