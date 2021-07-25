using System;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Message
    {
        public int Id { get; set; }

        [MaxLength(450)]
        public string UserId { get; set; }

        public string MessageText { get; set; }

        public DateTime Date { get; set; }

        public User User { get; set; }
    }
}
