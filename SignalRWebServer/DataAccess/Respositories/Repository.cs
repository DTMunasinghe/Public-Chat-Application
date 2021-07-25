using ApplicationServices.Contracts.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DataAccess.Respositories
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class 
    {
        protected readonly ApplicationDBContext Context;

        public Repository(ApplicationDBContext context)
        {
            Context = context;
        }

        // Repositories should not return IQueryable. Bcz this can give a wrong impression to 
        // upper layers (Controller, Services, etc). Bcz they will use IQueryable to build quries.
        // Repository should encapsulate the query instead of repeat them
        public async Task<IEnumerable<TEntity>> ListAllAsync()
        {
            return await Context.Set<TEntity>().ToListAsync();
        }

        public async Task AddAsync(TEntity entity)
        {
            await Context.Set<TEntity>().AddAsync(entity);
            await Context.SaveChangesAsync();
        }
    }
}
