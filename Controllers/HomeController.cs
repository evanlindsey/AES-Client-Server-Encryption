using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AES_Client_Server.Models;

namespace AES_Client_Server.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
