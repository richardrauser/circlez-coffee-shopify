# Circlez Coffee Shopify

This is a submission for the [Shopify x Thirdweb Replit Bounty](https://replit.com/bounties/@thirdwebShopify/build-a-shopify-bloc). It is a fully formed, functional demo of a gamified membership and rewards scheme built on the blockchain for a fictional coffee brand, Circlez Coffee. It demonstrates the technology of Replit, Shopify and Thirdweb, including Shopify Apps, Blockchain components, token gating, Thirdweb Minting and CommerceKit, along with their node packages and APIs.

This repo includes the Shopify app and extensions that form part of the demo. It was forked from the [tokengating example app](https://github.com/Shopify/tokengating-example-app), and includes various changes to support thie use case of the bounty. It is meant to be used with the Circlez Coffee website and backend, which [can be found on Replit](https://replit.com/@RichardRauser/Circlez-Coffee). You can also find the source for the Circlez Coffee website and backend [in Github](https://github.com/richardrauser/Circlez-Coffee-Web). (Note that the repl is right up against the storage limit.. this can usually be mitigated by deleting the next.js cache in /.next/cache)
The Circlez Website allows users to claim membership and unlock rewards by completing achievements. These rewards include discounts on coffee, swag, and an airdrop of an original track by the Circlez Coffee house band, LadyBean and the Circlez! These reward are unlocked by making purchases on the Shopify storefront.

You can see the Circlez Coffee website running [here](https://circlez-coffee.myshopify.com/).
You can see the Circlez Coffee Shopify storefront [here](https://circlez-coffee.myshopify.com/).

## Requirements

* This app requires a new `gates` object in Liquid that is only as early access. Please contact blockchain-partners@shopify.com with your `.myshopify.com` shop domain for access.

### Setup 

1. Clone this repo.
1. Go to the app's root directory in your terminal and run `npm install` to download all the dependencies
1. Install [Rust](https://www.rust-lang.org/tools/install) and [`cargi-wasi`](https://bytecodealliance.github.io/cargo-wasi/install.html)
3. Run `npm run dev`. The terminal will prompt you with Create this project as a new app on Shopify?, select yes
4. Enter a name for your app or accept the default
5. Your local server should be running now and you should see a "Shareable app URL" on your terminal. Copy `https://YOUR_NGROK_URL.ngrok.io` and replace `YOUR_NGROK_URL` in `/extensions/tokengate-src/src/useEvaluateGate.js`
6. While your app is running, in a separate terminal window run `npm --prefix extensions/tokengate-src run build` to include these changes to your build
7. Run `npm run deploy` to deploy your app
8. Install the app on your development store by visiting the "Shareable app URL" that was logged to your terminal.
9. Navigate to your app in your [partners page](https://partners.shopify.com) and enable the theme app extension. There's a shortcut in your local server logs.
10. You can now add the theme app extension to your Online Store's theme. There's a shortcut in your local server logs for this as well, under "Setup your theme app extension in the host theme". At the top of the theme editor, select a page under "Products" and add your theme app extension's block under "Product information".
11. Within the partner's page, if you navigate to the tokengating-function extension, you will see the function's ID in the "Function details" section. It's also part of the URL when you're on the tokengating-function page. Copy that ID and replace `YOUR_FUNCTION_ID` in `/web/api/create-discount.js`.
)
### Setup your smart contracts

1. Visit the [Thirdweb Contracts dashboard](https://thirdweb.com/dashboard/contracts)
1. Hit the Deploy button, and create a new NFT Collection smart contract for your Membership NFT. 
1. Hit the Deploy button and create new Edition smart contracts for whatever achievements you'd like.
1. Take note of the contract addresses. You'll need to put them into your fork of the the [Circlez Coffee website repl](https://replit.com/@RichardRauser/Circlez-Coffee).
2. You will take note of the minter private key, as it will need to go into the Repl as well as Secret. (further instructions in the Repl)

### Setup some token gates

1. Go to the app on your development store by visiting the "Shareable app URL" from your server log. Create a gate with a 10% discount 
1. Once the gate is created you can visit your admin's Discount page to verify that it exists there.
1. Now you can visit your Online Store by visiting the URL logged in your terminal under "Preview your theme app extension". Go to the gated product and connect your wallet to unlock the gate. Add the item to your cart. If you view the cart details, you will see that the discount you created has been applied.
1. Your app has attested that any connected wallet will unlock the gate. This attestation is a cart attribute with the key `_shopify_gate_context` and can be viewed at the URL: `your-shop-domain.myshopify.com/cart.json`. As app developers, you have complete control over the gate requirements and the logic involved in determining if a gate should be unlocked.

- Now you're read to fork the [Circlez Coffee website repl](https://replit.com/@RichardRauser/Circlez-Coffee) and follow the steps here.

## More Resources
- [Read more about tokengating](https://shopify.dev/apps/blockchain/tokengating)

## License

Copyright © 2023 Shopify. See [LICENSE](LICENSE.md) for further details.
