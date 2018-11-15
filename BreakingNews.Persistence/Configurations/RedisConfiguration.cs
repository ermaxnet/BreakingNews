using System;

namespace BreakingNews.Persistence.Configurations
{
    [Serializable]
    public class RedisConfiguration
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string Instance { get; set; }
    }
}