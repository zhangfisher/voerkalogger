// filter
import dayjs from "dayjs";

export const timeFilter = (val) => dayjs(val).format("YYYY-MM-DD HH:mm:ss");
export const dateFilter = (val) => dayjs(val).format("YYYY-MM-DD");
export const unlimitedFilter = (val) => (val * 1 === -1 ? "不限" : val);
export const unlimitedTimeFilter = (val) =>
  val === "2999-12-31" ? "永久" : val;
