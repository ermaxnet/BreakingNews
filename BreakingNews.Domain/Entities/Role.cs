using System;

namespace BreakingNews.Domain.Entities
{
    public class Role
    {
        public Role()
        {
            ConcurrencyStamp = Guid.NewGuid();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string NormalizedTitle { get; set; }
        public Guid ConcurrencyStamp { get; set; }
    }
}
