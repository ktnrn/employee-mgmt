//This component is responsible for rendering the list of employees page.
angular.module("employeeMgmt").component("employeeDetails", {
    bindings: {
        employee: "<"
    },
    template: '<a ng-click="$ctrl.handleEmployeeIDClick()">{{$ctrl.employee.ID}}</a>',
    controller: function employeeDetailsController($scope) {
        var $ctrl = this;
        $ctrl.handleEmployeeIDClick = () => {
            $scope.$emit('employeeIDClicked', $ctrl.employee);
        };
    }
});