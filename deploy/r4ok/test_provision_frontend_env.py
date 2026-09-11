import importlib.util
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("provision_frontend_env.py")
SPEC = importlib.util.spec_from_file_location("provision_frontend_env", MODULE_PATH)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class ProvisionFrontendEnvTests(unittest.TestCase):
    def test_nested_environment_and_private_keys_stay_out_of_build_context(self) -> None:
        repository_root = MODULE_PATH.parents[2]
        patterns = (repository_root / ".dockerignore").read_text(
            encoding="utf-8"
        ).splitlines()
        for pattern in (
            "**/.env", "**/.env.*", "**/*.env", "**/*.env.*",
            "**/*.key", "**/*.pem",
        ):
            self.assertIn(pattern, patterns)

    def test_provisions_matching_service_token_and_test_publishable_key(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            payment_env = root / "payment.env"
            output = root / "professional.env"
            payment_env.write_text(
                "SERVICE_TOKEN=service-token\n"
                "STRIPE_PUBLISHABLE_KEY=pk_test_example\n",
                encoding="utf-8",
            )

            MODULE.provision(payment_env, output)

            contents = output.read_text(encoding="utf-8")
            self.assertIn("PAYMENT_SERVICE_TOKEN=service-token", contents)
            self.assertIn(
                "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_example", contents
            )
            self.assertIn("NEXT_PUBLIC_TFS825_PAYMENT_MVP=true", contents)
            self.assertIn(
                "NEXT_PUBLIC_API_URL=https://timeflow-api-dev.r4ok.com", contents
            )
            self.assertIn(
                "TFS_BACKEND_URL=https://timeflow-api-dev.r4ok.com", contents
            )
            self.assertNotIn("dev.backend.timeflowsystem.com", contents)

    def test_rejects_missing_publishable_key(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            payment_env = root / "payment.env"
            payment_env.write_text("SERVICE_TOKEN=service-token\n", encoding="utf-8")

            with self.assertRaisesRegex(RuntimeError, "STRIPE_PUBLISHABLE_KEY"):
                MODULE.provision(payment_env, root / "professional.env")

    def test_rejects_live_publishable_key(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            payment_env = root / "payment.env"
            payment_env.write_text(
                "SERVICE_TOKEN=service-token\n"
                "STRIPE_PUBLISHABLE_KEY=pk_live_not_allowed\n",
                encoding="utf-8",
            )

            with self.assertRaisesRegex(RuntimeError, "test-mode"):
                MODULE.provision(payment_env, root / "professional.env")


if __name__ == "__main__":
    unittest.main()
