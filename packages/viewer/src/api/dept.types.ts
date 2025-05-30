export interface Dept {
    id: number;
    title: string;
    name: string;
    [props: string]: any;
}
export interface TreeView {
    children?: TreeView[];
}
export interface DeptTreeView extends TreeView {
    id: number;
    title: string;
    name: string;
    [props: string]: any;
}
