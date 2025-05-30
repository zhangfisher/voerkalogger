import { module, Module } from '@voerka/react';
import { computed } from '@autostorejs/react';
import { markObject } from '../call/markObject';
class UU {}
class User extends UU {
  a = 500;
  get b() {
    return this.a;
  }
}
class Test {
  a = 1;
  b = 2;
  nested = {
    a: 1,
  };
  propFun = () => {
    return 123;
  };
  computeProp = computed(
    (scope: any) => {
      return scope.a + scope.b;
    },
    ['./a', './b'],
  );
  nestedObj = new User();
  get c() {
    return this.a + this.b;
  }
  map = new Map();

  d() {
    console.log('123123123', this);
  }
}

function Obj2() {
  // @ts-ignore
  this.a = 1;
}

// 在 Obj2 的原型上添加属性 b
Obj2.prototype.b = 2;
// @ts-ignore
const obj2 = new Obj2();

console.log(obj2.a); // 输出：1
console.log(obj2.b); // 输出：2（通过原型链访问）
console.log(Object.getPrototypeOf(obj2)); // 输出：{ b: 2 }
@module({ observable: true, id: 'test' })
export class TestModule extends Module {
  state = {
    a: 1,
    b: 2,
    obj: markObject(new Test()),
    // obj2: markObject(obj2),
    // nest: {
    //   a: 1,
    //   b: 2,
    computeProp: computed(
      (scope: any) => {
        console.log(`scope`, scope);
        return scope.a + scope.b;
      },
      ['./a', './b'],
    ),
    // },
  };
  changeObjNestedObjValue() {
    // this.state.obj.nestedObj.a = 100;
  }
}
