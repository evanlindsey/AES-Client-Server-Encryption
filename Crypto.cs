using System;
using System.Text;
using System.Collections.Generic;
using System.Security.Cryptography;

namespace aes_client_server
{
    public class Crypto
    {
        // Encryption
        public static string Encrypt(string toEncrypt, string key256)
        {
            // Text as Byte Array
            byte[] toEncryptArray = Encoding.UTF8.GetBytes(toEncrypt);
            // Key as Byte Array
            byte[] keyArray = Encoding.UTF8.GetBytes(key256);
            // AES Instance Creation
            Aes aes = Aes.Create();
            // Generate IV (Initialization Vector)
            aes.GenerateIV();
            // Assign Key Array
            aes.Key = keyArray;
            // CBC (Cipher Block Chaining) Mode
            aes.Mode = CipherMode.CBC;
            // PKCS7 Padding
            aes.Padding = PaddingMode.PKCS7;
            // Encryptor Creation
            ICryptoTransform cTransform = aes.CreateEncryptor();
            // Encrypted Text as Byte Array
            byte[] textArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
            // IV as Byte Array
            byte[] ivArray = aes.IV;
            // Combined Byte Array (Text and IV)
            byte[] combinedArray = AppendArray(textArray, ivArray);
            // Return Encrypted String (Base-64)
            return Convert.ToBase64String(combinedArray, 0, combinedArray.Length);
        }

        // Decryption
        public static string Decrypt(string toDecrypt, string key256)
        {
            // Input String as Byte Array
            byte[] bytes = Convert.FromBase64String(toDecrypt);
            // Split Byte Array (Text and IV)
            List<byte[]> combined = SplitArray(bytes);
            // Byte Array Containing Encrypted Text
            byte[] toDecryptArray = combined[0];
            // IV as Byte Array
            byte[] iv = combined[1];
            // Key as Byte Array
            byte[] keyArray = Encoding.UTF8.GetBytes(key256);
            // AES Instance Creation
            Aes aes = Aes.Create();
            // Assign IV
            aes.IV = iv;
            // Assign Key Array
            aes.Key = keyArray;
            // CBC (Cipher Block Chaining) Mode
            aes.Mode = CipherMode.CBC;
            // PKCS7 Padding
            aes.Padding = PaddingMode.PKCS7;
            // Decryptor Creation
            ICryptoTransform cTransform = aes.CreateDecryptor();
            // Output Decypted Text as Byte Array
            byte[] resultArray = cTransform.TransformFinalBlock(toDecryptArray, 0, toDecryptArray.Length);
            // Return Decrypted (UTF8) String
            return Encoding.UTF8.GetString(resultArray);
        }

        // Append IV to Text
        private static byte[] AppendArray(byte[] text, byte[] iv)
        {
            // Create New Byte Array
            byte[] result = new byte[text.Length + iv.Length];
            // Add Text Byte Array to 'result' Starting at Index 0
            Array.Copy(text, 0, result, 0, text.Length);
            // Add IV Byte Array to 'result' where Text Ends
            Array.Copy(iv, 0, result, text.Length, iv.Length);
            // Return Combined Byte Array
            return result;
        }

        // Split Text and IV
        private static List<byte[]> SplitArray(byte[] combined)
        {
            // Create New Result List
            List<byte[]> resultList = new List<byte[]>();
            // IV Length ~~ 16 Chars
            int ivLength = 16;
            // Length of Text minus IV
            int textLength = combined.Length - ivLength;
            // Create 2 New Byte Arrays
            byte[] text = new byte[textLength];
            byte[] iv = new byte[ivLength];
            // Copy Text to Byte Array
            Array.Copy(combined, 0, text, 0, textLength);
            // Copy IV to Byte Array
            Array.Copy(combined, textLength, iv, 0, ivLength);
            // Add Text Byte Array to Result List
            resultList.Add(text);
            // Add IV Byte Array to Result List
            resultList.Add(iv);
            // Return Result List
            return resultList;
        }
    }
}
