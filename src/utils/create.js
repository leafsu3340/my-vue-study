import Vue from "vue";

export default function(Component, props) {
  // 1.方案1
  const Cotur = Vue.extend(Component);
  const comp = new Cotur({propsData: props}).$mount()   // Vue.extend返回组件的构造函数
  // 2.方案2，借鸡生蛋
  // const vm = new Vue({
  //   render: (h) => {
  //     return h(Component, { props });
  //   },
  // }).$mount();

  document.body.appendChild(comp.$el);

  // 获取组件实例
  // vm.$root // 根实例
  // const comp = vm.$children[0]; // 根组件实例

  // 给一个淘汰方法
  comp.remove = () => {
    document.body.removeChild(comp.$el);
    comp.$destroy();
  };

  // 返回一个组件实例
  return comp;
}
