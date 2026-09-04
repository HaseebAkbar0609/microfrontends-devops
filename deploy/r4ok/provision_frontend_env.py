"""Provision Professional DEV settings from the protected payment env."""

import argparse
import os
from pathlib import Path


def read_setting(path: Path, name: str) -> str:
    prefix = f"{name}="
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith(prefix):
            value = line.removeprefix(prefix).strip()
            if value:
                return value
    raise RuntimeError(f"{name} is missing from {path}")


def render_environment(service_token: str) -> str:
    return "\n".join(
        [
            "NEXT_PUBLIC_API_URL=https://dev.backend.timeflowsystem.com",
            "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=",
            "NEXT_PUBLIC_TFS825_PAYMENT_MVP=true",
            "TFS_BACKEND_URL=https://dev.backend.timeflowsystem.com",
            "PAYMENT_SERVICE_URL=http://timeflow-payment-api:8200",
            f"PAYMENT_SERVICE_TOKEN={service_token}",
            "PORT=3000",
            "",
        ]
    )


def provision(payment_env: Path, output: Path) -> None:
    service_token = read_setting(payment_env, "SERVICE_TOKEN")
    output.parent.mkdir(parents=True, exist_ok=True)
    descriptor = os.open(output, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(descriptor, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(render_environment(service_token))
    print(f"Created protected frontend environment file: {output}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--payment-env",
        type=Path,
        default=Path("/etc/timeflow-dev/payment-service.env"),
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("/etc/timeflow-dev/professional.env"),
    )
    args = parser.parse_args()
    provision(args.payment_env, args.output)
