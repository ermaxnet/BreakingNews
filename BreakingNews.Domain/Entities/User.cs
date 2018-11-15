using BreakingNews.Domain.ValueObjects;
using System;

namespace BreakingNews.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Email { get; set; }
        public Token AdGuid { get; set; }
        public AdAccount AdAccount { get; set; }
        public bool IsAuthenticated { get; set; }
    }
}
