# **React & TypeScript Tutorial for Cardano Developers**
This repository provides a basic introduction to using React and TypeScript to build user interfaces for Cardano smart contracts, by way of the Next.js framework and Lucid.

First I'll cover some fundamental React concepts, then provide a guided walkthrough to create a Next.js project from scratch. We'll then integrate the `lucid-cardano` and `use-cardano` libraries and Material UI components to build a simple frontend interface for the "always succeeds" smart contract.

# **React Concepts**

### **TSX**
- Short for TypeScript XML
- Syntax extension used in React TypeScript applications
- Allows use of HTML-like syntax within TypeScript to write HTML tags, attributes, and nested elements
- Used for defining the layout of React components
- Makes it easier to write and understand the structure of user interfaces

### **Components**
- Basic building blocks of a reactive web application
- Functions that return a TSX element

### **Props**
- Input parameter to a component
- Allow reuse of components with different data
- Defined as a TypeScript object
- Read-only data

### **Hooks**
- Functions to manage and reuse stateful logic in components
- Commonly used hooks: 
    - `useState`: manage state
    - `useEffect`: perform side effects (data fetching, subscription, manual manipulation of DOM)
    - `useContext`: share data across components without passing props, via a surrounding context
    - `useMemo`: cache expensive computations
    - `useCallback`: memoize a callback function

### **State**
- Allows components to manage and update internal data
- State data is passed to child components via props
- When updated, React automatically re-renders the component and any children that depend on the state
- Initialized by calling `useState` hook with initial value
- Returns a two-element array containing:
    1. A reference to the state's value in memory (read-only variable, never modified directly)
    2. A "setter" function to modify the state value

### **Context**
- Allows sharing data between components without passing props through the component tree
- Prevents undesirable "prop-drilling", where props are passed through intermediate components that don't need them, just to make their data available to children further down the tree
- A **Provider** component defines and exposes shared data, and wraps any components that need access ("consumers")
- The `useContext` hook allows consumer components to access the context
- Not a state management tool: use judiciously for data that must be shared across a significant portion of the component tree and changes infrequently
- Overuse may cause reduced: 
  - **performance:** updating context can trigger unnecessary re-renders of all consuming components
  - **reusability:** components become tightly coupled with the context they implicitly depend on
  - **readability:** introduces indirection in data flow, as source of data may not be apparent when looking at a consuming component
  - **scalability:** context increases complexity and makes code harder to scale and debug


# **Next.js Demo**

## **Part I: Setup**
1. ### **Clone repository and enter directory**
  
    ```sh
    git clone https://github.com/iburzynski/react-ts-tutorial
    ```

    ```sh
    cd react-ts-tutorial
    ```

2. ### **Load Nix environment or install dependencies**
  - If you have Nix installed with flakes enabled, you can enter a development environment with `node` and `pnpm` installed. This way you don't need to install any additional dependencies:

      ```sh
      nix develop
      ```
  
  - Once the `nix develop` shell loads you can load your code editor from the terminal and proceed with the next steps of the demo. For instance, to load the project directory in VS Code:

      ```sh
      code .
      ```

  - Otherwise you must install the required dependencies on your system manually. The remaining instructions assume the use of `pnpm` as package manager; you can alternatively use `npm` or `yarn`, but instructions for these aren't provided. The easiest way to follow is to [install `pnpm`](https://pnpm.io/installation).

    **Using `npm`:** \
    If you already have `node` installed on your machine, you can install `pnpm` using `npm`:
      
      ```sh
      npm install -g pnpm
      ```

3. ### **Initialize a new Next.js project, using `pnpm` as package manager**

    ```sh
    npx create-next-app@latest demo --use-pnpm
    ```

4. ### **Answer the following prompts**

  - **Need to install the following packages:**
    create-next-app@13.4.4
    Ok to proceed? (y) 
    - y

  - **Would you like to use TypeScript with this project?**
    - Yes
  - **Would you like to use ESLint with this project?**
    - Yes
  - **Would you like to use Tailwind CSS with this project?**
    - No
  - **Would you like to use \`src/\` directory with this project?**
    - No
  - **Use App Router (recommended)?**
    - No
  - **Would you like to customize the default import alias?**
    - No

5. ### **Prepare Webpack Config in `next.config.js`**
  - Open `react-ts-tutorial/demo/next.config.js` and replace `const nextConfig = {}` with the following:

    ```js
    const nextConfig = {
      webpack: (config) => {
        config.experiments = {
        asyncWebAssembly: true,
        topLevelAwait: true,
        layers: true,
        }

        return config
      }
    }
    ```

6. ### **Install project dependencies**
  - Enter the `react-ts-tutorial/demo` directory

    ```sh
    cd demo
    ```
  
  - Install the following project dependencies
    
    ```sh
      pnpm add lucid-cardano use-cardano \
      @mui/material @mui/lab @emotion/react @emotion/styled @fontsource/roboto
    ```

  - You will see the following warning indicating that `use-cardano` is incompatible with the latest version of `lucid-cardano`:

    ```sh
     WARN  Issues with peer dependencies found
    .
    └─┬ use-cardano 1.1.0
      └── ✕ unmet peer lucid-cardano@0.8.3: found 0.10.5
    ```

  - To resolve this error, add the following to `react-ts-tutorial/demo/package.json` underneath `"dependencies"`:

    ```json
    ,
      "pnpm": {
        "peerDependencyRules": {
          "allowedVersions": {
            "lucid-cardano": "^0.10.5"
          }
        }
      }
    ```

7. ### **Set Blockfrost project ID**
  - Create a file called `.env.local` in the `react-ts-tutorial/demo` directory
  - Add the following:

    ```
    NEXT_PUBLIC_PROJECT_ID=yourBlockfrostProjectId
    ```

  - Replace `yourBlockfrostProjectId` with your project ID from Blockfrost

8. ### **Launch dev server**
  - From the `react-ts-tutorial/demo` directory in your terminal, enter the following command:

    ```sh
    pnpm dev
    ```

## **Part II: Build the App**
1. ### **Configure styles**
  - Open `react-ts-tutorial/demo/styles/globals.css`
  - Copy all of the code inside the `@media (prefers-color-scheme: dark)` media query beginning with `:root` and ending with the inner curly brace:

    ```css
    :root {
      --foreground-rgb: 255, 255, 255;
      --background-start-rgb: 0, 0, 0;
      --background-end-rgb: 0, 0, 0;

      --primary-glow: radial-gradient(rgba(1, 65, 255, 0.4), rgba(1, 65, 255, 0));
      --secondary-glow: linear-gradient(
        to bottom right,
        rgba(1, 65, 255, 0),
        rgba(1, 65, 255, 0),
        rgba(1, 65, 255, 0.3)
      );

      --tile-start-rgb: 2, 13, 46;
      --tile-end-rgb: 2, 5, 19;
      --tile-border: conic-gradient(
        #ffffff80,
        #ffffff40,
        #ffffff30,
        #ffffff20,
        #ffffff10,
        #ffffff10,
        #ffffff80
      );

      --callout-rgb: 20, 20, 20;
      --callout-border-rgb: 108, 108, 108;
      --card-rgb: 100, 100, 100;
      --card-border-rgb: 200, 200, 200;
    }
    ```

  - Paste this code to overwrite the corresponding `:root` selector code at the top of the file.

  - Copy the code from the [`use-cardano` stylesheet](https://github.com/use-cardano/use-cardano/blob/main/styles/use-cardano.css) and paste it at the bottom of the file
  - Find the `.cardano-wallet-selector__button` selector and change its `background-color` to `#90caf9`
  - Open `react-ts-tutorial/demo/styles/Home.module.css`
  - In the `.main` selector, change the value of `justify-content` from `space-between` to `space-evenly`.
  - Find the `.center` selector and replace it with the following:

    ```css
    .center {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      position: relative;
      padding: 4rem 0;
      flex-direction: column;
      min-height: 500px;
    }
    ```

2. ### **Add Material UI Theme and `use-cardano` contexts to `_app.tsx`**
  - Open `react-ts-tutorial/demo/pages/_app.tsx`
  - Add the following import statements to the top of the file:

    ```tsx
    import { useMemo } from 'react'
    import { ThemeProvider, createTheme } from '@mui/material'
    import CssBaseline from '@mui/material/CssBaseline'
    import { CardanoProvider, UseCardanoOptions } from 'use-cardano'
    ```
  
  - Below the imports, define a `projectId` variable to reference the Blockfrost project ID environment variable you defined in `.env.local`:

    ```tsx
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
    ```

  - Now define an `options` variable to configure `use-cardano` to use our desired settings:

    ```tsx
    const options: UseCardanoOptions = {
      allowedNetworks: ["Testnet"],
      testnetNetwork: "Preview",
      node: {
        provider: "blockfrost",
        projectId
      }
    }
    ```

    **Note:** change `"Preview"` to `"Preprod"` if your Blockfrost project is using the Preprod network instead of Preview.

  - Above the `return` statement in the `App` function, define a theme for our Material UI Components:

    ```tsx
    const darkTheme = useMemo(
      () =>
        createTheme({
          palette: {
            mode: 'dark',
          },
          typography: {
            fontSize: 18
          },
        }),
      []
    )
    ```

  - In the `return` statement, wrap `<Component {...pageProps} />` in a Material UI `<ThemeProvider>` and `use-cardano`'s `<CardanoProvider>` contexts:

    ```tsx
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <CardanoProvider options={options}>
          <Component {...pageProps} />
        </CardanoProvider >
      </ThemeProvider>
    )
    ```

3. ### **Create components directory and files**
  - Create `components` directory in `react-ts-tutorial/demo`
  - Create the following files:
    - `ClaimButton.tsx`
    - `Contract.tsx`
    - `GiveForm.tsx`
  - Open `react-ts-tutorial/demo/components/Contract.tsx` add add the following code:

    ```tsx
    export default function Contract() {
      return (
        <>
          <p>Contract Component</p>
        </>
      )
    }
    ```

4. ### **Edit `index.tsx` layout**
  - Open `react-ts-tutorial/demo/pages/index.tsx`
  - Add the following import statements to the top of the file:

    ```tsx
    import { CardanoToaster, CardanoWalletSelector } from 'use-cardano'
    import Contract from '@/components/Contract'
    ```

  - Replace the text between the `<title>` and `</title>` tags with `Gift Contract`
  - Replace the following code:

    ```tsx
    <p>
      Get started by editing&nbsp;
      <code className={styles.code}>pages/index.tsx</code>
    </p>
    ```

    with:

    ```tsx
    <h1>🎁 Gift Contract</h1>
    ```
  
  - Replace the following code:

    ```tsx
    <a
      href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      By{' '}
      <Image
        src="/vercel.svg"
        alt="Vercel Logo"
        className={styles.vercelLogo}
        width={100}
        height={24}
        priority
      />
    </a>
    ```

    with:

    ```tsx
    <CardanoWalletSelector/>
    <CardanoToaster/>
    ```

  - Replace the following code:

    ```tsx
    <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
    />
    ```

    with:

    ```tsx
    <Contract/>
    ```
  
  - Remove all code from `<div className={styles.grid}>` to the closing `</div>` tag before the closing `</main>` tag.

5. ### **Create `lib` directory and files**
  - Create a new directory `lib` in `react-ts-tutorial/demo`
  - Create a `types.ts` file in the `lib` directory
  - Open `react-ts-tutorial/demo/lib/types.ts` and add the following code to define a custom type for the props we'll pass to our `ClaimButton` and `GiveForm` components:

    ```tsx
    import { Lucid } from "lucid-cardano";

    export type ContractActionProps = {
      lucid: Lucid,
      showToaster: (text?: string | undefined, info?: string | undefined) => void
    }
    ```

  - Copy the file from `react-ts-tutorial/complete/lib/utils.ts` to the `lib` directory.

6. ### **Complete `ClaimButton` component**
  - Open `react-ts-tutorial/demo/components/ClaimButton.tsx`
  - Add the following import statements:

    ```tsx
    import { useState } from 'react';
    import { LoadingButton } from '@mui/lab';
    import { redeemUtxo } from '../lib/utils';
    import { ContractActionProps } from "@/lib/types";
    ```
    
  - Write the skeleton for a component that returns a `LoadingButton` component:

    ```tsx
    export default function ClaimButton() {

      return (
        <LoadingButton
          variant="contained"
        >
          <span>Claim Gift</span>
        </LoadingButton>
      )
    }
    ```

  - Add a destructured `ContractActionProps` object with type annotation to the component's parameters:

    ```tsx
    export default function ClaimButton({ lucid, showToaster }: ContractActionProps) {
    ```

  - In the function body, call the `useState` hook with an initial value of `false` and store the result in a destructured tuple `[isLoading, setIsLoading]`:

    ```tsx
    const [isLoading, setIsLoading] = useState(false)
    ```
    
  - Define an asynchronous click handler function called `handleSubmit`, which uses `setIsLoading` to change the `isLoading` state variable to `true`:

    ```tsx
    const handleSubmit = async () => {
      setIsLoading(true)
    }
    ```

  - Below `setIsLoading(true)`, create `try`/`catch`/`finally` blocks, and use `setIsLoading` in the `finally` block to set `isLoading` back to `false`:

    ```tsx
    try {

    }
    catch (error) {

    } finally {
      setIsLoading(false)
    }
    ```

  - In the `try` block: 
    - Call the `redeemUtxo` function from `utils.ts`, passing the `lucid` variable received in the component's props. Save its value as a variable `txHash`
    - Call the `showToaster` function received in the component's props to display a success message in a temporary popup.

      ```tsx
      try {
        const txHash = await redeemUtxo(lucid)
        showToaster(`Transaction submitted: ${txHash}`)
      }
      ```

    -Note that `redeemUtxo` is an asynchronous function (it returns a promise), so we need to prefix it with `await` to wait for its result before proceeding.
  
  - In the `catch` block, add the following code:

    ```tsx
    const message = error instanceof Error ? error.message : JSON.stringify(error)
    console.error(message)
    showToaster(`Error: ${message}`)
    ```

    We use a ternary expression (`<if expr.> ? <then expr.> : <else expr.>`) to check if the `error` variable has the type `Error`, and if so we set the value of our `message` variable to the `.message` attribute on the error object. Otherwise we stringify the error.

    Then we log the error and call `showToaster` to display it in a popup.

  - Now add `loading` and `onClick` props to the `<LoadingButton>` component in the `return` statement, setting their values to the `isLoading` state variable and `handleSubmit` function, respectively:

    ```tsx
    <LoadingButton
      variant="contained"
      loading={isLoading}
      onClick={handleSubmit}
    >
    ```
    
7. ### **Complete `GiveForm` Component**
- Open `react-ts-tutorial/demo/components/GiveForm.tsx`
- Add the following import statements and component skeleton:

  ```tsx
  import { useState } from "react";
  import { FormControl, InputLabel, Input, FormHelperText } from '@mui/material'
  import { LoadingButton } from '@mui/lab';
  import { lockUtxo } from '../lib/utils';
  import { ContractActionProps } from "@/lib/types";
  
  export default function GiveForm({ lucid, showToaster }: ContractActionProps) {
    const [isLoading, setIsLoading] = useState(false)

    return (
      <>
      </>
    )
  }
  ```

- Above the `return` statement, call the `useState` hook again with an initial value of `BigInt(0)` to produce a state variable and setter for the gift amount:

  ```tsx
  const [amount, setAmount] = useState(BigInt(0))
  ```

- Define a handler function called `handleAmount` that will respond to changes in the amount field of our form:

  ```tsx
  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(BigInt(event.target.value))
  }
  ```

  The function takes in a `ChangeEvent` associated with an `HTMLInputElement`, retrieves the input element's value, converts it to a `bigint` value and uses `setAmount` to replace the value of the `amount` state variable.

- Copy the `handleSubmit` function from `react-ts-tutorial/demo/components/ClaimButton.tsx` and paste it below the `handleAmount` function.
- Change the call to `redeemUtxo` in the `try` block to `lockUtxo`, and add `amount` as an argument:

  ```tsx
  const txHash = await lockUtxo(lucid, amount)
  ```

- Add `setAmount(BigInt(0))` below the call to `showToaster` to reset the `amount` variable after the transaction is submitted

- Add the following TSX elements between the `<>` and `</>` elements in the `return` statement:

  ```tsx
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
  ```

8. ### **Complete `Contract` component**
  - Open `react-ts-tutorial/demo/components/Contract.tsx`
  - Inside the `Contract` function, add the following call to the `useCardano` hook:

    ```tsx
    const { lucid, walletProvider, showToaster } = useCardano()
    ``` 

    `useCardano` is a custom hook that uses React Context, allowing us to share many pieces of data throughout our application.

    For this simple app we only require three pieces of data: the `lucid` instance, the `walletProvider` and the `showToaster` function.

  - If there is no `lucid` instance or connected wallet, we want to return a message instructing the user to connect a wallet. Add the following code:

    ```tsx
    if (!lucid || !walletProvider) {
      return <p>Connect a wallet to send and claim gifts</p>
    }
    ```

  - If this `if` condition doesn't return true, we'll instead return the `GiveForm` and `ClaimButton` components, passing `lucid` and `showToaster` as props. Add the following between the `<>` and `</>` tags in the final `return` statement:

    ```tsx
    <GiveForm lucid={lucid} showToaster={showToaster} />
    <ClaimButton lucid={lucid} showToaster={showToaster} />
    ```

9. ### **Test the app**
  - The app should now be ready to use - connect your testnet wallet and try sending and claiming gifts with the contract!