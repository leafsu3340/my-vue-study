import Link from './Link';
import View from './View';

let Vue = null;

class VueRouter {
  constructor(options) {
    this.$options = options;

    this.routeMap = this.$options.routes.reduce((acc, cur) => {
      acc[cur.path] = cur;
      return acc;
    }, {})

    const initial = window.location.hash.slice(1) || '/';
    Vue.util.defineReactive(this, 'current', initial)
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    // window.addEventListener('load', this.onHashChange.bind(this))
  }

  onHashChange() {
    console.log(window.location.hash)
    this.current = window.location.hash.slice(1) || '/';
  }

  // TODO 为何install不能写在class内
  // install (_Vue) {
  //   Vue = _Vue;
  //   // 挂载$router
  //   Vue.mixin({
  //     beforeCreate() {
  //       if (this.$options.router) {
  //         Vue.prototype.$router = this.$options.router;
  //       }
  //     }
  //   })
  //   Vue.component('router-view', View)
  //   Vue.component('router-link', Link)
  // }

  
}

VueRouter.install = (_Vue) => {
  Vue = _Vue;
  // 挂载$router
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    }
  })

  Vue.component('router-view', View)
  Vue.component('router-link', Link)
}

export default VueRouter;
