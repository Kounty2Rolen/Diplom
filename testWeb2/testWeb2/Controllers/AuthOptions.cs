using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace testWeb2.Controllers
{
    public class AuthOptions
    {
        public static readonly string ISSUER = "Linq2EF"; // издатель токена
        public static readonly string AUDIENCE = "Linq2EFClient"; // потребитель токена
        private static readonly string KEY = "4022354678f2ab042bd4d3f583c9fee7391826c55d9c8d9f95d09a4f1ae07762";   // ключ для шифрации
        public static readonly int LIFETIME = 1440; // время жизни токена - 1 минута

        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}