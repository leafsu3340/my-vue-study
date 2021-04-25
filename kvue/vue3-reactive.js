const isObject = (v) => typeof v === "object";

function reactive(obj) {
  if (!isObject(obj)) {
    return;
  }
  return new Proxy(obj, {
    get(target, key) {
      const res = Reflect.get(target, key);
      track(target, key);
      return isObject(res) ? reactive(res) : res;
    },
    set(target, key, val) {
      const res = Reflect.set(target, key, val);
      trigger(target, key);
      return res;
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key);
      trigger(target, key);
      return res;
    },
  });
}

const targetMap = new WeakMap();

function track(target, key) {
  const effect = effectStack[effectStack.length - 1];

  if (effect) {
    let depMap = targetMap.get(target);
    if (!depMap) {
      depMap = new Map();
      targetMap.set(target, depMap);
    }

    depMap = targetMap.get(target);
    let deps = depMap.get(key);
    if (!deps) {
      deps = new Set();
      depMap.set(key, deps);
    }

    deps.add(effect);
  }
}

function trigger(target, key) {
  const depMap = targetMap.get(target);

  if (!depMap) {
    return;
  }

  const deps = depMap.get(key);
  deps.forEach((dep) => {
    dep();
  });
}

const effectStack = [];

function effect(cb) {
  const e = createReactiveEffect(cb);
  e();
  return e;
}

function createReactiveEffect(fn) {
  const effect = function reactiveEffect() {
    try {
      effectStack.push(effect);
      return fn();
    } catch (error) {
    } finally {
      effectStack.pop();
    }
  };
  return effect;
}
