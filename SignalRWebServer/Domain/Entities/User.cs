using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Entities
{
    public class User : IdentityUser
    {
        [ForeignKey("UserId")]
        public IList<Message> Messages { get; set; }
    }
}
