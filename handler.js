"use strict";
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

module.exports.createBooking = (event, context, callback) => {
  const bookingInfo = JSON.parse(event.body);

  const { booking_id, booking_email } = bookingInfo;

  var params = {
    TableName: "bookings",
    Item: {
      booking_id: { S: booking_id },
      booking_email: { S: booking_email },
    },
  };

  console.log("params: ", params);
  // Call DynamoDB to add the item to the table
  ddb.putItem(params, function (err, data) {
    console.log("response: ", err, data);
    if (err) {
      console.log("Error", err);
      let response = {
        statusCode: "500",
        body: "fail",
        headers: {
          "Content-Type": "application/json",
        },
      };

      context.fail(response);
    } else {
      console.log("Success", data);
      let response = {
        statusCode: "200",
        body: "success",
        headers: {
          "Content-Type": "application/json",
        },
      };

      context.succeed(response);
    }
  });
};
