//This component is responsible for rendering the list of employees page.
angular.module("employeeMgmt").component("employeeList", {
    templateUrl: "src/views/employeeList.html",
    controller: function employeeListController($http, employeesService, $scope) {
        var $ctrl = this;
        $ctrl.$onInit = () => {
            $ctrl.showEmployeeDetailsModal = false;
            $ctrl.gridOptions = {
                paginationPageSizes: [25, 50, 75],
                paginationPageSize: 5,
                enableSorting: false,
                columnDefs: [
                    { field: 'ID', displayName: 'Employee ID', cellTemplate: '<div class="ui-grid-cell-contents" title="{{row.entity.ID}}"><employee-details employee="row.entity"></employee-details></div>' },
                    { field: 'Name', displayName: 'Employee Name' },
                    { field: 'deptId', displayName: 'Department', enableSorting: false }
                ],
                data: [],
                onRegisterApi: function (gridApi) {
                    $ctrl.gridApi = gridApi;
                }
            };
            employeesService.getEmployees().then((employees) => {
                $ctrl.gridOptions.data = employees;
            });

            //We will be integrating the backend API once it is ready.
            /*$http.get('/employees')
            .then(function (response) {
                
            });*/
        };
        $scope.$on('employeeIDClicked', (event, employee) => {
            //open the modal/
            $ctrl.employee = employee;
            $ctrl.showEmployeeDetailsModal = true;
        });
    }
});