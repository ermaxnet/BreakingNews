using BreakingNews.Domain.Exceptions;
using BreakingNews.Domain.Infrastructure;
using System;
using System.Collections.Generic;

namespace BreakingNews.Domain.ValueObjects
{
    public class Token : ValueObject
    {
        private Token()
        { }

        public Token(string value)
        {
            try
            {
                Value = new Guid(value);
            }
            catch (Exception ex)
            {
                throw new TokenInvalidException(value, ex);
            }
        }

        public Token(Guid value)
        {
            Value = value;
        }

        public static implicit operator string(Token token)
        {
            return token.ToString();
        }

        public static explicit operator Token(string value)
        {
            return new Token(value);
        }

        public static explicit operator Token(Guid value)
        {
            return new Token(value);
        }

        public override string ToString()
        {
            return Value.ToString();
        }

        protected override IEnumerable<object> GetAtomicValues()
        {
            yield return Value;
        }

        public Guid Value { get; private set; }
    }
}
