"use strict";
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const uuid = require("uuid");

module.exports.createBooking = (event, context, callback) => {
  const bookingInfo = JSON.parse(event.body);

  const {
    booking_email,
    firstname,
    lastname,
    phone_number,
    dining_date,
    number_of_covers,
  } = bookingInfo;
  const booking_id = uuid.v1().toString();
  const date_added = Date.now().toString();
  const status = "Not arrived";

  var params = {
    TableName: process.env.BOOKINGS_DYNAMODB,
    Item: {
      booking_id: { S: booking_id },
      booking_email: { S: booking_email },
      firstname: { S: firstname },
      lastname: { S: lastname },
      phone_number: { S: phone_number },
      dining_date: { S: dining_date },
      date_added: { S: date_added },
      number_of_covers: { S: number_of_covers },
      status: { S: status },
    },
  };

  console.log("params to be saved: ", params);
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
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
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
