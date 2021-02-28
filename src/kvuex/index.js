let Vue = null;

class Store {
  constructor(options = {}) {
    this._mutations = options.mutations || {};
    this._actions = options.actions || {};
    this._gettersFn = options.getters || {};

    // 绑定this
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);

    // getters
    let partial = (fn, arg) => {
      return function() {
        const { state } = arg;
        return fn(state);
      };
    };

    this._getters = {};
    const setters = {};
    for (const key in this._gettersFn) {
      setters[key] = partial(this._gettersFn[key], this);
      Object.defineProperty(this._getters, key, {
        get: () => this._vm[key],
        enumerable: true,
      });
    }

    this._vm = new Vue({
      data() {
        return {
          $$state: options.state || {},
        };
      },
      computed: setters,
    });
  }

  get state() {
    return this._vm._data.$$state;
  }

  set state(v) {
    console.error("please use mutations to reset state");
  }

  get getters() {
    return this._getters;
  }

  commit(type, payload) {
    // 获取type对应的mutation
    const entry = this._mutations[type];
    if (!entry) {
      console.error("err: no such mutations!");
      return;
    }

    entry(this.state, payload);
  }

  dispatch(type, payload) {
    const entry = this._actions[type];
    if (!entry) {
      console.error("err: no such actions!");
      return;
    }
    // 异步结果处理常常需要返回Promise
    return entry(this, payload);
  }
}

function install(_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

export default { Store, install };
