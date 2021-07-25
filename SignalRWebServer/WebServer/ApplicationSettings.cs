using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi
{
    public class ApplicationSettings
    {
        public string JWT_Secret { get; set; }

        public string ClientAngular_Url { get; set; }
    }
}
