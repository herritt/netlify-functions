const formData = require("form-data");
const Mailgun = require("mailgun.js");
require("dotenv").config();

exports.handler = async function (event, context) {
	// Parse the incoming request data
	const { domain, emailDetails } = JSON.parse(event.body);
	let mailgunClient, domainUrl;

	domainUrl = "sandbox77ca8f36e909449b8e0b398af213e4b2.mailgun.org";
	mailgunClient = new Mailgun(formData).client({
		username: "api",
		key: process.env.SANDBOX_SENDING_KEY,
	});

	// Define the message options based on the domain
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
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.message }),
		};
	}
};
