using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace aes_client_server.Controllers
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
                            // Encrypt Text
                            string encrypted = Crypto.Encrypt(input, key);
                            // Return Encrypted Text
                            return Content(encrypted);
                        }
                        else if (method == "Decrypt")
                        {
                            // Decrypt Text
                            string decrypted = Crypto.Decrypt(input, key);
                            // Return Decrypted Text
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
