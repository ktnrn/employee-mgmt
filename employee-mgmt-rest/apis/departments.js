var router = require("express").Router();
router.get("/", (req, res, next) => {
    var response = [
        {
            "ID": "EMP_1",
            "Name": "Human Resources",
            "costCenter": "C1234"
        },
        {
            "ID": "EMP_2",
            "Name": "Product Development",
            "costCenter": "C5634"
        }
    ];
    res.json(response);
});
module.exports = router;