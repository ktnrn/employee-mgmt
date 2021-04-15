const express = require('express')
const app = express()
app.use(require('./apis'));

app.listen(80, () => {
  console.log(`Server listening at http://localhost:80`)
})
