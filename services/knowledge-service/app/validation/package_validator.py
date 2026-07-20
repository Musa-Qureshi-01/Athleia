"""Package & Document Validator for Knowledge Service.
"""

import re
from typing import List
from app.core.errors import ValidationError
from app.domain.models import OKFPackage


class PackageValidator:
    """Validates structural completeness and schema compliance of OKF Packages."""

    URN_REGEX = re.compile(r"^urn:[a-z0-9][a-z0-9-]{0,31}:[a-z0-9()+,\-.:=@;$_!*'%/?#]+$", re.IGNORECASE)
    SEMVER_REGEX = re.compile(r"^\d+\.\d+\.\d+$")

    @classmethod
    def validate(cls, package: OKFPackage) -> List[str]:
        """Validates package and returns list of error messages. Raises ValidationError if strict."""
        errors: List[str] = []

        # 1. Package URN Check
        if not package.package_urn or not package.package_urn.strip():
            errors.append("Package URN is required.")
        elif not cls.URN_REGEX.match(package.package_urn):
            errors.append(f"Invalid Package URN format '{package.package_urn}'. Must match URN syntax (e.g. 'urn:athleia:pkg:cooling-water').")

        # 2. Package Title & Version
        if not package.title or not package.title.strip():
            errors.append("Package title is required.")

        if not package.version or not package.version.strip():
            errors.append("Package version is required.")
        elif not cls.SEMVER_REGEX.match(package.version):
            errors.append(f"Invalid SemVer version format '{package.version}'. Must be 'MAJOR.MINOR.PATCH' (e.g. '1.0.0').")

        # 3. Domain Metadata
        if not package.domain or not package.domain.strip():
            errors.append("Package domain is required.")

        # 4. Document Validations
        if not package.documents:
            errors.append("Package must contain at least one document.")
        else:
            doc_urns = set()
            for idx, doc in enumerate(package.documents):
                if not doc.document_urn:
                    errors.append(f"Document #{idx + 1} is missing document_urn.")
                elif doc.document_urn in doc_urns:
                    errors.append(f"Duplicate document_urn '{doc.document_urn}' within package.")
                else:
                    doc_urns.add(doc.document_urn)

                if not doc.title or not doc.title.strip():
                    errors.append(f"Document '{doc.document_urn or idx}' is missing title.")

                if not doc.content or not doc.content.strip():
                    errors.append(f"Document '{doc.document_urn or idx}' has empty content.")

        if errors:
            raise ValidationError(f"Package validation failed with {len(errors)} error(s).", errors=errors)

        return errors


package_validator = PackageValidator()
