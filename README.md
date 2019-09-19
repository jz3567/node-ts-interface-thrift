
# node-ts-interface-thrift

## Usage

  通过thrift文件生成ts所需要的接口文件

## 缺点

  对于optional和required目前的处理方式是直接去掉，不是特别合理;

  ts的interface不能设置默认值，所以thrift中的默认值也是直接去掉处理;

## 用法

  node main.js

  暂未写成命令行形式，根据自己的需求定制main.js的代码
