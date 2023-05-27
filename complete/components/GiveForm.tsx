import { useState } from "react";
import { FormControl, InputLabel, Input, FormHelperText } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import { lockUtxo } from '../lib/utils';
import { ContractActionProps } from "@/lib/types";

export default function GiveForm({ lucid, showToaster }: ContractActionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState(BigInt(0))

  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(BigInt(event.target.value))
  }
  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const txHash = await lockUtxo(lucid, amount)
      showToaster(`Transaction submitted: ${txHash}`)
      setAmount(BigInt(0))
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
    <>
      <FormControl>
        <InputLabel htmlFor="amount">Gift Amount</InputLabel>
        <Input
          id="amount"
          aria-describedby="amount-helper-text"
          type="number"
          inputProps={{ min: 0, step: 1000000 }}
          value={amount.toString()}
          onChange={handleAmount} />
        <FormHelperText id="amount-helper-text">Enter the amount in lovelace</FormHelperText>
      </FormControl>
      <LoadingButton
        variant="contained"
        disabled={amount != BigInt(0)}
        loading={isLoading}
        onClick={handleSubmit}
      >
        <span>Send Gift</span>
      </LoadingButton>
    </>
  )
}