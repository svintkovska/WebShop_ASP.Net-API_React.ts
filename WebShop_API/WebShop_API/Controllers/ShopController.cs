using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebShop_API.Data;

namespace WebShop_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShopController : ControllerBase
    {
        private readonly AppEFContext _context;

        public ShopController(AppEFContext context)
        {

            _context = context;
        }
    }
}
