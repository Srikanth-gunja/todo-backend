var nodemailer = require('nodemailer');
require('dotenv').config();

function sendVerification(email,url,sub)
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
  subject: sub,
  html:`
  <p>Click the button below to Reset password:</p>
  <a href="${url}">
      <button style="background-color: #4CAF50; /* Green */
                      border: none;
                      color: white;
                      padding: 15px 32px;
                      text-align: center;
                      text-decoration: none;
                      display: inline-block;
                      font-size: 16px;">
          Verify Email
      </button>
  </a>
`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    return res.status(400).json({"msg":"email not vaild"})
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}
module.exports=sendVerification;