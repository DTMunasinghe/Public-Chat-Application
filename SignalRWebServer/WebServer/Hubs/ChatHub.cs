using ApplicationServices.Contracts.Repositories;
using ApplicationServices.Dtos;
using Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace WebServer.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IMessageRepository _messageRepository;

        private readonly UserManager<User> _userManager;

        public ChatHub(IMessageRepository messageRepository, UserManager<User> userManager) : base()
        {
            _messageRepository = messageRepository;
            _userManager = userManager;
        }

        public async Task NewMessage(MessageDto message)
        {
            var user = await _userManager.FindByNameAsync(message.Sender);

            var newMessage = new Message()
            {
                UserId = user.Id,
                MessageText = message.Message,
                Date = message.Date
            };

            await _messageRepository.AddAsync(newMessage);

            await Clients.All.SendAsync("MessageReceived", message);
        }

    }
}
