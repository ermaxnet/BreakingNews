using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;

namespace BreakingNews.UI.Extensions
{
    public static class DistributedCacheExtensions
    {
        public static void Set<T>(this IDistributedCache cache, string key, T value)
        {
            cache.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static void Set<T>(this IDistributedCache cache, string key, T value, DistributedCacheEntryOptions options)
        {
            cache.SetString(key, JsonConvert.SerializeObject(value), options);
        }

        public static T Get<T>(this IDistributedCache cache, string key)
        {
            var value = cache.GetString(key);
            return value == null ? default : JsonConvert.DeserializeObject<T>(value);
        }

        public static async Task SetAsync<T>(this IDistributedCache cache, string key, T value, CancellationToken cancellationToken = default)
        {
            await cache.SetStringAsync(key, JsonConvert.SerializeObject(value), cancellationToken);
        }

        public static async Task SetAsync<T>(this IDistributedCache cache, string key, T value, DistributedCacheEntryOptions options, CancellationToken cancellationToken = default)
        {
            await cache.SetStringAsync(key, JsonConvert.SerializeObject(value), options, cancellationToken);
        }

        public static async Task<T> GetAsync<T>(this IDistributedCache cache, string key, CancellationToken cancellationToken = default)
        {
            var value = await cache.GetStringAsync(key, cancellationToken);
            return value == null ? default : JsonConvert.DeserializeObject<T>(value);
        }
    }
}
