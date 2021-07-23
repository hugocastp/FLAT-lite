
    const { Router } = require('express');
    const router = Router();
    const nodemailer = require('nodemailer');
    
    router.post('/signup', async (req, res) => {
        const { fullname, username, password} = req.body;

        contentHTML = `
            <h2>F L A T</h2>
            <h1>Info de usuario</h1>
            <ul>
                <li>Nombre completo: ${fullname}</li>
                <li>Usuario: ${username}</li>
                <li>Contraseña: ${password}</li>
            </ul>
            <p>Gracias por registrarte. </p>
        `;
    
        let transporter = nodemailer.createTransport({
            host: 'mail.fazttech.net',
            port: 587,
            secure: false,
            auth: {
                user: 'testtwo@fazttech.net',
                pass: 'testtwocontraseña'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    
        let info = await transporter.sendMail({
            from: '"FaztTech Server" <testtwo@fazttech.xyz>', // sender address,
            to: 'fazttech@gmail.com',
            subject: 'Website Contact Form',
            // text: 'Hello World'
            html: contentHTML
        })
    
        console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    
        res.redirect('/success.html');
    });
    
    module.exports = router;