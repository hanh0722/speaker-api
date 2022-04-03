import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env['SENDGRID_API']!);


export const sendEmail = async (configMail: any) => {
    const message: any  = {
        to: configMail.to,
        from: process.env['ADMIN_EMAIL'] || configMail.from,
        subject: configMail.subject,
        text: configMail.text,
        html: configMail.html,
    }
    try{
        const result = await sgMail.send(message);
        return result;
    }catch(err) {
        console.log(err);
    }
}