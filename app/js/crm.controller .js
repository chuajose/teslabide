function crmCtrl($scope, $http, $state, $stateParams){
    $scope.insertClient = function(){
        //utilsCrm.InsertClient($scope.newClient,$scope.billingData);
        return true;
    }

}

//Definimos los controladores
angular
    .module('bidef')
    .controller('crmCtrl ', crmCtrl)