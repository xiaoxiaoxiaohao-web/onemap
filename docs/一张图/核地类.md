# 核地类前端开发文档

中山自然资源项目核地类开发文档

- 代码目录--src/views/onemapApplication/HDLTool

## 一、查询条件选择部分

查询条件选择部分包括了如下功能：

1. 核查类型选择
2. 项目红线选择
3. 线状地物选择

### 1.核查类型选择

功能描述：核查类型选择包括了1.单年份核查、2.地块追溯
- 绑定参数：<code style="color:green">"topType1"</code>
- 1.单年份核查
  - 
- 2.地块追溯

### 2.项目红线选择

一键还原按钮调用了其他部分的还原功能，进行了一次性还原

- 根据方法 "isShowReductionWinCheck" 控制，div "class='layer-btn-right'"

### 3.线状地物选择

图层搜索根据连续汉字匹配的方式，对饮用水、地表水、其他图层、已选图层的内容进行筛选

- 绑定的数据为 "keyWord" ，div "class='search'"

## 二、查询结果表格展示部分

查询结果表格展示部分包括了如下功能：

1. 查询结果以表格的形式展示
2. 地块追溯查询结果可以追溯年份

### 1.查询结果以表格的形式展示

菜单栏显隐按钮对左侧菜单栏进行显隐控制

- 根据参数 "showLayer" 控制，div "class='layer-btn'"

### 2.地块追溯查询结果可以追溯年份
一键还原按钮调用了其他部分的还原功能，进行了一次性还原

- 根据方法 "isShowReductionWinCheck" 控制，div "class='layer-btn-right'"

## 三、三类统计、平差、导出部分

三类统计、平差、导出部分包括了如下功能：

1. 三类统计
2. 平差
3. 导出图幅
4. 导出三类表格

### 1.三类统计
菜单栏显隐按钮对左侧菜单栏进行显隐控制

- 根据参数 "showLayer" 控制，div "class='layer-btn'"

### 2.平差

一键还原按钮调用了其他部分的还原功能，进行了一次性还原

- 根据方法 "isShowReductionWinCheck" 控制，div "class='layer-btn-right'"

### 3.导出图幅

图层搜索根据连续汉字匹配的方式，对饮用水、地表水、其他图层、已选图层的内容进行筛选

- 绑定的数据为 "keyWord" ，div "class='search'"

### 4.导出三类表格

根据用户勾选状态，去控制地图加载的数据

- 获取数据的后台接口为 "/oneMap/getMenus" , 前端处理数据的方法为 "getLayer" ，vue 中使用到的数据名称为 "layerData"
- 分为一级内容（饮用水、地表水、其他图层、已选图层）， div "class='layer-item'"
- 二级内容（点击后右边弹出）, div "class='layer-second'",二级内容与一级内容相关
- 已选图层根据当前已选择的图层信息进行展示，数据："checkList"