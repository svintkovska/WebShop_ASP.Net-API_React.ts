using WebShop_API.Models;

namespace WebShop_API.Abstract
{
    public interface ISmtpEmailService
    {
        public void Send(Message message);
    }
}
