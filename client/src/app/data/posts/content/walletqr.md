WalletQR is a website where users can create publically available profiles for sharing cryptocurrency wallet addresses with others.

<img src="assets/img/posts/walletqr1.png" width="75%" class="center" alt="The WalletQR homescreen">

### Tech Stack

WalletQR is built using **Node** and **Typescript**. The client-side application is built uisng **Angular 8** with some styling being brought in from **Bootstrap**. The server-side application runs using **Express** and comunicates with a MongoDB database through a persistance layer.

Both halves of the application are extensively unit tested; the client-side application contains 199 tests with 95% coverage while the server-side application contains 154 tests with a 94% coverage.

WalletQR is not currently online for people to use in production, but it will be shortly after I recieve my marks from the module I developed it for.

### Functionality

After visiting the website, a user can sign up by providing their Username, Name (or alias), Email, and Password.

The sign up form validates all the information inputted by the user. One additional check determines if the given password has been found in a data breach held by [HaveIBeenPwned.com](https://HaveIBeenPwned.com). This lookup uses their API and a technique called K-Anonymity for checking the password; this results in neither the password or a full hash of it ever leaving the client. Another result of using K-Anonymity is that the HaveIBeenPwned servers never know if the password was found in their databases or not. If the given password has been found in a data breach known by HaveIBeenPwned then the user is informed of such and they have to confirm that they know the risks of using a breached password.

Once a user is logged in, they are taken to their profile, once they have validated their email address then they are able to add wallet addresses to their profile.

Here you can see a profile with 2 fake wallet addresses added to it.

<img src="assets/img/posts/walletqr3.png" width="75%" class="center" alt="The WalletQR homescreen">

Should two people which to engage in a cryptocurrency transation, the recepient only needs to share their WalletQR username with the sender. From there the sender can find their profile, find a wallet address for the apropriate currency, and then either copy the address or scan the QR code for it.

The URLs of profiles have been designed to be as short as possible, they work in a similar manner to profiles on Medium.com:
```https://domain.com/@username```
It's important that you include the `@` as this is what differentiates your URL from that of a static page. I chose this design over having a prefix like `/u/` which Reddit uses and having having no prefix like Twitter or Github as I belive that the `@` is a simple way to identify that a URL is for a profile, rather than other content. 