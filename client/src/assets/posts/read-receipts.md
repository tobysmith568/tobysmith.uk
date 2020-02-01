We're all told to never open Spam emails, but lots of us don't see the harm. Surely so long as we don't click any links and we treat all information as
untrustworthy then all should be OK?

Well, it's not actually that simple.

Read Receipts is a small tool I have written in PHP which aims to demonstrate why even simply opening a spam email can be dangerous - or any email at all.

If you're concerned about your data, please note that this tool never saves any information about you, at all. It doesn't use any cookies, it doesn't store any data server-side, or in databases. It's totally stateless.

### The Concept

To use the tool, you give it your email address, and you also give it some text to email yourself. When you hit send, the tool takes your message, and it emails it to the address you gave it - what it doesn't tell you is that it also embeds a small image. This image is only 10x10 pixels, and it's completely transparent, but doing so allows me to execute code whenever your web browser or email client fetches this image.

It's this code, which gets triggered when the email is fetched, which can give information to the sender of the email and is why you should never even open spam emails.

### The Details

If you were to use this tool, open the initial email in a web browser, and then inspect it in the element inspector developer tool, you would see the img html tag that I am talking about. The source of this tag is dynamic; I generate it when you send yourself the email. It would look something like this

> https://readreceipt.tobysmith.uk/YourEmailAddressHere/1560509315/callback.png

While the address ends in .png, don't be fooled, on my server at this location is a PHP script, I use the .htaccess file to redirect traffic from .png extensions to .php files. I do this not only to make the email look less suspicious but also so that the address is less likely to be flagged by email clients.

This URL tells my script two things; who the email was sent to, and when the initial email was sent. Using only these two bits of information, as well as the header data, which is automatically included, I can figure out quite a bit of information about the user.

The first piece of information, and probably the most important, is that it tells the sender that your email address is active! If an email is opened, then it stands to reason that you will open up more. Opening spam emails is a great way to be sent more spam emails.

By comparing the timestamp in the image request address to the current time, this tells the sender how long it took you to open the email.

Requesting an image over HTTP gives the server access (by default) to your user agent. This string of data gives away quite a lot about the device you're using. Such information can include your operating system, your web browser, and your CPU architecture.

The final useful piece of information that I could find with the incoming request was the users IP address. With your address, the tool uses the public API found at [http://ip-api.com](http://ip-api.com) to find out as much information about you as possible. Most of the information is only best-guessed, but some of it can be surprisingly accurate.

Using your IP address, this tool reports:

- Your ISP
- If you're on a mobile connection
- If you're using a proxy
- Your estimated latitude and longitude
- Your guessed address, accurate to the postcode prefix (PO10, SE4, etc.)
- Your timezone

While this information is hardly bank account details, it's an important reminder of what we hand over to others when we visit their websites, as well as how easy it is to get the same information just from opening up an email.

### The Caveats

All that being said, the tool isn't perfect. While it seems to work correctly with outlook and outlook.com email addresses, Google and Gmail appear to load the image preemptively. This ruins the tool entirely for Gmail users as the second email is sent instantly and it only returns information about a Gmail server somewhere, not you, the user.

If you try this with other email providers, I'd love to know your results in the comments below.

If you can think of any more information which I can gain from a simple HTTP request then please also let me know, and I will extend the tool.