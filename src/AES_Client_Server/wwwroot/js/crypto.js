function Crypto() {
    // Encryption
    this.encrypt = function (toEncrypt, key256) {
        // Key (utf8) as Crypto Array
        var keyArray = CryptoJS.enc.Utf8.parse(key256);
        // Generate IV (Initialization Vector)
        var iv = CryptoJS.lib.WordArray.random(16);
        // Encryption Function
        var encrypted = CryptoJS.AES.encrypt(
            // Text to Encrypt
            toEncrypt,
            // Key
            keyArray,
            {
                // IV
                iv: iv,
                // CBC (Cipher Block Chaining) Mode
                mode: CryptoJS.mode.CBC,
                // PKCS7 Padding
                padding: CryptoJS.pad.Pkcs7
            });
        // Encrypted Text as Byte Array
        var textArray = this.toByteArray(encrypted.toString());
        // IV as Byte Array
        var ivArray = this.toByteArray(CryptoJS.enc.Base64.stringify(iv));
        // Combined Byte Array (Text and IV)
        var combined = this.appendArray(textArray, ivArray);
        // Return Encrypted String (Base-64)
        return this.toBase64(combined);
    };

    // Decryption
    this.decrypt = function (toDecrypt, key256) {
        // Input String as Byte Array
        var bytes = this.toByteArray(toDecrypt);
        // Split Byte Array (Text and IV)
        var combined = this.splitArray(bytes);
        // Byte Array Containing Encrypted Text
        var text = this.toBase64(combined[0]);
        // IV Byte Array as String
        var iv = this.toBase64(combined[1]);
        // Key (utf8) as Crypto Array
        var keyArray = CryptoJS.enc.Utf8.parse(key256);
        // Decryption Function ~ Output Decypted Text as Byte Array
        var decrypted = CryptoJS.AES.decrypt(
            {
                // Text (base64) as Crypto Array
                ciphertext: CryptoJS.enc.Base64.parse(text)
            },
            keyArray,
            {
                // IV (base64) as Crypto Array
                iv: CryptoJS.enc.Base64.parse(iv),
                // CBC (Cipher Block Chaining) Mode
                mode: CryptoJS.mode.CBC,
                // PKCS7 Padding
                padding: CryptoJS.pad.Pkcs7
            });
        // Return Decrypted (UTF8) String
        return decrypted.toString(CryptoJS.enc.Utf8);
    };

    // Append IV to Text
    this.appendArray = function (text, iv) {
        // Create New Byte Array
        var result = new Uint8Array(text.length + iv.length);
        // For Combined Length, Append Text then IV
        for (i = 0; i < result.length; i++) {
            if (i < text.length) {
                result[i] = text[i];
            } else {
                result[i] = iv[i - text.length];
            }
        }
        // Return Combined Byte Array
        return result;
    };

    // Split Text and IV
    this.splitArray = function (combined) {
        // Create New Result List
        var resultList = [];
        // IV Length ~~ 16 Chars
        var ivLength = 16;
        // Length of Text minus IV
        var textLength = combined.length - ivLength;
        // Copy Text to Byte Array
        var text = combined.subarray(0, textLength);
        // Copy IV to Byte Array
        var iv = combined.subarray(textLength, combined.length);
        // Add Text Byte Array to Result List
        resultList.push(text);
        // Add IV Byte Array to Result List
        resultList.push(iv);
        // Return Result List
        return resultList;
    };

    // Base64 to Byte Array
    this.toByteArray = function (base64) {
        // Decode String from Base64
        var binStr = atob(base64);
        // Create New Byte Array
        var bytes = new Uint8Array(binStr.length);
        // Assign Array Element i the CharCode Value of String Index i
        Array.prototype.forEach.call(binStr, function (ch, i) {
            bytes[i] = ch.charCodeAt(0);
        });
        // Return Byte Array
        return bytes;
    };

    // Byte Array to Base64
    this.toBase64 = function (bytes) {
        // Append Each Array Element to Next Index of New String
        var base64 = Array.prototype.map.call(bytes, function (ch) {
            return String.fromCharCode(ch);
        }).join('');
        // Return String Encoded as Base64
        return btoa(base64);
    };
};
