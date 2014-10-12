gbm
===
[![Build Status](https://travis-ci.org/noyobo/gbm.svg)](https://travis-ci.org/noyobo/gbm)
[![npm version](http://img.shields.io/npm/v/gbm.svg)](https://www.npmjs.org/package/gbm)
[![npm download](http://img.shields.io/npm/dm/gbm.svg)](https://www.npmjs.org/package/gbm)

[![NPM](https://nodei.co/npm/gbm.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/gbm/)

Git branch manage to package.json version daily/x.y.z

## Install

```
$ npm install -g gbm
```

## Usage


```
  Usage: gbm <commands> [options]

  Commands:

    new [x.y.z|options]
       创建新分支
    
    ver [x.y.z|options]
       更新当前版本号 并 commit
    
    prepub 
       推送当前分支到远端
    
    publish 
       发布当前分支资源
    
    sync 
       同步当前版本号
    
    check 
       检验当前文件配置
    

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -x, --major    主版本号增加
    -y, --minor    次版本号增加 default
    -z, --patch    补丁版本号增加
```
