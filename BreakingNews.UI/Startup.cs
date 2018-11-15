using BreakingNews.Application.Authentication.Queries;
using BreakingNews.Application.Infrastructure;
using BreakingNews.Application.Interfaces;
using BreakingNews.Domain.Constants;
using BreakingNews.Infrastructure;
using BreakingNews.Persistence;
using BreakingNews.Persistence.Configurations;
using BreakingNews.UI.AuthorizationPolicy;
using BreakingNews.UI.Filters;
using BreakingNews.UI.Infrastructure;
using BreakingNews.UI.Middlewares;
using MediatR;
using MediatR.Pipeline;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.IISIntegration;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using System.Reflection;

namespace BreakingNews.UI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services
            services.AddSingleton(context => new RestContext(Configuration));
            services.AddScoped<IWindowsIdentityService, WindowsIdentityService>();
            services.AddTransient<IJsonWebTokenService, JsonWebTokenService>();
            services.AddTransient<Application.Interfaces.IAuthenticationService, BreakingNews.Infrastructure.AuthenticationService>();
            services.AddTransient<IUserManager, UserManager>();
            services.AddTransient<IRoleManager, RoleManager>();

            // Add MediatR
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestPreProcessorBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestPerformanceBehaviour<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(RequestValidationBehavior<,>));
            services.AddMediatR(typeof(AuthenticateOnRestServiceQuery).GetTypeInfo().Assembly);

            // Add authentication
            services
                .AddAuthentication(options =>
                {
                    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = IISDefaults.AuthenticationScheme;
                })
                .AddCookie(options =>
                {
                    options.Cookie.Name = ".BrewsCookies";
                });

            // Add redis ticket store
            services.TryAddEnumerable(ServiceDescriptor.Singleton<IPostConfigureOptions<CookieAuthenticationOptions>, CookieAuthenticationPostConfigureOptions>());

            // Add distributed redis cache
            services.AddDistributedRedisCache(options =>
            {
                var redisOptions = Configuration.GetSection("Redis").Get<RedisConfiguration>();
                options.Configuration = $"{redisOptions.Host}:{redisOptions.Port}";
                options.InstanceName = redisOptions.Instance;
            });

            // Add common services
            services.AddTransient<TicketSerializer>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddSingleton<IAuthorizationHandler, RestBadgeEntryHandler>();

            // Add rest authorization
            services.AddAuthorization(options =>
            {
                options.AddPolicy(GlobalConstants.RestPolicyName, policy =>
                    policy.Requirements.Add(new RestBadgeEntryRequirement()));
            });

            services
                .AddMvc(options => options.Filters.Add(typeof(CustomExceptionFilterAttribute)))
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // Customise default API behavior
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });

            // Customise default IIS options
            services.Configure<IISOptions>(options =>
            {
                options.AuthenticationDisplayName = "Windows";
                options.AutomaticAuthentication = true;
            });
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    EnvParam = new { MODE = "development" }
                });
            }

            app.UseStaticFiles();

            app.UseAuthentication();
            app.UseWhenWindowsIdentity();
            app.UseRestAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
