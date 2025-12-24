using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace EliteTravel.Core.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string toEmail, string subject, string body, string? language = "tr");
        Task<bool> SendContactNotificationAsync(string customerName, string customerEmail, string message, string language = "tr");
        Task<bool> SendContactReplyAsync(string toEmail, string customerName, string replyMessage, string language = "tr");
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string body, string? language = "tr")
        {
            try
            {
                var smtpHost = _configuration["EmailSettings:SmtpHost"];
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var smtpUsername = _configuration["EmailSettings:SmtpUsername"];
                var smtpPassword = _configuration["EmailSettings:SmtpPassword"];
                var fromEmail = _configuration["EmailSettings:FromEmail"];
                var fromName = _configuration["EmailSettings:FromName"];

                using var client = new SmtpClient(smtpHost, smtpPort)
                {
                    Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail, fromName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(toEmail);

                await client.SendMailAsync(mailMessage);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email sending failed: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendContactNotificationAsync(string customerName, string customerEmail, string message, string language = "tr")
        {
            var adminEmail = _configuration["EmailSettings:AdminEmail"];
            var subject = GetSubject("new_contact", language);
            var body = GetContactNotificationTemplate(customerName, customerEmail, message, language);

            return await SendEmailAsync(adminEmail, subject, body, language);
        }

        public async Task<bool> SendContactReplyAsync(string toEmail, string customerName, string replyMessage, string language = "tr")
        {
            var subject = GetSubject("contact_reply", language);
            var body = GetContactReplyTemplate(customerName, replyMessage, language);

            return await SendEmailAsync(toEmail, subject, body, language);
        }

        private string GetSubject(string type, string language)
        {
            return type switch
            {
                "new_contact" => language switch
                {
                    "en" => "New Contact Form Submission - Elite Travel",
                    "de" => "Neue Kontaktformular-Einreichung - Elite Travel",
                    "nl" => "Nieuwe contactformulier inzending - Elite Travel",
                    _ => "Yeni İletişim Formu Mesajı - Elite Travel"
                },
                "contact_reply" => language switch
                {
                    "en" => "Reply to Your Message - Elite Travel",
                    "de" => "Antwort auf Ihre Nachricht - Elite Travel",
                    "nl" => "Antwoord op uw bericht - Elite Travel",
                    _ => "Mesajınıza Yanıt - Elite Travel"
                },
                _ => "Elite Travel"
            };
        }

        private string GetContactNotificationTemplate(string customerName, string customerEmail, string message, string language)
        {
            var greeting = language switch
            {
                "en" => "New Contact Form Submission",
                "de" => "Neue Kontaktformular-Einreichung",
                "nl" => "Nieuwe contactformulier inzending",
                _ => "Yeni İletişim Formu Mesajı"
            };

            var customerLabel = language switch
            {
                "en" => "Customer",
                "de" => "Kunde",
                "nl" => "Klant",
                _ => "Müşteri"
            };

            var messageLabel = language switch
            {
                "en" => "Message",
                "de" => "Nachricht",
                "nl" => "Bericht",
                _ => "Mesaj"
            };

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
        .container {{ max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
        .header {{ background: linear-gradient(135deg, #163a58 0%, #1e4a6a 100%); color: white; padding: 40px 30px; text-align: center; }}
        .logo {{ font-size: 36px; font-weight: bold; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }}
        .logo-elite {{ color: white; }}
        .logo-travel {{ color: #dca725; }}
        .tagline {{ font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.8); margin-top: 5px; }}
        .content {{ padding: 40px 30px; background: #ffffff; }}
        .info-box {{ background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 20px; margin: 20px 0; border-left: 4px solid #dca725; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }}
        .info-label {{ color: #163a58; font-weight: bold; font-size: 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }}
        .info-value {{ color: #333; font-size: 15px; line-height: 1.6; }}
        .footer {{ text-align: center; padding: 30px; background: #f8f9fa; border-top: 3px solid #dca725; }}
        .footer-text {{ color: #666; font-size: 13px; margin: 5px 0; }}
        .footer-contact {{ color: #163a58; font-weight: 600; margin-top: 10px; }}
        .icon {{ display: inline-block; width: 20px; height: 20px; background: #dca725; border-radius: 50%; text-align: center; line-height: 20px; color: white; font-size: 12px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <div class='logo'>
                <span class='logo-elite'>Elite</span> <span class='logo-travel'>Travel</span>
            </div>
            <div class='tagline'>Premium Tourism Experience</div>
            <p style='font-size: 18px; margin-top: 20px; margin-bottom: 0;'>✨ {greeting}</p>
        </div>
        <div class='content'>
            <div class='info-box'>
                <div class='info-label'>
                    <span class='icon'>👤</span>
                    <strong>{customerLabel}:</strong>
                </div>
                <div class='info-value'>{customerName}</div>
            </div>
            <div class='info-box'>
                <div class='info-label'>
                    <span class='icon'>📧</span>
                    <strong>Email:</strong>
                </div>
                <div class='info-value'>{customerEmail}</div>
            </div>
            <div class='info-box'>
                <div class='info-label'>
                    <span class='icon'>💬</span>
                    <strong>{messageLabel}:</strong>
                </div>
                <div class='info-value' style='white-space: pre-wrap; background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;'>{message}</div>
            </div>
        </div>
        <div class='footer'>
            <div class='logo' style='font-size: 24px; margin-bottom: 10px;'>
                <span class='logo-elite' style='color: #163a58;'>Elite</span> <span class='logo-travel'>Travel</span>
            </div>
            <p class='footer-text'>Premium Tourism Experience</p>
            <p class='footer-contact'>📧 info@elitetravel.com | 📞 +31 6 21525757</p>
        </div>
    </div>
</body>
</html>";
        }

        private string GetContactReplyTemplate(string customerName, string replyMessage, string language)
        {
            var greeting = language switch
            {
                "en" => $"Dear {customerName}",
                "de" => $"Sehr geehrte/r {customerName}",
                "nl" => $"Beste {customerName}",
                _ => $"Sayın {customerName}"
            };

            var intro = language switch
            {
                "en" => "Thank you for contacting Elite Travel. We have received your message and here is our response:",
                "de" => "Vielen Dank, dass Sie Elite Travel kontaktiert haben. Wir haben Ihre Nachricht erhalten und hier ist unsere Antwort:",
                "nl" => "Bedankt voor het contact opnemen met Elite Travel. We hebben uw bericht ontvangen en hier is ons antwoord:",
                _ => "Elite Travel ile iletişime geçtiğiniz için teşekkür ederiz. Mesajınızı aldık ve yanıtımız aşağıdadır:"
            };

            var regards = language switch
            {
                "en" => "Best regards",
                "de" => "Mit freundlichen Grüßen",
                "nl" => "Met vriendelijke groet",
                _ => "Saygılarımızla"
            };

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }}
        .container {{ max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
        .header {{ background: linear-gradient(135deg, #163a58 0%, #1e4a6a 100%); color: white; padding: 40px 30px; text-align: center; }}
        .logo {{ font-size: 36px; font-weight: bold; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }}
        .logo-elite {{ color: white; }}
        .logo-travel {{ color: #dca725; }}
        .tagline {{ font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.8); margin-top: 5px; }}
        .content {{ padding: 40px 30px; background: #ffffff; }}
        .greeting {{ font-size: 20px; color: #163a58; margin-bottom: 20px; font-weight: 600; }}
        .intro-text {{ color: #666; margin-bottom: 30px; line-height: 1.8; }}
        .message-box {{ background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 25px; margin: 25px 0; border-left: 4px solid #dca725; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }}
        .message-content {{ color: #333; line-height: 1.8; white-space: pre-wrap; }}
        .signature {{ margin-top: 40px; padding-top: 25px; border-top: 2px solid #dca725; color: #163a58; }}
        .footer {{ text-align: center; padding: 30px; background: #f8f9fa; border-top: 3px solid #dca725; }}
        .footer-text {{ color: #666; font-size: 13px; margin: 5px 0; }}
        .footer-contact {{ color: #163a58; font-weight: 600; margin-top: 10px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <div class='logo'>
                <span class='logo-elite'>Elite</span> <span class='logo-travel'>Travel</span>
            </div>
            <div class='tagline'>Premium Tourism Experience</div>
        </div>
        <div class='content'>
            <p class='greeting'>{greeting},</p>
            <p class='intro-text'>{intro}</p>
            <div class='message-box'>
                <p class='message-content'>{replyMessage}</p>
            </div>
            <div class='signature'>
                <p><strong>{regards},</strong></p>
                <p style='color: #dca725; font-weight: 600; font-size: 18px; margin-top: 10px;'>
                    <span style='color: #163a58;'>Elite</span> Travel Team
                </p>
            </div>
        </div>
        <div class='footer'>
            <div class='logo' style='font-size: 24px; margin-bottom: 10px;'>
                <span class='logo-elite' style='color: #163a58;'>Elite</span> <span class='logo-travel'>Travel</span>
            </div>
            <p class='footer-text'>Premium Tourism Experience</p>
            <p class='footer-contact'>📧 info@elitetravel.com | 📞 +31 6 21525757</p>
            <p class='footer-text' style='margin-top: 15px; font-size: 11px;'>
                Bu email Elite Travel tarafından gönderilmiştir.
            </p>
        </div>
    </div>
</body>
</html>";
        }
    }
}
