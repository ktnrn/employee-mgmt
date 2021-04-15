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

