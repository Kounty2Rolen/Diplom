using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using DiplomWork.Model; // класс Person

namespace DiplomWork.Controllers
{
    public class AccountController : Controller
    {
        private List<Model.User> people;

        public IActionResult Token([FromBody] Person person)
        {
            var identity = GetIdentity(person);

            if (identity != null)
            {
                var now = DateTime.UtcNow;
                // создаем JWT-токен
                var jwt = new JwtSecurityToken(
                        issuer: AuthOptions.ISSUER,
                        audience: AuthOptions.AUDIENCE,
                        notBefore: now,
                        claims: identity.Claims,
                        expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                        signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
                var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
                return Content(encodedJwt);
            }
            else
            {
                return Content(null);
            }
        }

        [Authorize]
        public IActionResult GetLogin()
        {
            Context context = new Context();
            return Ok(context.User.Where(c => c.LoginName == User.Identity.Name).Select(c => c.Fname + " " + c.Mname));
        }

        private ClaimsIdentity GetIdentity([FromBody]Person personfrmbody)
        {
            DiplomWork.Model.Context context = new Model.Context();
            people = context.User.ToList();
            context.Dispose();
            User person = people.FirstOrDefault(x => x.LoginName == personfrmbody.LoginName && x.Password == personfrmbody.Password);
            if (person != null)
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimsIdentity.DefaultNameClaimType, person.LoginName),
                    new Claim("DateTime", DateTime.Now.ToString("s",System.Globalization.CultureInfo.InvariantCulture))

            };
                ClaimsIdentity claimsIdentity =
                new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);
                return claimsIdentity;
            }

            // если пользователя не найдено
            return null;
        }
    }
}