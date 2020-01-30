using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace testWeb2.Controllers
{
    public class AuthOptions
    {
        public const string ISSUER = "Linq2EF"; // издатель токена
        public const string AUDIENCE = "Linq2EFClient"; // потребитель токена
        const string KEY = "4022354678f2ab042bd4d3f583c9fee7391826c55d9c8d9f95d09a4f1ae07762";   // ключ для шифрации
        public const int LIFETIME = 60; // время жизни токена - 1 минута
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
