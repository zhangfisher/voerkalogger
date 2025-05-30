// 使用示例
import { Tree } from "./tree";

const treeData = [
  {
    id: 1,
    label: "Documents",
    children: [
      {
        id: 2,
        label: "Images",
        children: [
          { id: 3, label: "image1.jpg" },
          { id: 4, label: "image2.png" },
        ],
      },
      {
        id: 5,
        label: "Documents",
        children: [
          { id: 6, label: "document1.pdf" },
          { id: 7, label: "document2.docx" },
        ],
      },
    ],
  },
  {
    id: 8,
    label: "Downloads",
    children: [
      { id: 9, label: "file1.zip" },
      { id: 10, label: "file2.exe" },
    ],
  },
];

export default function TreeDemo() {
  return (
    <Tree
      data={treeData}
      onSelect={(node) => {
        console.log("Selected:", node);
      }}
    />
  );
}
