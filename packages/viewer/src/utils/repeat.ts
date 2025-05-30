// 重复
export function repeat(func: Function, times: number, signal?: AbortSignal) {
  function execute() {
    if (signal && signal?.aborted) {
      return;
    }
    func();
  }
  for (let i = 0; i < times; i++) {
    execute();
  }
}
