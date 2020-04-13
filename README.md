# sms-verify-cert
SMS, Verify API Certification Project

## To run Project
1. npm install
2. on command prompt, `ngrok http 3000` 
3. Update webhook url on dashboard
4. Update .env file
5. To register phone number, in postman:\
  URl: POST http://localhost:3000/register \
  Request Body: `{
    "newUser": <YOUR PHONE NUMBER>
}` 
6. To Verify phone number: \
  URl: POST http://localhost:3000/verify \
  Request Body: `{
	"code": <VERIFICATION CODE>
}`
7. To start chat: \
  URL: POST http://localhost:3000/chat \
  Request Body: `{
	"userANumber": <FIRST NUMBER>,
	"userBNumber": <SECOND NUMBER>
}`
8. Once you received an sms with the message, "Reply to this SMS to talk to <USER>" from your virtual number, you are ready to begin chatting
