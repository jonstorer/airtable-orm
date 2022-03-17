class MemoryStore {
  constructor(options={}) {
    this.ttl = options.ttl;
    this.reset();
  }

  reset() {
    this.ttlCache = {};
    this.hitCount = {};
    this.valueCache = {};
  }

  get (key) {
    if (this.valueCache[key] && (this.ttlCache[key] > Date.now())) {
      this.hitCount[key] = this.hitCount[key] || 0;
      this.hitCount[key] = ++this.hitCount[key];
      return this.valueCache[key];
    }
  }

  set (key, value) {
    this.valueCache[key] = value;
    this.ttlCache[key] = Date.now() + this.ttl;
  }

  get count() {
    return Object.keys(this.ttlCache).length;
  }

  purge() {
    Object.entries(this.ttlCache).forEach(([key, time]) => {
      if (Date.now() > time) {
        delete this.ttlCache[key];
        delete this.valueCache[key];
        delete this.hitCount[key];
      }
    });
  }
}

class Cache {
  constructor(options={}) {
    this.name = options.name || 'cache'
    this.verbose = !!options.verbose;
    this.vverbose = !!options.vverbose;
    this.purge = !!options.purge;

    let ttl = options.ttl || 10;
    this.store = new MemoryStore({ ttl: ttl });

    this.reset();

    if (this.purge) {
      setInterval(() => { this.store.purge(); }, this.ttl + 1);
    };
  }

  reset() {
    this._data = {};
    this.store.reset();
  }

  get (key) {
    let value = this.store.get(key);
    value ? this._hit(key) : this._miss(key);
    return value;
  }
  set (key, value) {
    this.store.set(key, value);
  }

  _vlog (...items) {
    if (this.vverbose) { console.log(...items); }
  }

  _log (...items) {
    if (this.verbose) { process.stdout.write(items.join(' - ')); }
  }

  _track(type, key) {
    if (!this._data[key]) { this._data[key] = {}; }
    if (!this._data[key][type]) { this._data[key][type] = 0; }

    this._data[key][type]++;
  }

  _lookup(key) {
    this._track('lookups', key);
  }

  _hit(key) {
    this._log('+');
    this._lookup(key);
    this._track('hits', key);
  }

  _miss(key) {
    this._log('x');
    this._lookup(key);
    this._track('misses', key);
  }
}

module.exports = Cache;
