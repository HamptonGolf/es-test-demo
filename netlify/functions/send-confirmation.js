exports.handler = async function (event) {
    try {
        if (event.httpMethod !== 'POST') {
            return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
        }

        let data;
        try {
            data = JSON.parse(event.body);
        } catch (err) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
        }

        const { name, email } = data;

        if (!name || !email) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing name or email' }) };
        }

        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD
            }
        });

        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F4; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF;" cellpadding="0" cellspacing="0">
                            
                        <!-- Header -->
                        <tr>
                            <td style="background-color: #EFEDE8; padding: 40px; text-align: center;">
                                <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                                    <tr>
                                        <td style="padding-right: 12px; vertical-align: middle;">
                                            <div style="position: relative; width: 34px; height: 34px;">
                                                <div style="position: absolute; top: 0; left: 0; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #8E7FA9; box-sizing: border-box;"></div>
                                                <div style="position: absolute; top: 5px; left: 12px; width: 24px; height: 24px; border-radius: 50%; background-color: #8E7FA9;"></div>
                                            </div>
                                        </td>
                                        <td style="vertical-align: middle;">
                                            <div style="font-size: 24px; letter-spacing: 4px; color: #222222; font-weight: 300; line-height: 1.2;">ECLIPSE</div>
                                            <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 13px; letter-spacing: 3px; color: #B39F7C; font-weight: bold; line-height: 1.2; margin-top: 1px;">STUDIO</div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding: 48px 40px;">
                                    <h1 style="font-size: 26px; font-weight: 400; color: #222222; margin: 0 0 20px; letter-spacing: -0.5px;">Thank you, ${name}.</h1>
                                    <p style="font-size: 16px; line-height: 1.6; color: #222222; margin: 0 0 20px;">
                                        We've received your message and appreciate you reaching out to Eclipse Studio. Our team will review your inquiry and get back to you within 1–2 business days.
                                    </p>
                                    <p style="font-size: 16px; line-height: 1.6; color: #222222; margin: 0 0 32px;">
                                        In the meantime, feel free to explore our recent work or learn more about how we help brands find their eclipse moment.
                                    </p>
                                <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                                    <tr>
                                        <td style="background-color: #8E7FA9; text-align: center;">
                                            <a href="https://eclipsestudio.biz/portfolio" style="display: inline-block; padding: 16px 36px; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #FFFFFF; text-decoration: none; font-weight: bold;">View Our Work</a>
                                        </td>
                                    </tr>
                                </table>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #EFEDE8; padding: 28px 40px; text-align: center;">
                                    <p style="font-size: 12px; letter-spacing: 1px; color: #7A6847; margin: 0;">
                                        Eclipse Studio &middot; Jacksonville, FL
                                    </p>
                                    <p style="font-size: 11px; color: #726191; margin: 8px 0 0;">
                                        marketing@eclipsestudio.biz
                                    </p>
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        await transporter.sendMail({
            from: '"Eclipse Studio" <marketing@eclipsestudio.biz>',
            to: email,
            subject: 'Thanks for reaching out to Eclipse Studio',
            text: `Thank you, ${name}.\n\nWe've received your message and appreciate you reaching out to Eclipse Studio. Our team will review your inquiry and get back to you within 1–2 business days.\n\nView our work: https://eclipsestudio.biz/portfolio.html\n\nEclipse Studio | Jacksonville, FL\nmarketing@eclipsestudio.biz`,
            html: emailHtml
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: err.message || 'Unknown error',
                stack: err.stack || null
            })
        };
    }
};
