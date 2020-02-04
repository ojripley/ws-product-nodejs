const apiLimiter = {
  
  defaultLimit: 100,
  defaultPeriod: 60000,
  
  resetCountAsync(endpoint) {
    console.log('uh ', endpoint);
    if (!this[endpoint]) {
      this.createEndPointLimiter(endpoint);
    }
    setInterval(() => {
      this[endpoint].count = 0;
      console.log('resetting ' + endpoint);
    }, this[endpoint].period);
  },

  evaluateCountAndHandleLimit(endpoint, res) {
    if (this[endpoint] && this[endpoint].limit) {
      this[endpoint].count++;

      if(this[endpoint].count > this[endpoint].limit) {
        res.status(439);
        res.send({error: 'API is under heavy load. Please wait and try again.'});
        return true;
      }
      return false;
    }
  },
  
  setEndPointLimits(endpoint, limit, period) {
    if (!this[endpoint]) {
      this.createEndPointLimiter(endpoint);
    }
    this[endpoint].limit = limit || this.defaultLimit;
    this[endpoint].period = period || this.defaultPeriod;
  },

  createEndPointLimiter(endpoint) {
    this[endpoint] = {
      count: 0,
      limit: this.defaultLimit,
      period: this.defaultPeriod
    };
  }
};

module.exports = { apiLimiter };