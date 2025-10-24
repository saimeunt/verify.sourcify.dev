import { useUserSession } from "~/contexts/UserSessionContext";

export default function PrivateVerificationSwitch({
  privateVerification,
  onPrivateVerificationChange,
}: {
  privateVerification: boolean;
  onPrivateVerificationChange: (value: boolean) => void;
}) {
  const { session } = useUserSession();
  if (!session) {
    return null;
  }
  const { tenantName } = session.tenantNetworks[0] ?? { tenantName: "" };
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2">
        <span className="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5" />
        <input
          id="private-verification"
          name="private-verification"
          type="checkbox"
          checked={privateVerification}
          onChange={(event) =>
            onPrivateVerificationChange(event.target.checked)
          }
          aria-labelledby="private-verification-label"
          aria-describedby="private-verification-description"
          className="absolute inset-0 appearance-none focus:outline-hidden"
        />
      </div>
      <div className="text-sm">
        <label
          id="private-verification-label"
          className="font-medium text-gray-900"
        >
          {privateVerification
            ? "Private verification enabled"
            : "Public verification"}
        </label>{" "}
        <span id="private-verification-description" className="text-gray-500">
          (verifying on {tenantName})
        </span>
      </div>
    </div>
  );
}
