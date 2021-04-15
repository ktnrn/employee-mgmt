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