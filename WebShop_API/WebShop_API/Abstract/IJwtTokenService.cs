using Google.Apis.Auth;
using WebShop_API.Data.Entities.Identity;

namespace WebShop_API.Abstract
{
    public interface IJwtTokenService
    {
        Task<GoogleJsonWebSignature.Payload> VerifyGoogleToken(string tokenId);
        Task <string> CreateToken(UserEntity user);
    }
}
