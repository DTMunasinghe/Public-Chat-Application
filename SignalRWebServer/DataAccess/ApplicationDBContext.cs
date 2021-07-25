using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataAccess
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions options) : base(options) {}

        public DbSet<Message> Messages { get; set; }

        public DbSet<User> Users { get; set; }
    }
}
