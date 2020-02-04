// this object manages the rate limits for endpoints
// it has the ability to set individual rates for specific endpoints, allowing for infrequently used
// endpoints to be throttled more than heavily used ones

// calling either 'resetCountAsync()' or 'setEndPointLimits()' will create a new object for that endpoint 
// with key-value pairs that represent the request count and rate limit period for that endpoint

const apiLimiter = {
  
  // if limits for specific endpoints are not set manually, they use these default values
  defaultLimit: 1000,
  defaultPeriod: 60000,
  
  // resets the counter for a given endpoint after that endpoint's specified period
  resetCountAsync(endpoint) {
    if (!this[endpoint]) {
      this.createEndPointLimiter(endpoint);
    }
    setInterval(() => {
      this[endpoint].count = 0;
    }, this[endpoint].period);
  },

  // checks if rate limit has been exceeded. In the event it has, a 429 error is sent
  evaluateCountAndHandleLimit(endpoint, res) {
    if (this[endpoint] && this[endpoint].limit) {
      this[endpoint].count++;

      if(this[endpoint].count > this[endpoint].limit) {
        res.status(429);
        res.send({error: 'API is under heavy load. Please try again in a short while.'});
        return true;
      }
      return false;
    }
  },
  
  // this function gives the API user the ability to set custom API rate limits
  setEndPointLimits(endpoint, limit, period) {
    if (!this[endpoint]) {
      this.createEndPointLimiter(endpoint);
    }
    this[endpoint].limit = limit || this.defaultLimit;
    this[endpoint].period = period || this.defaultPeriod;
  },

  // sets the period and hits-per-period limit of an endpoint
  createEndPointLimiter(endpoint) {
    this[endpoint] = {
      count: 0,
      limit: this.defaultLimit,
      period: this.defaultPeriod
    };
  }
};

module.exports = { apiLimiter };