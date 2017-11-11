using System;
using Microsoft.AspNetCore.Mvc;

namespace AES_Client_Server.Controllers
{
    [Route("api/crypto")]
    public class CryptoController : Controller
    {
        // GET api/crypto/encrypt
        [HttpGet("Encrypt")]
        public IActionResult Encrypt(string input)
        {
            return CryptoActions(input, "Encrypt");
        }

        // GET api/crypto/decrypt
        [HttpGet("Decrypt")]
        public IActionResult Decrypt(string input)
        {
            return CryptoActions(input, "Decrypt");
        }

        // Crypto Handler
        private IActionResult CryptoActions(string input, string method)
        {
            if (input != null)
            {
                // Get Key
                string key = Request.Cookies["key"];
                if (key != null && key.Length == 32)
                {
                    try
                    {
                        if (method == "Encrypt")
                        {
                            // Return Encrypted Text
                            string encrypted = Crypto.Encrypt(input, key);
                            return Content(encrypted);
                        }
                        else if (method == "Decrypt")
                        {
                            // Return Decrypted Text
                            string decrypted = Crypto.Decrypt(input, key);
                            return Content(decrypted);
                        }
                        else
                            return null;
                    }
                    catch (Exception ex)
                    {
                        return NotFound(ex.Message);
                    }
                }
                else
                    return NotFound("Key Cookie is not Present");
            }
            else
                return NotFound("Input String is Empty");
        }
    }
}
