const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

exports.handler = async function(event, context) {
    // Initial logging to debug incoming requests
    console.log("Received body:", event.body);

    // Safely parse the incoming request data
    let parsedData;
    try {
        parsedData = JSON.parse(event.body);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Bad request: JSON parsing failed" })
        };
    }

    const { domain, emailDetails } = parsedData;

    if (!emailDetails || !emailDetails.from || !emailDetails.to || !emailDetails.subject) {
        console.error("Missing required email details:", emailDetails);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Missing required email fields" })
        };
    }

    // Defaults if not provided in environment
    const domainUrl = domain || "sandbox77ca8f36e909449b8e0b398af213e4b2.mailgun.org";
    const mailgunClient = new Mailgun(formData).client({
        username: "api",
        key: process.env.SANDBOX_SENDING_KEY,
    });

    // Define the message options
    let messageOptions = {
        from: emailDetails.from,
        to: emailDetails.to,
        subject: emailDetails.subject,
        text: emailDetails.text,
        html: emailDetails.html,
    };

    // Send the email
    try {
        const response = await mailgunClient.messages.create(domainUrl, messageOptions);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email sent successfully", data: response }),
        };
    } catch (error) {
        console.error("Mailgun error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Mailgun service error", message: error.message }),
        };
    }
};
