# AES: Client <=> Server

[![Build Status](https://travis-ci.org/evanlindsey/AES-Client-Server-Encryption.svg?branch=master)](https://travis-ci.org/evanlindsey/AES-Client-Server-Encryption)

### Read/write a unique encryption with mirrored libraries

- 256 bit or 32 character key stored as cookie
- CBC (Cipher Block Chaining) encryption mode
- IV (Initialization Vector) used and appended to result

_Client Script (JS):_
- https://github.com/evanlindsey/AES-Client-Server-Encryption/blob/master/wwwroot/js/crypto.js
- Using aes.js from [CryptoJS](https://code.google.com/archive/p/crypto-js/) v3.1.2

_Server Script (C#):_
- https://github.com/evanlindsey/AES-Client-Server-Encryption/blob/master/Classes/Crypto.cs
- Using .NET [System.Security.Cryptography](https://msdn.microsoft.com/en-us/library/system.security.cryptography(v=vs.110).aspx)

_Stack:_
- [.NET Core 2.0](https://github.com/dotnet/core)
- [jQuery v.2.2.0](https://github.com/jquery/jquery)
- [Bootstrap v3.3.7](https://github.com/twbs/bootstrap)
- Hosted on Heroku with the [.NET Core Buildpack from jincod](https://github.com/jincod/dotnetcore-buildpack)
