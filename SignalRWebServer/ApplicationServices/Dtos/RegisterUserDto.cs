using System;
using System.Collections.Generic;
using System.Text;

namespace ApplicationServices.Dtos
{
    public class RegisterUserDto
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public string FullName { get; set; }
    }
}
