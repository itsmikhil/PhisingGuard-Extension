class ThreatProvider {
  async checkUrl() {
    throw new Error("checkUrl() must be implemented by the provider.");
  }

  async check(url) {
    return this.checkUrl(url);
  }
}

module.exports = ThreatProvider;
