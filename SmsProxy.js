"use strict";

const Nexmo = require("nexmo");

class SmsProxy {
  constructor() {
    this.nexmo = new Nexmo(
      {
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET,
      },
      {
        debug: true,
      }
    );
  }

  createChat(userANumber, userBNumber) {
    this.chat = {
      userA: userANumber,
      userB: userBNumber,
    };

    this.sendSMS();
  }

  sendSMS() {
    /*  
            Send a message from userA to the virtual number
        */
    this.nexmo.message.sendSms(
      this.chat.userA,
      process.env.VIRTUAL_NUMBER,
      "Reply to this SMS to talk to UserA"
    );

    /*  
            Send a message from userB to the virtual number
        */
    this.nexmo.message.sendSms(
      this.chat.userB,
      process.env.VIRTUAL_NUMBER,
      "Reply to this SMS to talk to UserB"
    );
  }

  getDestinationRealNumber(from) {
    let destinationRealNumber = null;

    // console.log("chat userA", this.chat.userA);
    // console.log(typeof this.chat.userA);
    // console.log("chat userB", this.chat.userB);
    // console.log("fromUserA", from);
    // console.log(typeof from);
    // Use `from` numbers to work out who is sending to whom
    const fromUserA = from === this.chat.userA;
    const fromUserB = from === this.chat.userB;
    console.log(fromUserA);
    if (fromUserA || fromUserB) {
      destinationRealNumber = fromUserA ? this.chat.userB : this.chat.userA;
    }
    return destinationRealNumber;
  }

  proxySms(from, text) {
    // Determine which real number to send the SMS to
    const destinationRealNumber = this.getDestinationRealNumber(from);

    if (destinationRealNumber === null) {
      console.log(`No chat found for this number`);
      return;
    }

    // Send the SMS from the virtual number to the real number
    this.nexmo.message.sendSms(
      process.env.VIRTUAL_NUMBER,
      destinationRealNumber,
      text
    );
  }
}

module.exports = SmsProxy;
