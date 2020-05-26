/*
 * @Date: 2020-05-04 23:02:07
 * @LastEditTime: 2020-05-23 17:39:09
 */ 
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
function accAdd(arg1, arg2) {
  var r1, r2, m;

  try {
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }

  try {
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }

  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

Number.prototype.add = function(arg) {
  return accAdd(arg, this);
};
