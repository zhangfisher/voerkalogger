# Guide

# String

String functions are directly added to 'String. prototype'. They can be used directly if they need to be imported.

```typescript

import "flex-tools/string"
```

## params

Interpolates a string.

```typescript

"this is {a}+{b}".params({a:1,b:2}) // == this is 1+2
"this is {a}+{b}".params(1,2) // == this is 1+2
"this is {}+{}".params([1,2]) // == // this is 1+2

```
## firstUpper

Change the first letter to uppercase.

```typescript

"abc".firstUpper() // ==Abc

```

## ljust

Output 'width' characters, align the characters to the left, and fill the insufficient parts with 'fillChar'. The default is to fill with spaces.

```typescript

"abc".ljust(10) // "abc "
"abc".ljust(10,"-") // "abc-------"
```
## rjuest

Output 'width' characters, align the characters to the right, and fill the insufficient parts with 'fillChar'. The default is to fill with spaces.

```typescript

"abc".rjust(10) // " abc"
"abc".rjust(10,"-") // "-------abc"
```
## center

Output 'width' characters. The string is centered. The insufficient part is filled with 'fillChar'. The default is to fill with spaces.

```typescript
"abc".rjust(7) // " abc "
"abc".rjust(7,"-") // "--abc--"
```
## trimBeginChars

Truncate characters before a string

```typescript
"abc123xyz".trimBeginChars("abc") // == "123xyz"
//Truncate forward from 123
"abc123xyz".trimBeginChars("123") // == "xyz"
//Truncate only the first character
"abc123xyz".trimBeginChars("123",true) // == "abc123xyz"
```
## trimEndChars

Truncate characters that do not end a string

```typescript

"abc123xyz".trimEndChars("xyz") // == "abc123"
//Truncate backwards starting from 123
"abc123xyz".trimEndChars("123") // == "abc"
//Truncate only the last character
"abc123xyz".trimEndChars("123",true) // == "abc123xyz"

```
# Function Tools

## appleParams

Wrap a function so that the function calls the specified parameters by default.



```typescript



function add(a:number,b:number){

return a + b;

}

let fn = appleParams(add,1,1)

fn() // == add(1,1)

```



## timeout



Wrap an asynchronous function to enable the function to execute timeout.



```typescript

timeout(fn:AsyncFunction, options:{value?:number,default?:any}={}):AsyncFunction

```



**Description**



-The 'value' parameter is used to specify the timeout

-The 'default' parameter is used to specify the value returned by default when timeout occurs.

-If the 'default' parameter is not provided, 'TimeoutError' will be triggered.



## memorize



Wrap a function to remember the result of the last call.



```typescript

function (fn:Function,options:{hash?:((args: any[]) => string) | 'length' | boolean,expires?:number}={hash:false,expires:0})

```



**Description**



-When 'hash=false', 'memory' is invalid.

-When 'hash=true', the result of the last call will be remembered.

-When 'hash=' length '', the structure of the last call will be remembered. When the number of call parameters changes, 'memory' will become invalid.

-When 'hash=(args: any [])=>string', you can dynamically calculate the hash value to determine whether 'memory' is valid.



## noReentry



Wrapping asynchronous functions prohibits reentry.



```typescript

function (fn:Function,options?:{silence?:boolean})

```

## retry



Wrapping asynchronous functions enables error retry.



```typescript

function retry(this:any,fn: Function, options:{count?:number,interval?:number,default?:any}):AsyncFunction

```



**Description**



-The 'count' parameter refers to the number of retries

-The 'interval' parameter refers to the retry interval

-'default 'The default value returned after indicating the error and retrying.

-When an error ending in 'Signal' is triggered by the wrapper function, it means that this is not an error, but a signal passed upward, and no further retries are needed



**Example**



```typescript

async function getData(){

throw new Error()

}



let fn = retry(getData,{count:3,interval:1000})





class AbortSignal extends Error{}

async function getData(){

throw new AbortSignal()

}



let fn = retry(getData,{count:3,interval:1000})

Fn ()//The triggered error ends with Signal, so it will not be retried





```



## reliable



Wrap a function so that it has the functions of 'retry', 'timeout', 'noReentry', 'memory', etc.



```typescript

type reliableOptions={

Timeout: number,//Execution failure timeout, default is 1 second

RetryCount: number,//Number of retries

RetryInterval: number,//Retry interval

NoReentry: boolean,//No reentry

memorize : ((args: any[]) => string) | 'length' | boolean

}

function reliable(fn:AsyncFunction,options:reliableOptions):AsyncFunction

```



#Object Tools



## safeParseJson



When using 'JSON. parse' to solve JSON strings, strict format requirements, such as' JSON. parse ("{a: 1}") ', will fail. Because JSON standards are strict, key names and strings must be wrapped with'... "` The safeParseJson 'method can be more compatible with some non-standard JSON strings.



```typescript

function safeParseJson(str:string)

```





## deepMerge



Depth Merges two objects.



```typescript

deepMerge(toObj:any,formObj:any,options:DeepMergeOptions={array:'noDupMerge'})`

```



The difference between 'low/merge' and 'low/merge' is that the merging mechanism for array members is different. The 'array' parameter can specify how to merge data.



-'array='replace' ': replace the original data item

-'array='merge' ': merge array data items

-'array='noDupMerge' ': merge array data items and de duplicate



## getPropertyNames



Get the list of all the attributes on all the included prototype chains of the specified object



```typescript

function getPropertyNames(obj: any)

```



## forEachObject



Iterate through object members and call the 'callback' function for each member.



```typescript

forEachObject(obj:object | any[],callback:IForEachCallback,options?:ForEachObjectOptions)

interface ForEachObjectOptions{

keys?: String []//Limit only the specified key execution callback

}

type IForEachCallback = ({value,parent,keyOrIndex}:{value?:any,parent?:any[] | object | null,keyOrIndex?:string | number | null})=>any

```



**Description:**



-If the 'ABORT' constant is returned in the 'callback' during the traversal process, the traversal will be aborted.

-The 'keys' parameter can be used to only perform' callback 'on the specified key name`




## forEachUpdateObject



Deep traversal of object members. When the value meets the conditions, call the return value of the 'updater' function to update the value



```typescript

type IForEachCallback = ({value,parent,keyOrIndex}:{value?:any,parent?:any[] | object | null,keyOrIndex?:string | number | null})=>any

function forEachUpdateObject<T=any>(obj:any[] | object,filter:IForEachCallback,updater:IForEachCallback):T

```

**Description:**

-If the 'ABORT' constant is returned in the 'callback' during the traversal process, the traversal will be aborted.

-Example:

```typescript

//Convert all strings to uppercase
let data ={a:1,b:2,l:[1,2,3],c:"xx"}

forEachUpdateObject(data,(value,parent,keyOrIndex)=>{
    return value.toUpperCase()
},(value,parent,keyOrIndex)=>{
    return typeof(value)=="string"
})

``


## mapObject

映射对象值生成新的对象，不支持嵌套

```typescript
export function mapObject<T=any>(obj:Record<string,T>,callback:(value:T,key?:string)=>T,keys?:string[]){
```

**示例**
```typescript
 data = {a:1,b:2}
 mapObject(data,(k,v)=>v+1)   == {a:2,b:2}
```

## searchObject

遍历对象，对每一个成员调用`matcher`,如果`matcher`返回`true`，则返回`picker({value,keyOrIndex,parent})`

```typescript

export type SearchObjectOptions = ForEachObjectOptions & {
    matchOne?:boolean
}
export function searchObject<T=any>(obj:any[] | object,matcher:IForEachCallback,picker?:IForEachCallback,options?:SearchObjectOptions):T | T[]{
```
**说明**

- `matchOne`参数用来指定只搜索匹配一个就退出


**示例**
```typescript
  searchObject({
       a:1，
       b:{x:1,y:2}
  },({value,keyOrIndex,parent})=>{
       return value==2
  },({value,keyOrIndex,parent})=>{
       return keyOrIndex            // 当值=1时返回y
       return value                 // 当值=1时返回{x:1,y:2}
  })
```

## serializeObject

处理对象成为可序列化的数据，基本原理是将对象里面所有不可序列化的项（如函数）删了。

```typescript
function serializableObject(data:any[] | object){
```

## setObjectDefault

使用`src`来为`target`设置默认值。

```typescript
function setObjectDefaultValue(target:any,src:any)
```

**说明**

-  仅当`target`中不存在的key或`target`值为`undefined`时，将`src`中的对应项更新到`target`.

## isDiff

以`baseObj`为基准判断两个对象值是否相同，值不同则返回false 
以`baseObj`为基准的意思是，只对`refObj`中与`baseObj`相同键名的进行对比，允许`refObj`存在不同的键名

```typescript
function isDiff(baseObj:Record<string,any> | [], refObj:Record<string,any> | [],isRecursion:boolean=false):boolean
```

## selfUpdate

根据输入路径和特定的语法更新对象值。例如：`selfUpdate(data,"a","+2") `将`data.a`值`+2`。

```typescript
function selfUpdate(obj:object,path:string,operate:string | string[])
```

**示例**

```typescript

let data
function resetData(){
    data = {
        a:1,
        b:true,
        c:[1,2,3,4],
        d:["a","b","c"],
        e:{
            a:1,b:2
        },
        f:{
            x:"abc",y:"def"
        },
        s:"abc"
    }
}

function assertEqual(expr,expectValue,actualValue){
    if(JSON.stringify(expectValue) == JSON.stringify(actualValue)){
        console.log(expr,"\texpect =",JSON.stringify(expectValue),"\t actual=",JSON.stringify(actualValue))
    }else{
        console.error(expr,"\texpect =",JSON.stringify(expectValue),"\t actual=",JSON.stringify(actualValue))
    }
    resetData()
}

// 数字
selfUpdate(data,"a","+2") ; assertEqual("+2",3,data.a)
selfUpdate(data,"a","-2") ; assertEqual("-2",-1,data.a)
selfUpdate(data,"a","1=-2"); assertEqual("1=-2",-1,data.a)
selfUpdate(data,"a","&2=-2"); assertEqual("&2=-2",1,data.a)
selfUpdate(data,"a",["&2=0","&1=9"]); assertEqual('["&2=0","&1=9"]',9,data.a)
selfUpdate(data,"a","&1=100"); assertEqual('&1=100',100,data.a)
selfUpdate(data,"a","-2") ; assertEqual("-2",-1,data.a)
selfUpdate(data,"a",">1") ; assertEqual(">1",0,data.a)

// 布尔
selfUpdate(data,"b","&false"); assertEqual("&false",false,data.b)
selfUpdate(data,"b","!"); assertEqual("!",false,data.b)

// 字符串
selfUpdate(data,"s","+xyz"); assertEqual("+xyz","abcxyz",data.s)
selfUpdate(data,"s","1=>xyz"); assertEqual("1=>xyz","axyzbc",data.s)
selfUpdate(data,"s","1=-xyz"); assertEqual("1=-xyz","axyz",data.s)

// 数组
selfUpdate(data,"c","1=9"); assertEqual("1=9",[1,9,3,4],data.c)
selfUpdate(data,"c","1=+1"); assertEqual("1=+1",[1,3,3,4],data.c)
selfUpdate(data,"c","1=-1"); assertEqual("1=-1",[1,1,3,4],data.c)
selfUpdate(data,"c","&2=+1"); assertEqual("&2=+1",[1,3,3,4],data.c)  // 将值=2的项+1
selfUpdate(data,"c","1=>1"); assertEqual("1=>1",[1,1,3,4],data.c)

// 字符串数组
selfUpdate(data,"d","1=+1"); assertEqual("1=>1",["a","b1","c"],data.d)
selfUpdate(data,"d","1=>0"); assertEqual("1=>0",["a","0b","c"],data.d)
selfUpdate(data,"d","1=1=+xyz"); assertEqual("1=1=+xyz",["a","bxyz","c"],data.d)

// 对象
selfUpdate(data,"e","a=+1"); assertEqual("a=+1",{a:2,b:2},data.e)
selfUpdate(data,"f","x=+000"); assertEqual("x=+000",{x:"abc000",y:"def"},data.f)
selfUpdate(data,"f","y=1=>000"); assertEqual("y=1+000",{x:"abc",y:"d000ef"},data.f)
```


## mixinProperties

本方法可以用来为类或实例混入属性/方法等

```typescript
function mixinProperties(target:any, source:any,  options?:MixinPropertiesOptions)
 interface MixinPropertiesOptions{
    excludes?: string[]                                             // 排除的字段名称列表
    injectStatic?:boolean                                           // 是否注入静态变量,当source是一个类时,确认如何处理静态变量
    conflict?: ConflictStrategy                                     // 冲突处理策略
}
type ConflictStrategy ='ignore' | 'replace' | 'merge' | 'error' | ((key:string, target:object, source:object)=>'ignore' | 'replace' | 'merge' | 'error' | undefined)
```

**说明**

- `excludes`用来忽略某些字段不进行混入
- `injectStatic`参数用来指定是否将`source`的静态变化注入目标类中
- `conflict`用来处理当混入时名称冲突的处理策略：
    - `ignore`: 忽略该字段
    - `replace`: 替换原始成员
    - `merge`: 如果有目标是数组或{}则进行深度合并。
    - `error`: 触发错误
    - 指定`(key:string, target:object, source:object)=>'ignore' | 'replace' | 'merge' | 'error' | undefined`函数来动态指定冲突处理策略。

## hasCircularRef

返回指定的对象是否存在循环引用。

# 树工具

树数据结构是非常常见的，比较常见的有两种数据结构来表示树。

```typescript
// 嵌套树结构
const tree = {
    id:1,
    name:"a",
    children:[
        {id:2,name:"b"},
        {id:3,name:"c"}
    ]
}
// pid树结构
const tree = [
    [id:1,pid:null,name:"a"],
    [id:2,pid:1,name:"b"],
    [id:3,pid:1,name:"c"],
]
```

两种树结构各有优缺点,在实际项目均有应用,我们提供了一系工具函数来处理树结构。

为了提供统一的树操作体验，我们约定：

- 每一个树节点均具有唯一ID
- 每一个树节点均具有可选的`children`字段数组来用表示子节点
- 如果约定`id`、`children`字段名称不符合要求同，以下大部份的API均可以通过`options.idKey`和`options.childrenKey`来指定这两个核心字段的键名称。
- `id`、`children`字段也支持通过泛型指定字段名称.

## getById

通过节点Id返回节点数据

```typescript
getById<Node extends TreeNode = TreeNode,IdKey extends string = "id">(treeObj:Node | Node[],nodeId:Node[IdKey],options?:GetByIdOptions):Node | null  
```

## getByPath

通过路径名称（如`a/b/c`）返回指定的节点对象。

```typescript
function getByPath<Node extends TreeNode = TreeNode>(treeObj:Node | Node[],fullpath: string,options?:GetByPathOptions):Node | undefined 
```

**示例**

```typescript
const tree = {
    id:1,
    name:"a",
    children:[
        {id:2,name:"b"},
        {id:3,name:"c"}
    ]
} 
getByPath(treeData,"a/b")           // == {id:2,name:"b"
// 指定路径采用id值进行组合
getByPath(treeData,"1/2",{pathKey:"id"})           // == {id:2,name:"b"
```

## forEachTree

遍历树节点。

```typescript
function forEachTree<Node extends TreeNodeBase = TreeNode>(treeData:Node[] | Node,callback:IForEachTreeCallback<Node>,options?:ForEachTreeOptions)
interface ForEachTreeOptions extends TreeNodeOptions{
    startId?:string | number | null                 // 从哪一个节点id开始进行遍历
 }
type IForEachTreeCallback<Node> = ({node,level,parent,path,index}:{node:Node,level:number,parent:Node | null,path:string,index:number})=> any

```

**说明**

- 遍历过程中可以在`callback`中返回`ABORT`来中止遍历。
- `callback`提供四个参数，分别是`node=<当前节点>`,`level=<节点层级>`,`parent=<父节点>`,`path=<当前节点的路径>`,`index=<子节点序号>`}。
-  `startId`参数可以用来指定遍历起点。

## mapTree

转换树结构。

```typescript
function mapTree<FromNode extends TreeNodeBase = TreeNode,ToNode extends TreeNodeBase = FromNode>(treeData:FromNode[] | FromNode,mapper:ITreeNodeMapper<FromNode,ToNode>,options?:MapTreeOptions):ToNode[] | ToNode

type ITreeNodeMapper<FromNode,ToNode> = ({node,parent,level,path,index}:{node:FromNode,parent:FromNode | null,level:number,path:any[],index:number})=>ToNode

interface MapTreeOptions extends TreeNodeOptions{
    from?:{
        idKey?:string,childrenKey?:string
    }
    to?:{
        idKey?:string,childrenKey?:string
    }
}
```

**示例**

```typescript
    type mapedBook = TreeNode<{ key: string; name: string; level: number; path: string},'key','books'>
    let mapedTree = mapTree<Book,mapedBook >(
        Object.assign({}, books),
        ({ node, level, parent, path }) => {
            return {
                key:String(node.id),
                name: node.title,
                level: level,
                path: path.join("/")
            }
        }, { 
            pathKey: "title",
            to:{
                idKey:'key',childrenKey:"books"
            } 
        }) as mapedBook

```

## searchTree

遍历树的每一个节点，执行`mather({node,level,parent,path,index})`，如果返回`true`，则调用`picker({node,level,parent,path,index})`函数返回结果

```typescript
function serachTree<Node extends TreeNode=TreeNode,Returns=Node[]>(treeData:Node[] | Node,matcher:IForEachTreeCallback<Node>,picker?:IForEachTreeCallback<Node>,options?:SerachTreeOptions):Returns[]
interface SerachTreeOptions extends TreeNodeOptions,ForEachTreeOptions {
    matchOne?:boolean               //   只匹配一个就退出搜索
}
```

## removeTreeNodes

删除满足条件的节点

```typescript
function removeTreeNodes<Node extends TreeNode>(treeObj:Node | Node[],matcher:IForEachTreeCallback<Node>,options?:RemoveTreeNodes):void  
```

**说明**

- 当`mather`函数返回`true`时，删除该节点。
- 当`mather`函数返回`ABORT`时，中止遍历过程。

## toPidTree

将嵌套树结构转换为PID结构。

```typescript
function toPidTree<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
>(treeObj:FromNode | FromNode[],options?:ToPidTreeOptions<FromNode,ToNode,IdKey,ChildrenKey>):PidTreeNode<Omit<ToNode,ChildrenKey>,IdKey>[]

interface ToPidTreeOptions<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
> extends TreeNodeOptions{
     includeLevel?: boolean
     includePath?: boolean
     mapper?:({node,level,parent,path,index}:{node:FromNode,level:number,parent:FromNode | null,path:string,index:number}) => Omit<ToNode,ChildrenKey | IdKey>
 }
```
**说明**

-  转换时可选指定`mapper`函数，用来返回新的节点数据
- 当`includePath=true`时，在目标节点中包括path节点路径
- 当`includeLevel=true`时，在目标节点中包括节点层级


**示例**

```typescript
    // 节点数据结构一致
    let nodes = toPidTree<Book>(books,{includePath:true})    
    
    // 转换为不同的数据结构
    type StoryBook = TreeNode<{
        name: string,
        publisher: string,
    }>    
    let storyNodes = toPidTree<Book,StoryBook>(books,{
        includePath:true,
        mapper:({node,level})=>{
            return {               
                name:node.title,
                publisher:`MEEYI ${level}` 
            }
        }
    })
```

## fromPidTree

将PID树结构转换为嵌套树结构。

```typescript
function fromPidTree<
    FromNode extends PidTreeNode = PidTreeNode,
    ToNode extends TreeNode = TreeNode<Omit<FromNode,'pid'>>,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
    >(pidNodes:FromNode[],options?:FromPidTreeOptions<FromNode,ToNode,IdKey,ChildrenKey>):ToNode[]   

interface FromPidTreeOptions<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
> extends TreeNodeOptions{ 
     mapper?:(node:FromNode) => ToNode
 }
```

**说明**:
- 默认情况下转换为保持原节点的所有数据
- 可以通过`mapper`函数来返回新的节点数据.

## getTreeNodeInfo

获取节点基本信息，包括节点数据、父节点、路径、层级、和子节点序号。

```typescript
interface TreeNodeInfo<Node>{
    node:Node
    parent:Node | undefined | null
    path:string
    level:number
    index:number
}
export function getTreeNodeInfo<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],nodeId: Node[IdKey],options?:GetTreeNodeInfoOptions):TreeNodeInfo<Node> | undefined 
```


## getTreeNodeRelation

返回两个节点之间的关系。

```typescript
enum TreeNodeRelation{
    Same = 0,                               // 相同节点
    Child = 1,                              // 子节点
    Parent = 2,                             // 父节点     
    Descendants = 3,                        // 后代    
    Ancestors = 4,                          // 祖先
    Sibling = 5,                            // 兄弟节点    
    Unknown = 9                             // 未知
}
export function getTreeNodeRelation<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],nodeId:Node[IdKey],refNodeId:Node[IdKey],options?:GetTreeNodeRelationOptions):TreeNodeRelation
   
```
## moveTreeNode

移动节点到新的位置。

```typescript
enum MoveTreeNodePosition{
    LastChild = 0,                           // 移动为目标节点的最后一个子节点
    FirstChild = 1,                          //
    Next= 2,                                 //  下一个兄弟节点
    Previous = 3                             // 上一个兄弟
}

function moveTreeNode<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],fromNodeId: Node[IdKey],toNodeId:Node[IdKey],pos:MoveTreeNodePosition=MoveTreeNodePosition.LastChild, options?:MoveTreeNodeOptions):void   
```

## getRelatedTreeNode

获取指定节点的关联节点。

```typescript
enum RelatedTreeNode{
    Parent = 1,
    Next = 2,
    Previous = 3 
}
function getRelatedTreeNode<Node extends TreeNode = TreeNode,IdKey extends string = 'id' 
>(treeObj: Node | Node[],nodeId:Node[IdKey],pos:RelatedTreeNode , options?:GetRelatedTreeNodeOptions):Node | null   
```

## FlexTree

`FlexTree`是一个树结构类

```typescript

class FlexTree{
    constructor(nodes:Node[] | Node,options:FlexTreeOptions<Node,IdKey>)
    get root(): Node | undefined
    get nodes(): Node[]
    getNode(nodeId:Node[IdKey]):Node | null
    addNode(nodeData: Partial<Node> ,refNodeId:Node[IdKey],pos:MoveTreeNodePosition = MoveTreeNodePosition.LastChild):Node 
    removeNode(nodeId:Node[IdKey]):void 
    moveNode(nodeId: Node[IdKey],refNodeId:Node[IdKey],pos:MoveTreeNodePosition)
    search(matcher:IForEachTreeCallback<Node>,picker?:IForEachTreeCallback<Node>,options?:SerachTreeOptions)
}

// 遍历节点
let tree = new FlexTree({
    id:1,
    title:"a",
    children: [
        {id:2},
        {id:3}
    ]
})
for(let node of nodes){
    console.log(node)
}

```




# 类工具

## getClassStaticValue

获取当前实例或类的静态变量值.

```typescript
function getClassStaticValue(instanceOrClass:object,fieldName:string,options:{merge?: number,default?:any}={})
```

**说明**:

- `getClassStaticValue`会遍历继承链上的所有静态变量，如果值是`{}`或`数组`，则会进行**合并**。


**示例**:

```typescript
 
calss A{
   static settings={a:1}
}
calss A1 extends A{
    static settings={b:2}
}
 
getStaticFieldValue(new A1(),"settings") //==== {a:1,b:2} 
 ```

## isPropertyMethod

返回指定名称的方法是否是一个属性，即（GET、SET）

```typescript
function isPropertyMethod(inst:object, name:string)
```

# 异步工具
## delay

延迟一段时间。

```typescript
 async function delay(ms: number)
```

## delayRejected

延迟一段时间，当超时时会触发错误。

```typescript
 async function delayRejected(ms: number,rejectValue?:any)
```

## delayRejected

## asyncSignal

开发中经常碰到需要在某些异步任务完成后做点什么的场景，`asyncSignal`用来生成一个异步控制信号，可以侦听该异步信号的`resolve/reject`，其本质上是对`Promise`的简单封装。

- **使用方法**

```typescript

// 第一步：创建异步信号
import {asyncSignal,IAsyncSignal} from "flex-tools";
let signal = asyncSignal()

// 第2步：等待异步信号Resolve或Rejected
await signal()
// 第3步：在其他地方Resolve或Rejected异步信号，例 
 
setTimeout(() =>{
    signal.resolve(result?:any)
    signal.reject(e?:Error | string);
},100)
```

- **说明**

> asyncSignal(constraint?:Function,options?:{timeout:number}={timeout:0})


    - 每个异步信号均具一个唯一的ID，即`signal.id`
    - `asyncSignal`可以在被`resolve`或`reject`后，再次`await signal()`反复使用。
    - 创建`asyncSignal`可以指定一个`约束条件函数`，当调用`signal.reject()`或`signal.resolve()`时，需要**同时满足约束条件函数返回true**，signal才会被`resolve/reject`。如:
    
    ```typescript
        // 
        
        let signal = asyncSignal(()=>{
            return true
        })
    ```
    - 创建`asyncSignal`可以指定一个`timeout`参数，如果当`await signal()`超时会自动`rejected`。
    - `signal.destroy()`可以销毁信号
    - 在调用`await signal(timeout)`可以指定额外的超时。


- **API**

```typescript
signal.id    // 标识
// 信号被销毁时，产生一个中止错误，信号的使用者可以据此进行善后处理
signal.destroy() 
// 重置异步信号
signal.reset()    
// 返回异步信号的状态值
signal.isResolved() 
signal.isRejected()
signal.isPending()

```

- **示例**

**以下是一个例子使用`asyncSignal`的简单例子：**

```typescript
import {asyncSignal,IAsyncSignal} from "flex-decorators/asyncSignal";

let signal = asyncSignal()

class Queue{
    signal:IAsyncSignal
    buffer:number[]=[]
    constructor(){
        // 创建信号
        this.signal =  asyncSignal()
    }
    async start(){
        setTimeout(()=>{
            while(true){
                let data = await this.pop()
                //处理数据
            }
        },0)

    }
    async pop(){
        if(this.buffer.length > 0) return this.buffer.shift()
        // 等待有数据，返回的是一个Promise
        await this.signal()
    }
    push(data){
        this.buffer.push(data)
        // 当有数据时通过异步信号
        this.signal.resolve()
    }

}

```


## AsyncSignalManager

对`asyncSignal`的简单封装，用来管理多个异步信号，并确保能正确`resolve`和`reject`。

```typescript

let signals = new AsyncSignalManager({
    // 所有信号均在1分钟后自动超时，0代表不设超时，并且此值应该大于signal(timeout)时指定的超时值
    timeout:60 * 1000               
})
  
let signal= signals.create()   、、创建一个asyncSignal

signals.destroy()   //销毁所有异步信号
signals.resolve()    //resolve所有异步信号
signals.reject()     //reject所有异步信号
signals.reset()      //reset所有异步信号

```


# 事件工具

## FlexEvent

一个简单的事件发生器，可以用来替代`eventemitter2`。

- **使用方法**

```typescript
import { FlexEvent } from "flex-tools"

let events = new FlexEvent({
    context?: any               // 可选的上下文对象，当指定时作为订阅者的this
    ignoreError?: boolean       // 是否忽略订阅者的执行错误  
    wildcard?: boolean          // 是否启用通配符订阅  
    delimiter?:string           // 当启用通配符时的事件分割符
})

// 订阅事件
let listenerId = events.on("<事件名称>",callback)              // 订阅事件
let listenerId = events.once("<事件名称>",callback)            // 只订阅一次
let listener = events.on("<事件名称>",callback,{objectify:true}) 
listener.off() //退订
// 退订
events.off(listenerId)
events.off("<事件名称>",callback)             // 退订事件
events.off("<事件名称>")             // 退订事件
events.offAll()                               // 退订所有事件


events.getListeners()                         //  返回所有侦听器
events.emit(event:string,...args:any[])       // 触发事件
events.emitAsync(event:string,...args:any[])  // 使用Promise.allSettled触发事件
await events.waitFor(event:string)             // 等待某个事件触发

// 通配符

events.on("a/*",callback)
events.emit("a/b")                  // 匹配触发

events.on("a/*/c",callback)
events.emit("a/b/c")                  // 匹配触发
events.emit("a/x/c")                  // 匹配触发

events.on("a/**/x",callback)
events.emit("a/b/c/x")              // 匹配触发
events.emit("a/b/x")                // 匹配触发
events.emit("a/b/c/d/e/x")          // 匹配触发

```
 
- **说明**

    - 构建`FlexEvent`时可以指定`context`参数作为订阅函数的`this`
    - 事件订阅支持通配符，可能通过`wildcard=false`来关闭此功能。



# 数据容器

## dictArray
 
 构建一个成员是`{...}`的数组。

 
```typescript
function dictArray<Item>(items:any[],defaultItem:Partial<Item> & {default?:boolean},options?:DictArrayOptions){
interface  DictArrayOptions{
    defaultField:string             // 声明默认字段，允许在items里面只写默认字段而不用完整的{}
    includeDefaultField:boolean     // 如果此值=true，则会为每一个item增加一个default字段，并且保证整个items里面至少有一项default=true
}
```

**说明**

- 每一项均是一个`{}`
- 数组成员可以指定默认字段，比如`defaultField='name`，则
  [{name:"xx“，...},{name:"",},"tom",{name:"",...}]，在进行处理后将变成[{name:"xx“，...},{name:"",},{name:"tom",..默认项.},{name:"",...}]
- 如果输入的是`{}`，则转换成[{..}]
- 如果是其他非`{}`和Array，则按省略项进行处理，如dictArray("tom")==> [{name:"tom",..默认项.}]
- 可以指定其中的一个为`default=true`
- 可以指定默认成员值


## NamedDict

构建一个`{[name]:{....},[name]:{....},...}`对象容器.

```typescript
interface NamedDictOptions{
    requires?          : string[]                           // item项必选字段名称列表
    // item名称键名,代表名称是从item[nameKey]提取,如果是class:name代表是由item.class字段的name提取，当然，此时item.class必须是一个对象或者是{}才行
    nameKey?           : string                             
    // 忽略无效项，如果=false则会触发错误，否则会直接无视
    ignoreInvalidItems?: boolean                            
    // 正常情况下定义一个命名容器是[{name,...},{name:...},....{}]
    // 某些情况下允许采用缩写形式，如[AClass,BClass,....],这样存在命名容器没有名称的问题,这种情况下
    // 可以指定default="class"，代表缩写的是成员的class字段值
    // 然后再从AClass[nameKey],BClass[nameKey]提取名称
    // 默认项名称，比如default=“class"，代表可以不需要输入完整的{}，而只输入class，在这种情况下，名称只能从其中提取
    default           : string,                                    
    normalize         : (item:any)=>any                            // 提供一个函数normalize(item)用来对成员项进行规范化处理
}

function NamedDict<T>(items: any[], defaultItem?:T, options?:NamedDictOptions):Record<string,T>
```

**说明**

- 容器的数据项均具有一个唯一的名称，一般是具有一个`name`的字段
- 数据项里面有些字段是必须的，不能为空：即不能是`null`,`undefined`
- 支持两种构造方法，即NamedDict([{name,...},{name,...}...])和NamedDict({name:{...},name:{...}})
- 支持为每一项指定默认值
- 提供一个函数`normalize(item)`用来对成员项进行规范化处理
- `default`和`nameKey`两个参数配合用来指定如何提取成员名称。

```typescript

class A{}
class B{}
class C{}

let dict = NamedDict([
    {class:A},              
    {name:"AA",class:A},
    B,                          // 简写模式
    C
],{
    default:'class',        // 如果没有指定name，则从class中提取名称
    nameKey:'name'          // 代表name是成员名称
})

// 以上代成员名称

{
    A:{name:"A",class:"A"},
    AA:{name:"AA",class:"A"},
    B:{name:"B",class:B},
    C:{name:"C",class:C}
}

```