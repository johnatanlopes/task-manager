require('dotenv/config');
const sgMail = require('@sendgrid/mail');
const sendgridApiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridApiKey);

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'johnatan.dev@gmail.com',
		subject: 'Thankls for joining in!',
		text: `Welcome to the app, ${name}. Let met know how you get along with the app.`,
	});
};

const sendCancelationEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: 'johnatan.dev@gmail.com',
		subject: 'Sorry to see you go!',
		text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
	});
};

module.exports = {
	sendWelcomeEmail,
	sendCancelationEmail,
};