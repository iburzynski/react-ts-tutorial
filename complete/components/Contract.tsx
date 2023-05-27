import { useCardano } from "use-cardano";
import GiveForm from "./GiveForm";
import ClaimButton from "./ClaimButton";

export default function Contract() {
  const { lucid, walletProvider, showToaster } = useCardano()

  if (!lucid || !walletProvider) {
    return <p>Connect a wallet to send and claim gifts</p>
  }

  return (
    <>
      <GiveForm lucid={lucid} showToaster={showToaster} />
      <ClaimButton lucid={lucid} showToaster={showToaster} />
    </>
  )

}