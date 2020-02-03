This is a semi-joke project based on the [mocking Spongebob meme](https://knowyourmeme.com/memes/mocking-spongebob).

It's not something I find myself doing, but some people enjoy using the technique found in this meme used to portray a mocking tone. This is usually in chats or direct messages. For those who don't know, in the meme, a mocking tone is portrayed by alternating the case of the letters in your message.

> An ExAmPlE mIgHt LoOk LiKe ThIs

This is unsurprisingly quite tricky to type in a timely manner, especially for longer messages, and this is where this tool can help.

### Why develop this?

My true development motives were not so that I could send messages in this format; rather I wanted to see how easy it would be to create a program which uses a global shortcut within Windows.

In this project I make use of a NuGet library called [MouseKeyHook](https://www.nuget.org/packages/MouseKeyHook) found here on [Github](https://github.com/gmamaladze/globalmousekeyhook). Using this tool I was surprised about how easy it was to tap into keystrokes from anywhere within the Windows operating system without the program being the active window.

Another development technique that I gained during the development of this project was the ability to minimise a program down to the Windows task tray. Again, in this case, it was made easier for me by the use of a NuGet library called [WPF NotifyIcon](https://www.nuget.org/packages/Hardcodet.NotifyIcon.Wpf/) by [Philipp Sumi](http://www.hardcodet.net/wpf-notifyicon).