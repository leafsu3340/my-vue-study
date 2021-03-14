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

    // 调用$mount
    if (options.el) {
      this.$mount(options.el);
    }
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

  $mount(el) {
    this.$el = document.querySelector(el);
    // 1.创建组件更新函数
    const updateComponent = () => {
      const { render } = this.$options;
      // vdom版本
      // 2.由render得到vnode
      const vnode = render.call(this, this.$createElement);
      // 3.执行__patch__  diff vnode -> 更新dom
      this._update(vnode);
    };
    // 4.watcher.update函数重新patch下，重新刷新页面
    new Watcher(this, updateComponent); // 关心服务组件是谁，更新函数
  }

  $createElement(tag, props, children) {
    return { tag, props, children };
  }

  _update(vnode) {
    const preVnode = this._vnode;
    if (!preVnode) {
      // init
      this.__patch__(this.$el, vnode);
    } else {
      this.__patch__(preVnode, vnode);
    }
  }

  __patch__(oldVnode, vnode) {
    if (oldVnode.nodeType) {
      const parent = oldVnode.parentElement;
      const refElm = oldVnode.nextSibling;
      // 递归创建真实dom
      const el = this.createElm(vnode);
      parent.insertBefore(el, refElm);
      parent.removeChild(oldVnode);
    } else {
      // update
      // 1.获取要更新的el
      const el = (vnode.el = oldVnode.el);
      // 2.props update
      // 3.chidren update
      const oldCh = oldVnode.children;
      const newCh = vnode.children;
      // text
      if (typeof newCh === "string") {
        if (typeof oldCh === "string") {
          if (newCh !== oldCh) {
            el.textContent = newCh;
          }
        } else {
          // 数组
          el.textContent = newCh;
        }
      } else {
        if (typeof oldCh === "string") {
          el.innerHTML = "";
          newCh.forEach((child) => {
            el.appendChild(this.createElm(child));
          });
        } else {
          this.updateChildren(el, oldCh, newCh);
        }
      }
    }
    // 保存vnode
    this._vnode = vnode;
  }

  updateChildren(parentElm, oldCh, newCh) {
    const len = Math.min(oldCh.length, newCh.length);
    for (let i = 0; i < len; i++) {
      this.__patch__(oldCh[i], newCh[i]);
    }
    if (newCh.length > oldCh.length) {
      newCh.slice(len).forEach((child) => {
        const el = this.createElm(child);
        parentElm.appendChild(el);
      });
    } else if (newCh.length < oldCh.length) {
      oldCh.slice(len).forEach((child) => {
        parentElm.removeChild(child.el);
      });
    }
  }
  // 递归dom创建和追加
  createElm(vnode) {
    // 1.创建根组件
    const el = document.createElement(vnode.tag);
    // 2.处理attrs
    if (vnode.props) {
      for (const key in vnode.props) {
        const value = vnode.props[key];
        el.setAttribute(key, value);
      }
    }
    // 3.处理children
    if (vnode.children) {
      if (typeof vnode.children === "string") {
        el.textContent = vnode.children;
      } else if (Array.isArray(vnode.children)) {
        vnode.children.forEach((child) => {
          const childDom = this.createElm(child);
          el.appendChild(childDom);
        });
      }
    }
    // 4.vnode上保存dom元素便于diff
    vnode.el = el;

    // TODO添加处理自定义组件

    // 5.return dom
    return el;
  }
}

class Watcher {
  constructor(vm, fn) {
    this.$vm = vm;
    this.getter = fn;

    this.get();
  }
  get() {
    // 触发依赖收集
    Dep.target = this;
    this.getter.call(this.vm);
    Dep.target = null;
  }
  update() {
    this.get();
  }
}

class Dep {
  constructor() {
    this.deps = new Set();
  }
  addDep(watcher) {
    this.deps.add(watcher);
  }
  notify() {
    this.deps.forEach((watcher) => watcher.update());
  }
}
