using System;

namespace BreakingNews.Persistence.Configurations
{
    [Serializable]
    public class RestConfiguration
    {
        public string ConnectionString { get; set; }
        public int ConnectionTimeout { get; set; }
    }
}
