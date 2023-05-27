import { SpendingValidator, Address, Data, Lovelace, TxHash, Lucid } from "lucid-cardano";

const alwaysSucceedScript: SpendingValidator = {
  type: "PlutusV2",
  script: "49480100002221200101",
};

const Datum = () => Data.void();
const Redeemer = () => Data.void();

function getScriptAddress(lucid: Lucid): Address {
  return lucid.utils.validatorToAddress(
    alwaysSucceedScript,
  );
}
export async function lockUtxo(
  lucid: Lucid,
  lovelace: Lovelace,
): Promise<TxHash> {
  const alwaysSucceedAddress = getScriptAddress(lucid)
  const tx = await lucid
    .newTx()
    .payToContract(alwaysSucceedAddress, { inline: Datum() }, { lovelace })
    .payToContract(alwaysSucceedAddress, {
      asHash: Datum(),
      scriptRef: alwaysSucceedScript, // adding plutusV2 script to output
    }, {})
    .complete();

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

  return txHash;
}

export async function redeemUtxo(lucid: Lucid): Promise<TxHash> {
  const alwaysSucceedAddress = getScriptAddress(lucid)
  const referenceScriptUtxo = (await lucid.utxosAt(alwaysSucceedAddress)).find(
    (utxo) => utxo.scriptRef?.script === alwaysSucceedScript.script
  );
  if (!referenceScriptUtxo) throw new Error("Reference script not found");

  const utxo = (await lucid.utxosAt(alwaysSucceedAddress)).find((utxo) =>
    utxo.datum === Datum() && !utxo.scriptRef
  );
  if (!utxo) throw new Error("Spending script utxo not found");

  const tx = await lucid
    .newTx()
    .readFrom([referenceScriptUtxo]) // spending utxo by reading plutusV2 from reference utxo
    .collectFrom([utxo], Redeemer())
    .complete();

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

  return txHash;
}