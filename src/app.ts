export const dva = {
  config: {
    onError(err: ErrorEvent) {
      err.preventDefault();
      // tslint:disable-next-line:no-console
      console.error(err.message);
    },
  },
};

// export function onRouteChange({ location, routes, action }) {
//   console.log('onRouteChange -> location, routes, action', location, routes, action);
// }

// let extraRoutes: any;

// export function patchRoutes({ routes }) {
//   merge(routes, extraRoutes);
// }

// export function render() {
//   fetch('http://192.168.0.178:8000/baseApi/sys/route').then(res => {
//     console.log('render -> res', res);
//   });
// }
