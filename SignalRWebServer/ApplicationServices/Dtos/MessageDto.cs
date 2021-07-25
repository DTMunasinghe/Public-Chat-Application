using System;
using System.Collections.Generic;
using System.Text;

namespace ApplicationServices.Dtos
{
    public class MessageDto
    {
        public string Sender { get; set; }

        public string Message { get; set; }

        public DateTime Date { get; set; }

        public string UserId { get; set; }
    }
}
