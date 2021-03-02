// 注意val用法，思考闭包使用场景
function defineReactive(obj, key, val) {
  observe(val);

  // 创建对应的Dep
  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      console.log("get", val);
      Dep.target && dep.addDep(Dep.target);

      return val;
    },
    set(newVal) {
      console.log("set", val);
      if (val !== newVal) {
        observe(newVal);
        val = newVal;

        dep.notify();
      }
    },
  });
}

function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return;
  }
  // 对obj做响应式处理
  new Observer(obj);
}

class Observer {
  constructor(value) {
    if (Array.isArray(value)) {
      // todo: 数组响应式
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
}

class KVue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;

    this.proxy(this);

    observe(this.$data);

    new Compile(options.el, this);
  }

  proxy(vm) {
    Object.keys(vm.$data).forEach((key) => {
      Object.defineProperty(vm, key, {
        get() {
          return vm.$data[key];
        },
        set(val) {
          vm.$data[key] = val;
        },
      });
    });
  }
}

class Compile {
  constructor(el, vm) {
    this.$vm = vm;

    this.$el = document.querySelector(el);
    if (this.$el) {
      this.compile(this.$el);
    }
  }

  compile(el) {
    // 递归遍历
    el.childNodes.forEach((node) => {
      if (node.nodeType == 1) {
        // 元素节点
        this.compileElement(node);
        // 递归  注意此处需要递归
        if (node.childNodes.length > 0) {
          this.compile(node);
        }
      }
      if (this.isInter(node)) {
        this.compileText(node);
      }
    });
  }

  compileElement(node) {
    let nodeAttrs = node.attributes;
    Array.from(nodeAttrs).forEach((attr) => {
      console.log(attr);
      const attrName = attr.name;
      const exp = attr.value;
      if (this.isDir(attrName)) {
        const dir = attrName.substring(2);
        this[dir] && this[dir](node, exp);
      }
      // 1.实现@click事件
      if (this.isEvent(attrName)) {
        // 默认事件是click事件
        const vmIns = this.$vm;
        node.addEventListener("click", function() {
          console.log(exp, vmIns);
          const fn = vmIns.$options.methods[exp];
          fn && fn.call(vmIns);
        });
      }
      // 2.实现v-model
      if (attrName === "k-model") {
        this.input(node, exp);

        const vmIns = this.$vm;
        node.addEventListener("input", function(e) {
          const val = e.target.value;
          console.log(e);
          vmIns[exp] = val;
        });
      }
    });
  }

  isEvent(attr) {
    return attr.startsWith("@");
  }

  text(node, exp) {
    this.update(node, exp, "text");
  }

  html(node, exp) {
    this.update(node, exp, "html");
  }

  input(node, exp) {
    this.update(node, exp, "input");
  }  

  isDir(attr) {
    return attr.startsWith("k-");
  }

  isInter(node) {
    console.log(node.nodeType, node.textContent);
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }

  compileText(node) {
    console.log("RegExp", RegExp.$1);
    this.update(node, RegExp.$1, "text");
  }

  update(node, exp, dir) {
    // 1.init
    const fn = this[dir + "Updater"];
    fn && fn(node, this.$vm[exp]);

    new Watcher(this.$vm, exp, function(val) {
      fn && fn(node, val);
    });
  }

  textUpdater(node, val) {
    node.textContent = val;
  }

  htmlUpdater(node, val) {
    node.innerHTML = val;
  }

  inputUpdater(node, val) {
    node.value = val;
  }
}

class Watcher {
  constructor(vm, key, updater) {
    this.$vm = vm;
    this.updater = updater;
    this.key = key;

    // 尝试读取key，触发依赖收集  通过全局Dep.target传送watcher
    Dep.target = this;
    this.$vm[this.key];
    Dep.target = null;
  }
  update() {
    this.updater.call(this.$vm, this.$vm[this.key]);
  }
}

class Dep {
  constructor() {
    this.deps = [];
  }
  addDep(watcher) {
    this.deps.push(watcher);
  }
  notify() {
    this.deps.forEach((watcher) => watcher.update());
  }
}
