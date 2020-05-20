const nodemailer = require('nodemailer')
const path = require('path');
const hbs = require('nodemailer-express-handlebars')


const { host, port, user, pass } = require('../config/mail.json')

var transport = nodemailer.createTransport({
  host,
  port,
  auth: { user, pass },
})

const resPath = path.resolve('./src/resources/mail/')
transport.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.handlebars',
      layoutsDir: './src/resources/mail/',
      partialsDir: './src/resources/mail/',
      defaultLayout: undefined,
      helpers: undefined,
      compilerOptions: undefined,
    },
    partialsDir: '../resources/mail/',
    viewPath: resPath,
    extName: '.html',
  })
)

module.exports = transport
