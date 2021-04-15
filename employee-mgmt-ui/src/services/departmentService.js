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

