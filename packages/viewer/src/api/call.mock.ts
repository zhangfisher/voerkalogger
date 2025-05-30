// 模拟的通讯录数据
const mockContacts: Contact[] = [
  {
    tags: ["star"],
    remark: "",
    id: "",
    title: "",
    deleted: false,
    disabled: false,
    // appId: "",
    role: "user",
    orgId: 0,
    groups: ""
  },
];
import { Contact } from "@/types/contacts.types";
import { createAlovaMockAdapter, Method } from "@alova/mock";

export const contactsMock = createAlovaMockAdapter(({ onSuccess }) => {
  onSuccess(mockContacts);
});
