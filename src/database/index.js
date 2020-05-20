const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/noderest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify:true
})
mongoose.Promise = global.Promise

module.exports = mongoose
