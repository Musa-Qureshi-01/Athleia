import httpx
from app.core.config import settings
from app.core.logging import logger


async def send_verification_email(recipient_email: str, otp_code: str) -> bool:
    """
    Sends a 6-digit OTP verification code.

    In production this would call an SMTP/email-gateway adapter.
    OTP codes are auth-internal — they must NEVER be published to the
    notification panel (which is visible to admins and users).
    The code is returned directly in the API response (dev_otp) so the
    frontend can display it to the registering user.
    """
    logger.info(
        f"[Email Service] Verification OTP for {recipient_email} dispatched "
        f"(dev mode: OTP returned in API response)"
    )
    # TODO(production): call SMTP / SendGrid / SES here — do NOT log otp_code in prod.
    return True


async def send_password_reset_email(recipient_email: str, otp_code: str) -> bool:
    """
    Sends a password-reset OTP.
    Same rule: never publish to the notification panel.
    """
    logger.info(
        f"[Email Service] Password-reset OTP for {recipient_email} dispatched "
        f"(dev mode: OTP returned in API response)"
    )
    # TODO(production): call SMTP / SendGrid / SES here
    return True
