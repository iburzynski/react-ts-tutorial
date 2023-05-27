import { Lucid } from "lucid-cardano";

export type ContractActionProps = {
  lucid: Lucid,
  showToaster: (text?: string | undefined, info?: string | undefined) => void
}