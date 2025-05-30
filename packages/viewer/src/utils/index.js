export function getFileExtension(filename) {
  // 获取文件名中最后一个点(.)之后的部分
  const extension = filename.split(".").pop();
  return extension;
}
