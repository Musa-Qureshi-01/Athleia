import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from app.core.logging import logger


def _send_email_sync(recipient_email: str, subject: str, body_text: str, body_html: str) -> bool:
    if not settings.SMTP_HOST or settings.SMTP_HOST.strip() == "":
        logger.info(f"[Email Service] SMTP not configured. OTP for {recipient_email} logging locally.")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_ADDRESS}>"
        msg["To"] = recipient_email

        msg.attach(MIMEText(body_text, "plain"))
        msg.attach(MIMEText(body_html, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.ehlo()
            if settings.SMTP_PORT in (587, 25, 2525):
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAILS_FROM_ADDRESS, [recipient_email], msg.as_string())
        logger.info(f"[Email Service] Email successfully sent via SMTP to {recipient_email}")
        return True
    except Exception as e:
        logger.warning(f"[Email Service] SMTP dispatch error for {recipient_email}: {e}. Falling back to dev OTP response.")
        return False


async def send_verification_email(recipient_email: str, otp_code: str) -> bool:
    """
    Sends a 6-digit OTP verification code to any email address/domain.
    If real SMTP is configured, sends via SMTP.
    In dev mode or when SMTP is unconfigured, logs and returns True.
    """
    subject = "Athleia.ai — Verification Code"
    body_text = f"Your 6-digit verification code is: {otp_code}\n\nThis code expires in {settings.OTP_EXPIRE_MINUTES} minutes."
    body_html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #111;">
      <h2>Athleia.ai Account Verification</h2>
      <p>Welcome to Athleia! Use the code below to complete your verification:</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #6366f1; padding: 10px 0;">
        {otp_code}
      </div>
      <p style="color: #666; font-size: 12px;">This code expires in {settings.OTP_EXPIRE_MINUTES} minutes. If you did not request this, please ignore this email.</p>
    </div>
    """

    logger.info(f"[Email Service] Verification OTP for {recipient_email} generated: {otp_code}")
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _send_email_sync, recipient_email, subject, body_text, body_html)
    return True


async def send_password_reset_email(recipient_email: str, otp_code: str) -> bool:
    """
    Sends a password-reset 6-digit OTP to any email address.
    """
    subject = "Athleia.ai — Password Reset Code"
    body_text = f"Your password reset code is: {otp_code}\n\nThis code expires in {settings.OTP_EXPIRE_MINUTES} minutes."
    body_html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #111;">
      <h2>Athleia.ai Password Reset</h2>
      <p>We received a request to reset your password. Your reset code is:</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #ef4444; padding: 10px 0;">
        {otp_code}
      </div>
      <p style="color: #666; font-size: 12px;">This code expires in {settings.OTP_EXPIRE_MINUTES} minutes.</p>
    </div>
    """

    logger.info(f"[Email Service] Password Reset OTP for {recipient_email} generated: {otp_code}")
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, _send_email_sync, recipient_email, subject, body_text, body_html)
    return True

