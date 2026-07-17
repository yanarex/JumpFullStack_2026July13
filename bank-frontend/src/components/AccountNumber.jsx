import { useState } from "react";

export default function AccountNumber({
  accountId,
}) {
  const [visible, setVisible] =
    useState(false);

  const accountIdText = String(
    accountId ?? ""
  );

  const maskedAccountId =
    accountIdText.length > 2
      ? `${"•".repeat(
          accountIdText.length - 2
        )}${accountIdText.slice(-2)}`
      : "••••";

  return (
    <div className="account-number-row">
      <span>
        Account Number:{" "}
        <strong>
          {visible
            ? accountIdText
            : maskedAccountId}
        </strong>
      </span>

      <button
        type="button"
        className="visibility-button"
        onClick={() =>
          setVisible((current) => !current)
        }
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}