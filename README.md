## 抽奖后台说明

共两个接口

#### 第一个抽奖接口

会返回一个 prizeLevel 的数据

从 0 - 6

其中，0 是没有中奖的
1-3 是一等奖到三等奖
4-6 是第二种的一等奖到三等奖，例如 4 是另一个一等奖
具体使用可以看 api.js 中的 fn1

#### 第二个收货信息接口
具体使用看 api.js 中的 fn2
会将第一个接口中的 prizeLevel 也放进来，如果是 0 的话，就不能进入到本环节

#### 关于数据库

配置项 在 utils/db.js 文件夹下

会有一个 sys 的数据库（这个名称是可以改的）
有一个 名称为 lottery 的表
表的 col 内容及数据类型如下

id       INT(11)     PK   MN   AI  
prize_level  INT(11)
address    VARCHAR(65)
phone      VARCHAR(65)
name       VARCHAR(65)

#### 关于抽奖算法的稳定性

我在本机测试了 2 * 30000 次

中奖的数量不会大于项目方给定数量，但是会偏少一些

例如一等奖 50 个，测试 3w 次发现会有 45个左右，
例如二等奖 250个， 测试 3w 次发现会有 245个左右，
三等奖每次都会满 达到 1500 个