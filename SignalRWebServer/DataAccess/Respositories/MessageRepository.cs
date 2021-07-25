using ApplicationServices.Contracts.Repositories;
using ApplicationServices.Dtos;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Respositories
{
    public class MessageRepository : Repository<Message>, IMessageRepository
    {
        private readonly UserManager<User> _userManager;

        public MessageRepository(ApplicationDBContext context, UserManager<User> userManager) : base(context)
        {
            _userManager = userManager;
        }

        public async Task<IEnumerable<MessageDto>> GetMessagesAsync()
        {
            var messages = await Context.Messages.Select(msg => new MessageDto
            {
                Message = msg.MessageText,
                Date = msg.Date,
                UserId = msg.UserId
            }).ToListAsync();

            foreach (MessageDto msg in  messages)
            {
                msg.Sender = (await _userManager.FindByIdAsync(msg.UserId)).UserName;
            }

            return messages;

            //return await Context.Messages
            //    .Select(x => new MessageDto
            //    {
            //       Sender =  _userManager.FindByIdAsync(x.UserId).Result.UserName,
            //       Message = x.MessageText,
            //       Date = x.Date
            //    }).ToListAsync();
        }
    }
}
