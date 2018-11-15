using BreakingNews.Persistence.Configurations;
using BreakingNews.Persistence.Infrastructure;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace BreakingNews.Persistence
{
    public class RestContext
    {
        private const string RestServiceSettingsName = "RestService";
        private readonly HttpClient _httpClient;

        public RestContext(IConfiguration configuration)
        {
            var options = configuration.GetSection(RestServiceSettingsName)
                .Get<RestConfiguration>();
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri(options.ConnectionString),
                Timeout = TimeSpan.FromSeconds(options.ConnectionTimeout)
            };
        }

        public async Task<HttpResponseMessage> GetAsync(
            string requestUri,
            string authToken = null,
            CancellationToken cancellationToken = default)
        {
            var responseMessage = await SendAsync(
                HttpMethod.Get,
                requestUri,
                authToken: authToken,
                cancellationToken: cancellationToken);
            responseMessage.EnsureSuccessStatusCode();
            return responseMessage;
        }

        public async Task<HttpResponseMessage> PostAsync(
            string request,
            object content,
            string authToken = null,
            CancellationToken cancellationToken = default)
        {
            var responseMessage = await SendAsync(
                HttpMethod.Post,
                request,
                authToken,
                new JsonContent(content),
                cancellationToken);
            responseMessage.EnsureSuccessStatusCode();
            return responseMessage;
        }

        private async Task<HttpResponseMessage> SendAsync(
            HttpMethod method,
            string request,
            string authToken = null,
            HttpContent content = null,
            CancellationToken cancellationToken = default)
        {
            var requestMessage = new HttpRequestMessage(method, request);

            if (content != null)
            {
                requestMessage.Content = content;
            }

            if (!string.IsNullOrEmpty(authToken))
            {
                requestMessage.Headers.Authorization = 
                    new AuthenticationHeaderValue("Bearer", authToken);
            }

            return await _httpClient.SendAsync(requestMessage, cancellationToken);
        }
    }
}
