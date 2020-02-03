I don't like working with external DLL libraries from within my C# code. So when I found out that there was no way to use the native Windows icon picker from within a WPF application without using shell32.dll and user32.dll I decided to create a NuGet package to handle this for me.

This NuGet library means that I never need to manually write the code to reference those external DLLs again when working with WPF and .NET Framework.

When used, the library can return one of three things: an icon, a bitmap, or a custom interface called `IIconReference`. This interface contains the path of the selected icon file and also the index within the file of the specific icon the user selected. (For those who don't know, an icon file can contain many different icons).

The developer can then store these two pieces of information if they wish, and at a later point in time, can pass them back into the library to retrieve an icon or bitmap without having to re-prompt the user with the dialog.

This library supports all the file types that the native Windows dialog supports:
- ico
- icl
- exe
- dll