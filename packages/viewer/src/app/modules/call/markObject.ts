import { isComputedDescriptorParameter, isPlainObject, markRaw } from '@autostorejs/react';
export interface MarkObjectOptions {
  onlyOwn?: boolean;
}
export function markObject(root: any, filterKeys?: string[], options?: MarkObjectOptions) {
  // 只有对象需要这样处理
  if (typeof root !== 'object' || root === null) {
    return root;
  }
  const { onlyOwn = true } = options || {};
  // entries 会枚举属性,
  // 但不包括function,
  // 包括了继承过来的属性
  const keys = Object.keys(root); //
  keys.forEach((key) => {
    //此处为排除代理
    if (!filterKeys) {
      // 约定以 _ 开头的属性无需代理
      if (!key.startsWith('_')) {
        if (isPrimitive(root[key])) {
          return;
        }
        // public 的代理
        // 如果是复杂对象不代理
        if (isPlainObject(root[key])) {
          const proto = Object.getPrototypeOf(root);
          if (proto === Object.prototype) {
            return; // 字面量的对象
          }
          // 这里包括了 new User() 还有 {xxx}
          return markRaw(root[key]);
        }
        // computed 需要代理
        if (isComputedDescriptorParameter(root[key])) {
          console.log(`isComputedDescriptorParameter`, key);
          return;
        }
      }
      // 这里应该有各种函数
      root[key] = markRaw(root[key]);
    } else if (!filterKeys.includes(key)) {
      // 除了过滤的
      markRaw(root[key]);
    }
  });
  // 原型上的方法就不包装了
  if (!onlyOwn) {
    return root;
  }
  // 除了排除可枚举的属性,还需要排除不可枚举的属性
  // 比如 get set 等
  // 比如原型的普通函数
  // 比如获取对象的原型
  const proto = Object.getPrototypeOf(root);
  // 普通字面量对象就不markRaw了 不然会全部markRaw(因为Object是所有对象的原型)
  if (proto === Object.prototype) {
    return root;
  }
  const propertyNames = Object.getOwnPropertyNames(proto);
  propertyNames.forEach((key) => {
    // console.log(`key`, key);
    //此处为排除代理
    if (!filterKeys) {
      // 约定以 _ 开头的属性无需代理
      if (!key.startsWith('_')) {
        if (isPrimitive(root[key])) {
          return;
        }
        if (isPlainObject(root[key])) {
          // public 的代理
          // 这里包括了 new User() 还有 {xxx}
          // {xxx}代理
          const proto = Object.getPrototypeOf(root);
          if (proto === Object.prototype) {
            return; // 字面量的对象
          }
          //new User() 之列的不再代理(理论上应该继续层层 markObject)
          return markRaw(root[key]);
        }
        // 复杂对象处理 (map set )
        // computed 需要代理
        if (isComputedDescriptorParameter(root[key])) {
          return;
        }
      }
      markRaw(root[key]);
    } else if (!filterKeys.includes(key)) {
      // 指定代理模式
      markRaw(root[key]);
    }
  });
  return root;
}
function isPrimitive(value: any) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    typeof value === 'symbol' ||
    typeof value === 'bigint' ||
    value === null
  );
}
