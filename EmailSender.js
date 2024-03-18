var nodemailer = require('nodemailer');
require('dotenv').config();

function sendVerification(email,id,token)
{
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

var mailOptions = {
  from: process.env.GMAIL_USER,
  to: email,
  subject: 'RESET YOUR PASSWORD',
  text: `http://localhost:3000/react_to_do_app/reset/${id}/${token}`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}
module.exports=sendVerification;