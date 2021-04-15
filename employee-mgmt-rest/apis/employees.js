var router = require("express").Router();
router.get("/", (req, res, next) => {
    var response = [
        {
            "ID": "EMP_1",
            "Name": "Alex Doe",
            "deptId": "DEPT_A",
            "emailId": "alex@xyz.com",
            "phoneNumber": "123456789"
        },
        {
            "ID": "EMP_2",
            "Name": "Yin Mai",
            "deptId": "DEPT_B",
            "emailId": "yin@xyz.com",
            "phoneNumber": "234567891"
        }
    ];
    res.json(response);
});
module.exports = router;