export default {
  render(h) {
    const router = this.$router;
    const curRoute = router.routeMap[router.current];
    console.log(curRoute);
    return h(curRoute.component);
  },
};
