var employeeMgmt = angular.module("employeeMgmt", ['ui.grid']);
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
angular.module("employeeMgmt").constant("API", {
    "EMPLOYEES": {
        "URL": "http://localhost:80/employees" 
    },
    "DEPARTMENTS": {
        "URL": "http://localhost:80/departments"
    }
});
angular.module("employeeMgmt").service("departmentService", function ($http, API) {
    let departmentService = this;
    departmentService.departmentsCache;
    departmentService.getDepartments = () => {
        if(departmentsCache === undefined) {
            let getConfigs = {
                method: 'get',
                url: API.DEPARTMENTS.URL,
                dataType: 'json',
                contentType: "application/json"
            };
            return $http.get(getConfigs).then((departments) => {
                for(department of departments) {
                    departmentService.departmentsCache[department.ID] = department;
                }
            });
        } else {
            return $q.defer().resolve(departmentService.departmentsCache);
        }
    };
});


angular.module("employeeMgmt").service("employeesService", function ($http, API, departmentService) {
    let employeesService = this;
    employeesService.getEmployees = (currentPage = 0, paginationSize = 5) => {
        let selectParams = "$select=ID,Name,deptId";
        let limitParams = "$limit=" + paginationSize;
        let skipParams = "$skip=" + (currentPage * paginationSize);
        let queryParams = [selectParams, limitParams, skipParams].join("&");

        let getConfigs = {
            method: 'get',
            url: API.EMPLOYEES.URL + "?" + queryParams,
            dataType: 'json',
            contentType: "application/json"
        };
        /*
            [{
                "ID": "EMP_1",
                "Name": "Alex Doe",
                "deptId": "DEPT_A",
                "emailId": "alex@xyz.com",
                "phoneNumber": "123456789"
            }]
        */
        return $http(getConfigs).then((employees) => {
            return departmentService.getDepartments().then((departmentCache) => {
                for(emp of employees) {
                    //adding department details to employee. This is equivalent to $expand 
                    let departmentDetails = departmentCache[emp.deptId];
                    emp = Object.assign(emp, departmentDetails);
                }
                return employees;
            });
        });
    };
    employeesService.getEmployeeDetails = (empId) => {
        return;
    };
});


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
/**
 * This component is to render the modal with the employee details
 */
 angular.module('employeeMgmt').component('modal', {
    bindings: {
        employee: '<',
        onClose: '&'
    },
    templateUrl: 'src/components/modal/modal.html',
    controller: function () {
        var $ctrl = this;
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVtcGxveWVlTWdtdC5qcyIsImNvbXBvbmVudHMvZW1wbG95ZWVEZXRhaWxzLmpzIiwiY29uc3RhbnRzL2FwaUNvbnN0YW50cy5qcyIsInNlcnZpY2VzL2RlcGFydG1lbnRTZXJ2aWNlLmpzIiwic2VydmljZXMvZW1wbG95ZWVzU2VydmljZS5qcyIsInZpZXdzL2VtcGxveWVlTGlzdC5qcyIsImNvbXBvbmVudHMvbW9kYWwvbW9kYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGVtcGxveWVlTWdtdCA9IGFuZ3VsYXIubW9kdWxlKFwiZW1wbG95ZWVNZ210XCIsIFsndWkuZ3JpZCddKTsiLCIvL1RoaXMgY29tcG9uZW50IGlzIHJlc3BvbnNpYmxlIGZvciByZW5kZXJpbmcgdGhlIGxpc3Qgb2YgZW1wbG95ZWVzIHBhZ2UuXHJcbmFuZ3VsYXIubW9kdWxlKFwiZW1wbG95ZWVNZ210XCIpLmNvbXBvbmVudChcImVtcGxveWVlRGV0YWlsc1wiLCB7XHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIGVtcGxveWVlOiBcIjxcIlxyXG4gICAgfSxcclxuICAgIHRlbXBsYXRlOiAnPGEgbmctY2xpY2s9XCIkY3RybC5oYW5kbGVFbXBsb3llZUlEQ2xpY2soKVwiPnt7JGN0cmwuZW1wbG95ZWUuSUR9fTwvYT4nLFxyXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24gZW1wbG95ZWVEZXRhaWxzQ29udHJvbGxlcigkc2NvcGUpIHtcclxuICAgICAgICB2YXIgJGN0cmwgPSB0aGlzO1xyXG4gICAgICAgICRjdHJsLmhhbmRsZUVtcGxveWVlSURDbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgJHNjb3BlLiRlbWl0KCdlbXBsb3llZUlEQ2xpY2tlZCcsICRjdHJsLmVtcGxveWVlKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KTsiLCJhbmd1bGFyLm1vZHVsZShcImVtcGxveWVlTWdtdFwiKS5jb25zdGFudChcIkFQSVwiLCB7XHJcbiAgICBcIkVNUExPWUVFU1wiOiB7XHJcbiAgICAgICAgXCJVUkxcIjogXCJodHRwOi8vbG9jYWxob3N0OjgwL2VtcGxveWVlc1wiIFxyXG4gICAgfSxcclxuICAgIFwiREVQQVJUTUVOVFNcIjoge1xyXG4gICAgICAgIFwiVVJMXCI6IFwiaHR0cDovL2xvY2FsaG9zdDo4MC9kZXBhcnRtZW50c1wiXHJcbiAgICB9XHJcbn0pOyIsImFuZ3VsYXIubW9kdWxlKFwiZW1wbG95ZWVNZ210XCIpLnNlcnZpY2UoXCJkZXBhcnRtZW50U2VydmljZVwiLCBmdW5jdGlvbiAoJGh0dHAsIEFQSSkge1xyXG4gICAgbGV0IGRlcGFydG1lbnRTZXJ2aWNlID0gdGhpcztcclxuICAgIGRlcGFydG1lbnRTZXJ2aWNlLmRlcGFydG1lbnRzQ2FjaGU7XHJcbiAgICBkZXBhcnRtZW50U2VydmljZS5nZXREZXBhcnRtZW50cyA9ICgpID0+IHtcclxuICAgICAgICBpZihkZXBhcnRtZW50c0NhY2hlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV0IGdldENvbmZpZ3MgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBBUEkuREVQQVJUTUVOVFMuVVJMLFxyXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIlxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGdldENvbmZpZ3MpLnRoZW4oKGRlcGFydG1lbnRzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmb3IoZGVwYXJ0bWVudCBvZiBkZXBhcnRtZW50cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlcGFydG1lbnRTZXJ2aWNlLmRlcGFydG1lbnRzQ2FjaGVbZGVwYXJ0bWVudC5JRF0gPSBkZXBhcnRtZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJHEuZGVmZXIoKS5yZXNvbHZlKGRlcGFydG1lbnRTZXJ2aWNlLmRlcGFydG1lbnRzQ2FjaGUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pO1xyXG5cclxuIiwiYW5ndWxhci5tb2R1bGUoXCJlbXBsb3llZU1nbXRcIikuc2VydmljZShcImVtcGxveWVlc1NlcnZpY2VcIiwgZnVuY3Rpb24gKCRodHRwLCBBUEksIGRlcGFydG1lbnRTZXJ2aWNlKSB7XHJcbiAgICBsZXQgZW1wbG95ZWVzU2VydmljZSA9IHRoaXM7XHJcbiAgICBlbXBsb3llZXNTZXJ2aWNlLmdldEVtcGxveWVlcyA9IChjdXJyZW50UGFnZSA9IDAsIHBhZ2luYXRpb25TaXplID0gNSkgPT4ge1xyXG4gICAgICAgIGxldCBzZWxlY3RQYXJhbXMgPSBcIiRzZWxlY3Q9SUQsTmFtZSxkZXB0SWRcIjtcclxuICAgICAgICBsZXQgbGltaXRQYXJhbXMgPSBcIiRsaW1pdD1cIiArIHBhZ2luYXRpb25TaXplO1xyXG4gICAgICAgIGxldCBza2lwUGFyYW1zID0gXCIkc2tpcD1cIiArIChjdXJyZW50UGFnZSAqIHBhZ2luYXRpb25TaXplKTtcclxuICAgICAgICBsZXQgcXVlcnlQYXJhbXMgPSBbc2VsZWN0UGFyYW1zLCBsaW1pdFBhcmFtcywgc2tpcFBhcmFtc10uam9pbihcIiZcIik7XHJcblxyXG4gICAgICAgIGxldCBnZXRDb25maWdzID0ge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdnZXQnLFxyXG4gICAgICAgICAgICB1cmw6IEFQSS5FTVBMT1lFRVMuVVJMICsgXCI/XCIgKyBxdWVyeVBhcmFtcyxcclxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICBbe1xyXG4gICAgICAgICAgICAgICAgXCJJRFwiOiBcIkVNUF8xXCIsXHJcbiAgICAgICAgICAgICAgICBcIk5hbWVcIjogXCJBbGV4IERvZVwiLFxyXG4gICAgICAgICAgICAgICAgXCJkZXB0SWRcIjogXCJERVBUX0FcIixcclxuICAgICAgICAgICAgICAgIFwiZW1haWxJZFwiOiBcImFsZXhAeHl6LmNvbVwiLFxyXG4gICAgICAgICAgICAgICAgXCJwaG9uZU51bWJlclwiOiBcIjEyMzQ1Njc4OVwiXHJcbiAgICAgICAgICAgIH1dXHJcbiAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gJGh0dHAoZ2V0Q29uZmlncykudGhlbigoZW1wbG95ZWVzKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBkZXBhcnRtZW50U2VydmljZS5nZXREZXBhcnRtZW50cygpLnRoZW4oKGRlcGFydG1lbnRDYWNoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZm9yKGVtcCBvZiBlbXBsb3llZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2FkZGluZyBkZXBhcnRtZW50IGRldGFpbHMgdG8gZW1wbG95ZWUuIFRoaXMgaXMgZXF1aXZhbGVudCB0byAkZXhwYW5kIFxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBkZXBhcnRtZW50RGV0YWlscyA9IGRlcGFydG1lbnRDYWNoZVtlbXAuZGVwdElkXTtcclxuICAgICAgICAgICAgICAgICAgICBlbXAgPSBPYmplY3QuYXNzaWduKGVtcCwgZGVwYXJ0bWVudERldGFpbHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVtcGxveWVlcztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgZW1wbG95ZWVzU2VydmljZS5nZXRFbXBsb3llZURldGFpbHMgPSAoZW1wSWQpID0+IHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9O1xyXG59KTtcclxuXHJcbiIsIi8vVGhpcyBjb21wb25lbnQgaXMgcmVzcG9uc2libGUgZm9yIHJlbmRlcmluZyB0aGUgbGlzdCBvZiBlbXBsb3llZXMgcGFnZS5cclxuYW5ndWxhci5tb2R1bGUoXCJlbXBsb3llZU1nbXRcIikuY29tcG9uZW50KFwiZW1wbG95ZWVMaXN0XCIsIHtcclxuICAgIHRlbXBsYXRlVXJsOiBcInNyYy92aWV3cy9lbXBsb3llZUxpc3QuaHRtbFwiLFxyXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24gZW1wbG95ZWVMaXN0Q29udHJvbGxlcigkaHR0cCwgZW1wbG95ZWVzU2VydmljZSwgJHNjb3BlKSB7XHJcbiAgICAgICAgdmFyICRjdHJsID0gdGhpcztcclxuICAgICAgICAkY3RybC4kb25Jbml0ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAkY3RybC5zaG93RW1wbG95ZWVEZXRhaWxzTW9kYWwgPSBmYWxzZTtcclxuICAgICAgICAgICAgJGN0cmwuZ3JpZE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uUGFnZVNpemVzOiBbMjUsIDUwLCA3NV0sXHJcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uUGFnZVNpemU6IDUsXHJcbiAgICAgICAgICAgICAgICBlbmFibGVTb3J0aW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbHVtbkRlZnM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7IGZpZWxkOiAnSUQnLCBkaXNwbGF5TmFtZTogJ0VtcGxveWVlIElEJywgY2VsbFRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cInVpLWdyaWQtY2VsbC1jb250ZW50c1wiIHRpdGxlPVwie3tyb3cuZW50aXR5LklEfX1cIj48ZW1wbG95ZWUtZGV0YWlscyBlbXBsb3llZT1cInJvdy5lbnRpdHlcIj48L2VtcGxveWVlLWRldGFpbHM+PC9kaXY+JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgZmllbGQ6ICdOYW1lJywgZGlzcGxheU5hbWU6ICdFbXBsb3llZSBOYW1lJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgZmllbGQ6ICdkZXB0SWQnLCBkaXNwbGF5TmFtZTogJ0RlcGFydG1lbnQnLCBlbmFibGVTb3J0aW5nOiBmYWxzZSB9XHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogW10sXHJcbiAgICAgICAgICAgICAgICBvblJlZ2lzdGVyQXBpOiBmdW5jdGlvbiAoZ3JpZEFwaSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRjdHJsLmdyaWRBcGkgPSBncmlkQXBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBlbXBsb3llZXNTZXJ2aWNlLmdldEVtcGxveWVlcygpLnRoZW4oKGVtcGxveWVlcykgPT4ge1xyXG4gICAgICAgICAgICAgICAgJGN0cmwuZ3JpZE9wdGlvbnMuZGF0YSA9IGVtcGxveWVlcztcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvL1dlIHdpbGwgYmUgaW50ZWdyYXRpbmcgdGhlIGJhY2tlbmQgQVBJIG9uY2UgaXQgaXMgcmVhZHkuXHJcbiAgICAgICAgICAgIC8qJGh0dHAuZ2V0KCcvZW1wbG95ZWVzJylcclxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSk7Ki9cclxuICAgICAgICB9O1xyXG4gICAgICAgICRzY29wZS4kb24oJ2VtcGxveWVlSURDbGlja2VkJywgKGV2ZW50LCBlbXBsb3llZSkgPT4ge1xyXG4gICAgICAgICAgICAvL29wZW4gdGhlIG1vZGFsL1xyXG4gICAgICAgICAgICAkY3RybC5lbXBsb3llZSA9IGVtcGxveWVlO1xyXG4gICAgICAgICAgICAkY3RybC5zaG93RW1wbG95ZWVEZXRhaWxzTW9kYWwgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KTsiLCIvKipcclxuICogVGhpcyBjb21wb25lbnQgaXMgdG8gcmVuZGVyIHRoZSBtb2RhbCB3aXRoIHRoZSBlbXBsb3llZSBkZXRhaWxzXHJcbiAqL1xyXG4gYW5ndWxhci5tb2R1bGUoJ2VtcGxveWVlTWdtdCcpLmNvbXBvbmVudCgnbW9kYWwnLCB7XHJcbiAgICBiaW5kaW5nczoge1xyXG4gICAgICAgIGVtcGxveWVlOiAnPCcsXHJcbiAgICAgICAgb25DbG9zZTogJyYnXHJcbiAgICB9LFxyXG4gICAgdGVtcGxhdGVVcmw6ICdzcmMvY29tcG9uZW50cy9tb2RhbC9tb2RhbC5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJGN0cmwgPSB0aGlzO1xyXG4gICAgfVxyXG59KTsiXX0=
