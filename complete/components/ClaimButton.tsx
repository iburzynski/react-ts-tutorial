import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { redeemUtxo } from '../lib/utils';
import { ContractActionProps } from "@/lib/types";

export default function ClaimButton({ lucid, showToaster }: ContractActionProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const txHash = await redeemUtxo(lucid)
      showToaster(`Transaction submitted: ${txHash}`)
    }
    catch (error) {
      const message = error instanceof Error ? error.message : JSON.stringify(error)
      console.error(message)
      showToaster(`Error: ${message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LoadingButton
      variant="contained"
      loading={isLoading}
      onClick={handleSubmit}
    >
      <span>Claim Gift</span>
    </LoadingButton>
  )
}