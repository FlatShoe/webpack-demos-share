
## 概述
`Webpack`是一个用于现代JavaScript应用程序的静态模块打包工具。当Webpack处理应用程序时，它会在内部构建一个依赖图，此依赖图对应映射到项目所需的每个模块，并生成一个或多个bundle

## 依赖与安装
Webpack的运行是依赖`Node`环境的，所以电脑需要安装
[node](https://nodejs.org/en/)

安装Webpack时，需要同时安装webpack-cli

```
yarn add webpack webpack-cli -g #全局安装
yarn add webpack webpack-cli -D #局部安装
```

## 初始项目
通过 `yarn init -y` 对项目进行初始，根目录下新建 `src/index.js`文件

```
yarn add webpack webpack-cli -D #局部安装
```

```
// index.js
class Person{
  constructor (name, age) {
    this.name = name
    this.age = age
  }
  sayHi () {
    console.log(this.name)
  }
}

const p = new Person('zs', 18)
p.sayHi()
```
执行`webpack`命令进行默认打包

```
webpack
```
根目录下自动生成了一个`dist`目录，dist目录中存放着一个打包后的js文件-`main.js`

## 默认打包
当我们运行webpack该命令时，Webpack会查找当前目录下的 `src/index.js`作为入口，打包后自动生成`dist/main.js`

同时我们发现main.js文件中的代码已经是压处理过了，因为webpack默认的打包模式是 `production` 模式

## webpack.config.js配置文件
默认配置必然是不能满足对项目打包的要求，我们可以在根目录下创建一个`webpack.config.js`文件来对Webpack进行配置，并且默认情况下，请保证该文件名称只能是`webpack.config`，当然也是可以通过其他配置对配置文件名进行更改

在webpack.config.js文件中，我们对Webpack进行一个初步的基础配置，Webpack依赖于Node,所以我们遵循`CommonJs`模块化规范

### 出入口配置

```
// webpack.config.js

const {resolve} = require('path')
module.exports = {
  // 入口配置
  entry: './src/index.js',
  // 出口配置,
  output: {
      // 文件名称
    filename: 'bundle.js',
      // 输出目录，并且是需要绝对路径，我们使用node内置模块 path.resolve进行拼接
    path: resolve(__dirname, 'build')
  }
}
```

```
webpack
```
执行webpack命令进行打包，我们会发现在打包后根目录下生成了`build/bundle.js`文件，上面我们通过配置文件指定了出入口

### 脚本执行
此前我们都是通过webpack该命令进行打包的，在根目录下的package.json文件中，我们可以新增脚本对Webpack指定固定的命令进行打包

```
{
  "name": "08.test",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
    "webpack": "^5.44.0",
    "webpack-cli": "^4.7.2"
  },
  "scripts": {
    "build": "webpack"
  }
}
```
通过`yarn run build` 进行打包
```
yarn run build
```

### 指定配置文件
默认情况下，Webpack配置文件名称只能是`webpack.config`,出于某些原因，有时候需要根据特定情况使用不同的配置文件，我们可以配置执行命令，指定Webpack的配置文件
```
{
  "name": "08.test",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
    "webpack": "^5.44.0",
    "webpack-cli": "^4.7.2"
  },
  "scripts": {
    "build": "webpack --config prod.config.js"
  }
}
```
webpack命令后添加 `--config prod.config.js`，Webpack则会以根目录下的prod.config.js文件作为配置文件进行打包

## 样式处理
创建一个css文件，src/style/common.css，并写入一些样式

```
// common.css
.container {
   width: 300px;
   height: 300px;
   background-color: pink;
}
```
入口文件中我们通过EsModule模块导入的方式将css导入进来

```
// index.js
import './src/style/common.css'
```
执行 yanr run build 进行打包。控制台报错，因为Webpack只能理解 JavaScript 和 JSON 文件，Webpack不能直接处理 `css`，需要借助 `loader`，控制台中可以看到`You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file`

### loader
什么是loader呢

loader让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中

### css-loader 与 style-loader
- css-loader 加载CSS文件并解析import导入的CSS文件，最终返回CSS代码
- style-loader 将模块导出的内容作为样式并添加到DOM中
使用前安装依赖

```
yarn add css-loader style-loader -D
```
webpack配置文件中进行配置

```
const {resolve} = require('path')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    // rules属性对应的值是一个数组,针对不同的资源配置相应的信息
    rules: [
      {
        // 用于对资源进行匹配，通常会设置成正则表达式
        test: /\.css$/i,
        // 配置loader
        use: [
          // {loader: 'style-loader'}
          // {loader: 'css-loader},
          // 下面方式为简写
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}
```
执行 yarn run build 进行打包，打包成功，可以新建 build/index.html 通过script标签引入build.js文件,并且编写一个类名为container的标签，打开浏览器查看效果

值得注意的是应保证 loader 的先后顺序：[`'style-loader'`](https://webpack.docschina.org/loaders/style-loader) 在前，而 [`'css-loader'`](https://webpack.docschina.org/loaders/css-loader) 在后。如果不遵守此约定，webpack 可能会抛出错误


### less-loader
开发中，我们通常会使用less、sass等预处理器来编写css。less、sass等编写的css需要通过工具转换成普通的css，这里以less来举例

创建一个less文件，src/style/common.less，并写入一些样式


```
@color: #666;
@font-weight: 700;
.title {
  color: @color;
  font-weight: @font-weight;
}
```
入口文件中我们通过EsModule模块导入的方式将css导入进来
```
// index.js
import './src/style/common.less'
```

首先我们需要less工具转换css，less-loader则会自动使用less工具

安装依赖

```
yarn add less less-loader -D
```
webpack配置文件中进行配置

```
const {resolve} = require('path')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
          // 匹配 less文件资源
        test: /\.less$/i,
        use: [
            // 通过less-loader转换成css，css-loader加载css，style-loader将css插入到Dom
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'less-loader'}
        ]
      }
    ]
  }
}
```
## PostCSS
[postcss](https://www.postcss.com.cn/) 是一个用JavaScript工具和插件转换CSS代码的工具

安装postcss时，需要同时安装postcss-cli

```
yarn add postcss postcss-cli -D
```
### autoprefixer
autoprefixer插件可以自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮你自动为CSS规则添加前缀

```
yarn add autoprefixer -D
```
我们可以在css文件中添加一些属性

```
// src/style/common.css

:fullscreen {

}
.test {
  user-select: none
}
```
通过命令行使用postcss工具，并且指定使用autoprefixer

```
npx postcss --use autoprefixer -o ./src/style/commoncopy.css ./src/style/common.css
```
执行命令之后，我们可以发现src/style目录下多了一个commoncopy.css文件，并且为css属性自动添加了前缀

```
// src/style/commoncopy.css

:-webkit-full-screen {

}
:-ms-fullscreen {

}
:fullscreen {

}
.test {
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none
}
```
### postcss-loader
开发中我们并不会直接使用命令工具来对css进行处理，我们可以借助webpack使用postcss工具，可以通过postcss-loader来完成

```
yarn add postcss-loader -D
```
webpack配置文件中进行配置

```
const {resolve} = require('path')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                  // 因为postcss需要有对应的插件才会起效果，所以我们需要配置它的plugin
                plugins: [ require('autoprefixer') ]
              }
            }
          }
        ]
      },
    ]
  }
}
```
### postcss-preset-env
postcss-preset-env插件可以-   帮助我们将一些现代的CSS特性，转成大多数浏览器认识的CSS，并且会根据目标浏览器或者运行时环 境添加所需的polyfill，并且自动帮助我们添加autoprefixer

```
yarn add postcss-preset-env -D
```
webpack配置文件中进行配置

```
const {resolve} = require('path')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [ require('postcss-preset-env') ]
              }
            }
          }
        ]
      },
    ]
  }
}
```
### Browserslist
对不同的浏览器支持的特性:比如css特性、js语法，之间的兼容性,市场上的浏览器是否都需要兼容

Browserslist是一个在不同的前端工具之间，共享目标浏览器和Node.js版本的配置

[Browserslist编写规则](https://www.npmjs.com/package/browserslist)

#### package.json中配置

```
{
  "devDependencies": {
    "autoprefixer": "^10.3.1",
    "css-loader": "^6.2.0",
    "less": "^4.1.1",
    "less-loader": "^10.0.1",
    "postcss": "^8.3.6",
    "postcss-cli": "^8.3.1",
    "postcss-loader": "^6.1.1",
    "postcss-preset-env": "^6.7.0",
    "style-loader": "^3.2.1",
    "webpack": "^5.48.0",
    "webpack-cli": "^4.7.2"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "no dead"
  ]
}
```
#### .browserslist文件配置
除了在package.json中进行配置，还可以在根目录下创建一个.browserslist文件进行配置

```
> 1%
last 2 versions
no dead
```

Browserslist 的数据都是来自[Can I Use](https://links.jianshu.com/go?to=http%3A%2F%2Fcaniuse.com%2F),我们前面的autoprefixer和postcss-preset-env以及其他的插件工具都可以使用这些配置进行兼容

我们没有配置browserslist的情况下，browserslist会有个默认配置

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a26fcf1299474b09858bb2ee79cfc033~tplv-k3u1fbpfcp-watermark.image)

## 处理其他资源
在开发过程中，有时候我们会依赖一些其他资源，例如：图片、字体、视频等，通过使用相应loader对这些资源进行处理

### file-loader

```
yarn add file-loader -D
```
file-loader 会将文件上的import/require()解析为url，并将该文件发送到输出目录

入口文件中导入预先准备好的图片

```
// src/index.js

const img = new Image()
img.src = require('./images/1.png).default
document.body.appendChildren(img)
```
webpack配置文件中进行配置

```
const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      }
    ]
  }
}
```
执行yarn run build 之后，我们会看到build文件夹中多出了一张图片，并且命名类似于哈希值，我们新建index.html文件，通过script标签引入bundle.js文件，可通过浏览器查看图片是否加载打包成功

### 设置文件名称
可以通过PlaceHolders对文件原名或者扩展名等进行处理

[文件命名规则](https://v4.webpack.js.org/loaders/file-loader/#placeholders)

常用的placeholder

- [ext] 处理文件的扩展名
- [name] 处理文件的名称
- [hash] 文件的内容，使用MD4的散列函数处理
- [hash: <length\>] 指定计算散列的长度
- [path] 文件相对于webpack配置文件的路径

webpack配置文件中进行配置

```
const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              // 通过outputPath 指定文件打包后存放的文件夹
              outputPath: 'img'
              // 或者通过下面的方式，指定文件打包后存放的文件夹同时设置名称
              // name: 'img/[name].[hash:8].[ext]'
            }
          },
        ],
      }
    ]
  }
}
```

### url-loader

```
yarn add url-loader -D
```
url-loader和file-loader类似，可将文件转换为 base64 URI，如果文件小于字节限制，则可以返回 DataURL

入口文件中导入预先准备好的图片

```
// src/index.js

const img = new Image()
img.src = require('./images/1.png)
document.body.appendChildren(img)
```
webpack配置文件中进行配置

```
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            // loader: 'file-loader',
            loader: 'url-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'img'
              // name: 'img/[name].[hash:8].[ext]'
            }
          },
        ],
      }
    ]
  }
}
```
将此前的build文件删除之后，执行yarn run build，我们会看到build文件夹中并没有图片，新建index.html文件，通过script标签引入bundle.js文件，依旧可以通过浏览器查看图片,因为`默认情况下url-loader会将所有的图片文件转成base64编码`

### url-loader的limit

开发中小图转换base64之后可以和页面一起被请求，减少不必要的请求过程。大的图片直接使用图片即可，如果大图也进行转换，反而会影响页面的请求速度

limit可以设置转换的限制

```
const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            // loader: 'file-loader',
            loader: 'url-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'img',              
              // limit 以字节为单位
              limit: 1024
            }
          },
        ],
      }
    ]
  }
}
```


### Asset Modules Type
webpack5中，[asset modules type](https://webpack.js.org/guides/asset-modules/) (资源模块类型) 它允许加载其他资源(字体，图标等)，而无需配置额外的loader，例如（`file-loader`、`url-loader`、`raw-loader`）

asset modules type通过添加 4 种新模块类型来替换所有这些loader
-   `asset/resource`发出一个单独的文件并导出 URL。以前可以通过使用`file-loader`.
-   `asset/inline`导出资源的数据 URI。以前可以通过使用`url-loader`.
-   `asset/source`导出资源的源代码。以前可以通过使用`raw-loader`.
-   `asset`自动在导出数据 URI 和发出单独的文件之间进行选择。以前可以通过使用`url-loader`，并且配置体积大小限制来实现。

导入一张图片
```
// src/index.js
const img = new Image()

img.src = require('./images/1.png')
document.body.appendChild(img)
```

此前我们需要配置file-loader来进行处理，webpack5可以直接通过设置type进行处理资源
```
const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  }
}
```
#### 自定义文件的输出路径和设置文件名
- 修改output，添加assetModuleFilename属性

```
const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build'),
    // 添加 assetModuleFilename属性
    assetModuleFilename: 'img/[name].[hash:8].[ext]'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  }
}
```
- 添加一个generator属性，并且设置filename

```
const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build'),
    // 添加 assetModuleFilename属性
    // assetModuleFilename: 'img/[name].[hash:8].[ext]'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        // 添加generator, 设置filename属性
        generator: {
          filename: 'img/[name].[hash:8].[ext]'
        }
      }
    ]
  }
}
```

#### 体积转换限制
此前通过url-loader中的limit限制体积的转换

1. 设置type为asset
2. 添加parser属性，指定dataUrl的条件，添加maxSize属性

```
const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        // type: 'asset/resource',
        type: 'asset',
        generator: {
          filename: 'img/[name].[hash:8].[ext]'
        },
        parser: {
          dataUrlCondition: {
              // 设置体积限制大小
            maxSize: 100000
          }
        }
      }
    ]
  }
}
```
#### 字体加载
使用某些特殊的字体或者字体图标时，会引入一些字体文件，这些字体文件的处理方式也是大同小异

```
    // src/font/font.css
@font-face {
  font-family: "calculatrix-7";
  src: url(../font/calculatrix-7.ttf);
}

@font-face {
  font-family: "pang-men-zheng-dao";
  src: url(../font/pang-men-zheng-dao.ttf);
}

@font-face {
  font-family: "you-she-biao-ti-hei";
  src: url(../font/you-she-biao-ti-hei.ttf);
}
```

```
// src/style/index.css
.title {
  font-family: 'calculatrix-7';
}
.title2 {
  font-family: 'pang-men-zheng-dao';
}
.title3 {
  font-family: 'you-she-biao-ti-hei';
}
```
导入相关样式与添加Dom元素并设置类名
```
// src/index.js
import './font/font.css'
import './style/index.css'

const createSpan = (className) => {
  const el = document.createElement('p')
  el.classList.add(className)
  el.innerText = 'hello webpack'
  return el
}

document.body.appendChild(createSpan('title1'))
document.body.appendChild(createSpan('title2'))
document.body.appendChild(createSpan('title3'))
```
webpack配置文件

```
const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      // 配置字体打包相关规则
      {
        test: /\.(woff2?|eot|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[hash:8].[ext]'
        }
      }
    ]
  }
}
```
## Plugins
Plugins是webpack的支柱。Webpack本身是建立在你的Webpack配置中使用的相同的插件系统上的!

Plugins还可以做loader不能做的事情。Plugin可以用于执行更加广泛的任务，比如打包优化、资源管理、环境变量注入等

### CleanWebpackPlugin
每次修改配置之后，我们都需要重新打包一次，因为每一次打包有可能生成不同的文件，有些原有的文件还会保留，所以都需要手动删除上一次打包后的文件夹

可以借助`CleanWebpackPlugin`插件帮助我们自动完成该操作

```
yarn add clean-webpack-plugin -D
```

webpack配置文件
```
const {resolve} = require('path')
// 导入 CleanWebpackPlugin
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundel.js',
    path: resolve(__dirname, 'build')
  },
  // 在 plugins 中使用插件
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```
这样我们每次打包的时候 CleanWebpackPlugin 都会自动帮我们删除上一次的打包文件

### HtmlWebpackPlugin
每次打包之后，我们都需要手动创建一个index.html文件，并且还需要手动引入bundle.js,比较麻烦，对HTML打包处理，我们可以使用HtmlWebpackPlugin

```
yarn add html-webpack-plugin -D
```
webpack配置文件

```
const {resolve} = require('path')
// 导入 CleanWebpackPlugin
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// 导入 HtmlWebpackPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundel.js',
    path: resolve(__dirname, 'build')
  },
  // 在plugins 中使用插件
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'hello webpack'
    })
  ]
}
```
再次打包的时候，我们会发现build文件夹下多了一个index.html文件，并且自动帮我们引入bundle.js，`<title>hello webpack</title>`中的内容正是我们传进new HtmlWebpackPlugin中的参数title

#### 自定义HTML模板

有时候默认生成的html模版内容并不是我们想要的内容，此时我们就可以通过自定义模版的方式创建自己的模板html文件，这里借用vue项目的index.html模版文件举例

根部录下创建public文件夹并创建index.html

```
<!-- public/index.html -->
<!-- vue的index.html模版文件 -->

<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>

```
webpack配置文件

```
const {resolve} = require('path')
// 导入 CleanWebpackPlugin
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// 导入 HtmlWebpackPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundel.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'hello webpack',
      // 指定html模版文件的位置
      template: './public/index.html'
    })
  ]
}
```
此时打包，我们会发现控制台报错

`ERROR in Template execution failed: ReferenceError: BASE_URL is not defined`

`ERROR in   ReferenceError: BASE_URL is not defined`

原因在于，我们的模版文件中的`<link rel="icon" href="<%= BASE_URL %>favicon.ico">`

我们先将模版文件中的这段代码删除，后续通过另外一个插件处理
将这段代码删除后，打包后的html文件正是我们的自定义的html模版文件

### DefinePlugin
自定义模版html文件的时候，打包编译时发生了报错，原因在于我们的模版文件中使用了一个BASE_URL的常量，而我们却没有定义这个常量值，所以出现了未定义的错误

`DefinePlugin`允许在编译时创建配置的全局常量，这个插件不需要单独安装，因为它是webpack的一个内置插件

webpack配置文件

```
const {resolve} = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 导入 DefinePlugin
const {DefinePlugin} = require('webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundel.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'hello webpack',
      template: './public/index.html'
    }),
    new DefinePlugin({
        // 配置 BASE_URL 常量
      BASE_URL: '"./"'
    })
  ]
}
```
模版文件中添加之前删除的`<link rel="icon" href="<%= BASE_URL %>favicon.ico">`， 此时打包便可以解决之前打包的编译错误了

### CopyWebpackPlugin

```
yarn add copy-webpack-plugin -D
```
在打包的过程中，有时候我们需要将一些文件拷贝到build文件夹下，例如favicon.ico图标

public目录下，将favicon.ico图标文件放置其中，我们希望在打包后的build文件夹中也有favicon.ico，[CopyWebpackPlugin](https://www.npmjs.com/package/copy-webpack-plugin)可以将已经存在的单个文件或整个目录复制到构建目录

webpack配置文件

```
const {resolve} = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {DefinePlugin} = require('webpack')
// 导入 CopyWebpackPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundel.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'hello webpack',
      // 指定html模版文件的位置
      template: './public/index.html'
    }),
    new DefinePlugin({
      BASE_URL: '"./"'
    }),
    // 配置 CopyWebpackPlugin
    new CopyWebpackPlugin({
      patterns: [
        {
          // 设置复制源
          from: 'public',
          // 允许配置插件使用的 glob 模式匹配库
          globOptions: {
              // 支持选项列表中要排除的文件
            ignore: [
                // .DS_Store mac目录下自动生成的文件，不需要拷贝
              '**/.DS_Store',
                // index.html 为模版文件，也不需要拷贝
              '**/index.html'
            ]
          }
        }
      ]
    })
  ]
}
```

## Mode
[mode](https://webpack.js.org/configuration/mode/)配置选项可以告知webpack相应地使用其内置的优化

默认情况下使用的是production模式

可配置的模式有: 'none' | 'development' | 'production'


| 选项 | 描述 |
| --- | --- |
| development | 设置 `DefinePlugin`中`process.env.NODE_ENV` 为 `development`，为模块和chunks启用有效名称 |
| production | 设置 `DefinePlugin`中`process.env.NODE_ENV` 为 `production`，为模块和chunks启用确定性的混淆名称，`FlagDependencyUsagePlugin`，`FlagIncludedChunksPlugin`，`ModuleConcatenationPlugin`，`NoEmitOnErrorsPlugin` 和 `TerserPlugin`
| none | 选择退出任何默认优化选项

webpack配置文件
```
const {resolve} = require('path')

module.exports = {
    // 配置模式
  mode: 'development', // 开发模式
  // mode: 'production', // 默认打包模式为生产模式
  // mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  }
}
```
同时也支持通过命令行指定打包模式

```
webpack --mode=development
```

## Source Map
日常开发中，源码与webpack压缩构建后的代码是不一样的，比如说生产环境中编写源代码报错时与编译后对应的第几行肯定不一致的，此时就非常不方便调试

Source Map在MDN文档中解释是使得浏览器来重构原始源并在调试器呈现重构原始

借用阮一峰老师的解释就是：Source map就是一个信息文件，里面储存着位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。有了它，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。这无疑给开发者带来了很大方便


Webpack中,通过devtool控制是否以及如何生成Source Map

[devtool](https://webpack.js.org/configuration/devtool/#devtool)有很多值供我们使用，不同的值生成的Source Map也是不一样的，同时构建速度也会因为选择不同的值产生不一样的影响

### Production
生产环境下，devtool是缺省的，不生成Source Map

### Development
开发环境下，devtool的默认值为eval，不生成Source Map

另外，如果我们将devtool的值设置为false，也是不会生成Source Map的

### eval

eval模式，是将一行行代码转成字符串，传入eval函数中，并且会在末尾追加注释`//# sourceURL`

```
 // src/index.js
     // 打印一个不存在的变量
 console.log(abc)
```

```
 // webpack.config.js
 
const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
    // 开发模式  devtool默认值为eval
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin()
  ]
}
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e807640961e849c4a54d3671f4557e4b~tplv-k3u1fbpfcp-watermark.image)


虽然eval没有生成Source Map，但是eval执行代码后面追加的注释，还原了对应的文件


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4762894f7f3c4a2291a461b645bf0ea5~tplv-k3u1fbpfcp-watermark.image?)



### source-map

当devtoop值为source-map时，会生成一个独立的Source Map文件


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/01d147e74e9a4b50b27b979da6edad85~tplv-k3u1fbpfcp-watermark.image?)

bundle.js构建文件末尾处会追加一行注释`//# sourceMappingURL=bundle.js.map`，指向该Source Map文件

```
  // webpack.congif.js
  
module.exports = {
  mode: 'development',
    // 设置为source-map
  devtool: 'source-map'
  ...省略
}  
```
浏览器会根据这个注释找到source-map文件

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d36e097e1ba40f9be61df808a12860c~tplv-k3u1fbpfcp-watermark.image?)

### eval-source-map

当devtoop值为eval-source-map时 ，source map以DataUrl添加到eval函数的后面

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c3a2f1d8335840af871da300fd02e0c1~tplv-k3u1fbpfcp-watermark.image?)

### inline-source-map
当devtoop的值为inline-source-map时，source map转换为 DataUrl 后添加到 bundle 中

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6513dd4909914dd2b52ac774fd315a70~tplv-k3u1fbpfcp-watermark.image?)


对于不同的值生成的Source Map存在的差异可以查看官方[示例](https://github.com/webpack/webpack/tree/master/examples/source-map)，这里不一一演示


### 推荐
在官方提供这么多devtoop的值当中，一些适用于开发环境，一些适用于生产环境，对于开发而言，通常需要快速的Source Maps

开发环境：推荐使用source-map 或者 cheap-module-source-map

生产环境：缺省devtool选项、source-map，hidden-source-map，nosources-source-map


## Babel
开发中，通常会使用ES5+的高级语法或是使用TypeScript以及编写jsx,这些都是离不开Babel的转换，[Babel](https://www.babeljs.cn/)是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中

主要的功能包括：语法转换、源码转换、通过 Polyfill 方式在目标环境中添加缺失的特性等

### 使用
通过命令行单独使用babel，需要下载的依赖

```
yarn add @babel/core @babel/cli @babel/preset-env -D
```

```
  // src/test.js
const sum = (a, b) => a + b
console.log(sum(1, 1))
```
命令行执行命令将 `src` 目录下的所有代码编译到 `lib` 目录

```
./node_modules/.bin/babel src --out-dir lib --presets=@babel/preset-env

#或

npx babel src --out-dir lib --presets=@babel/preset-env
```

```
 // lib/test.js
"use strict";

var sum = function sum(a, b) {
  return a + b;
};

console.log(sum(1, 1));
```
此时我们已经将 ES2015+ 语法进行转换

在我们下载的依赖中，Babel 的核心功能包含在 [@babel/core](https://www.babeljs.cn/docs/babel-core) 模块中，[@babel/cli](https://www.babeljs.cn/docs/babel-cli) 是一个能够从终端（命令行）使用的工具，[@babel/preset-env](https://www.babeljs.cn/docs/babel-preset-env)是Babel的一个智能预设

### babel-loader
此前我们通过了命令行使用了babel, [babel-loader](https://webpack.docschina.org/loaders/babel-loader/)是允许使用babel和webpack转译`JavaScript`文件

```
yarn add babel-loader -D
```

```
  // src/index.js
  
console.log([1, 2, 3, 4].map(n => n * 2))
```

```
 // webpack-config.js
const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          // 使用babel-loader
          loader: 'babel-loader',
          options: {
            // 传入babel预设
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
```

```
 // build/bundle.js
 
console.log([1,2,3,4].map((function(n){return 2*n}))); 
```
通过babel-loader，我们也将 ES2015+ 语法进行了转换

默认情况下`@babel/preset-env`使用.browserslist作为配置源，前面postcss中，我们也有提到[.browserslist](https://juejin.cn/post/6985782073109774349#heading-16)

若不通过.browserslist作为配置源，也可以通过`targets`设置目标浏览器

```
const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          // 使用babel-loader
          loader: 'babel-loader',
          options: {
            // 传入babel预设
            // presets: ['@babel/preset-env']
            
            presets: [
              [
                '@babel/preset-env',
                {
                  // 设置targets
                  targets: [
                    "chrome 58",
                    "ie 11"
                  ]
                }
              ]
            ]
          }
        }
      }
    ]
  }
}
```

### 配置文件
babel的配置文件类型，可以看下官方的 [Configuration File Types](https://www.babeljs.cn/docs/config-files#configuration-file-types)，这里以`js`或者`json`为后缀的`babel.config`作为示例

根目录下创建babel.config.js或babel.config.json，其中之一即可

```
  // babel.config.js
 module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: [
          "chrome 58",
          "ie 11"
        ]
      }
    ]
  ]
}
```

```
 // babel.config.json
 {
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": [
          "chrome 88",
          "ie 11"
        ]
      }
    ]
  ]
}
```
此时我们就不需要在webpack配置文件中配置预设了
```
 // webpack.config.js
 module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          // 使用babel-loader
          loader: 'babel-loader',
        }
      }
    ]
  }
}
```

### babel-polyfill、core-js 和 regenerator-runtime
Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，在Babel 7.4.0之前，使用[@babel/polyfill](https://babeljs.io/docs/en/babel-polyfill)进行转换，从Babel 7.4.0开始，这个包已经被弃用，取而代之的是直接包含core-js/stable(用来填充ECMAScript特性)和regenerator-runtime/runtime(需要使用transpiled generator函数)来完成polyfill的使用


```
yarn add core-js regenerator-runtime
```

#### 设置useBuiltIns
在根目录的babel.config.js文件中，我们配置一下useBuiltIns


useBuiltIns属性
- usage: polyfill局部使用，不造成全局污染

- entry: 通过`require` 或 `import` 引入 core-js 和 regenerator-runtime，多次引入会报错，比如我们依赖的某一个库本身使用了某些polyfill的特性，会根据 browserslist 目标浏览器导入所有的polyfill，对应的打包文件也会变大

- false: 默认值，不使用polyfill


```
 // src/index.js
 
```
#### corejs
[corejs](https://www.npmjs.com/package/core-js): JavaScript 的模块化标准库。包括[ECMAScript 到 2021 年的 polyfills](https://github.com/zloirock/core-js#ecmascript)：[promises](https://github.com/zloirock/core-js#ecmascript-promise)、[symbols](https://github.com/zloirock/core-js#ecmascript-symbol)、[collections](https://github.com/zloirock/core-js#ecmascript-collections)、iterators、[typed arrays](https://github.com/zloirock/core-js#ecmascript-typed-arrays)、许多其他特性、[ECMAScript 提案](https://github.com/zloirock/core-js#ecmascript-proposals)、[一些跨平台的 WHATWG/W3C 特性和提案](https://www.npmjs.com/package/core-js#web-standards)

排除不需要使用polyfill的文件，例如node_modules

```
const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
         // 排除 node_modules
        exclude: /node_modules/,
        use: {
          // 使用babel-loader
          loader: 'babel-loader'
        }
      }
    ]
  }
}
```

通过不同的配置对下面代码进行转换

```
 // src/index.js
new Promise((resolve,reject) => {})
```
`usage`
```
 // babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
         // 设置useBuiltIns 为 usage
        useBuiltIns: 'usage',
         // 设置corejs 版本
        corejs: 3.8
      }
    ]
  ]
}
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9a9c2893c4a4393978319783ff701fd~tplv-k3u1fbpfcp-watermark.image?)

打包后的bundel.js,我粗略数了一下，大概有。。。我也不知道有多少行代码

`entry`

入口文件中引入`core-js/stable` 和 `regenerator-runtime/runtime`

```
 // src/index.js
 
 // 引入 core-js/stable 和 regenerator-runtime/runtime
 import 'core-js/stable'
 import 'regenerator-runtime/runtime'

new Promise((resolve,reject) => {})
```

```
 // babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 设置useBuiltIns 为 usage
        // useBuiltIns: 'usage',

        // 设置useBuiltIns 为 entry
        useBuiltIns: 'entry',
        // 设置corejs 版本
        corejs: 3.17
      }
    ]
  ]
}
```
打包后的bundel.js文件很明显是usage打包的要大很多

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8335c16d8a63405db4b6bd2edcaa1933~tplv-k3u1fbpfcp-watermark.image?)

### babel/preset-react

通过babel转换jsx


```
yarn add @babel/preset-react -D
```
webpack配置文件
```
 // webpack.config.js
const {resolve} = require('path')

const  {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') 

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'hello react',
      template: './index.html'
    })
  ]
}
```

入口jsx文件
```
 // src/index.jsx
import React, {Component} from 'react'
import ReactDom from 'react-dom'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: 'hello react'
    }
  }
  render () {
    return (
      <div>
        <h1>{this.state.message}</h1>
      </div>
    )
  }
}

ReactDom.render(<App />, document.querySelector('#app'))
```
index.html模版文件

```
 <!-- index.html -->
 
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```
babel配置文件

```
 // babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3.17
      }
    ],
    // 设置 @babel/preset-react
    ['@babel/preset-react']
  ]
}
```

## 编译TypeScript
将Typescript转换成Javascript可以通过ts-loader或者babel-loader
### ts-loader
ts-loader是通过TypeScript的compiler来转换成JavaScript

下载依赖
```
yarn add typescript ts-loader -D
```
生成tsconfig.json文件
```
tsc --init
```
配置信息

```
module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  }
```
### babel-loader
```
yarn add @babel/preset-typescript -D
```
使用此预设，babel可以将Typescript转换成Javascript

```
    // babel.config.js
module.exports = {
  presets: [
    // ...
    ['@babel/preset-typescript']
  ]
}
```

## Eslint使用
安装ESLint

```
yarn add eslit -D
```
生成配置文件

```
npx eslint --init
```
当前我生成的是airbnb风格的elsint
详细配置可以根据需求查阅
[官网](https://eslint.org/)

```
    // .eslintrc.js
    
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
  },
};
```
EslintWebpackPlugin该插件使用来查找和修复 JavaScript 代码中的问题

```
yarn add eslint-webpack-plugin -D
```
配置信息
```
const {resolve} = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new ESLintPlugin()
  ]
}
```

##  DevServer
`webpack-dev-server`可以理解为一个小型的静态文件服务器，为webpack打包生成的资源文件提供Web服务

```
yarn add webpack-dev-server -D
```
定义package.json脚本执行 `webpack serve`

```
{
  "name": "serve",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "build": "webpack",
    "serve": "webpack serve"
  }
}
```
模式改为 `development`，使用 `HtmlWebpackPlugin` 并提供模版进行创建html文件
```
    // webpack.config.js
    
const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CleanWebpackPlugin()
  ]
}
```
在入口文件中书写一段代码

```
    // src/index.js
    
class Persion {
  constructor(name) {
    this.name = name
  }
  sayHi() {
    console.log(`Hello My Name is ${this.name}`)
  }
}
const James = new Persion('James')
James.sayHi()
```
命令行中使用 `yarn serve` 执行脚本，并在终端通过webpack-dev-server提示的地址，访问浏览器

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cde4f0669f434ffe93333774bc0291fe~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc4261e72aa2467bbac44a5175ec8a8f~tplv-k3u1fbpfcp-watermark.image?)

我们可以看到浏览器中输出了我们想要的内容，并且我们修改代码内容时，进行保存，浏览器也会随即刷新

### HMR
模块热替换(hot module replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新所有类型的模块，而无需完全刷新。

配置devServer 开启HMR
```
const {resolve} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  // 配置devServer
  devServer: {
    // 开启热更新
    hot: true
  },
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CleanWebpackPlugin()
  ]
}
```
指定哪些模块使用HMR，当指定的模块发生了更新，其余未更新的模块的状态则会保留，提高开发效率
```
import './test'
class Persion {
  constructor(name) {
    this.name = name
  }
  sayHi() {
    console.log(`Hello My Name is ${this.name}`)
  }
}
const James = new Persion('James')
James.sayHi()
// 判断是否开启了热更新
if (module.hot) {
    // 指定模块
  module.hot.accept('./test.js', () => {
    console.log('test模块更新了')  
  })
}
```
现实开发中，模块文件比较多，我们不可能一个一个模块进行指定。可以参考[官网](https://webpack.docschina.org/guides/hot-module-replacement/#other-code-and-frameworks)，HMR与各个框架的交互，例如，vue-loader支持 vue 组件的 HMR，提供开箱即用体验

### host
指定要使用的主机地址

默认值是localhost

如果你想让你的服务器可以被外部访问，像这样指定

```
module.exports = {
  //...
  devServer: {
    host: '0.0.0.0'
  }
}
```
### port
指定监听请求的端口号：

```
module.exports = {
  //...
  devServer: {
    port: 9527
  }
}
```

### gzip压缩
```
module.exports = {
  //...
  devServer: {
    compress: true
  }
}
```

原本294kb 压缩至70.9kb
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/edc902085127410c8a3436cfc4e5a2e9~tplv-k3u1fbpfcp-watermark.image?)


### proxy
当拥有单独的 API 后端开发服务器并且希望在同一域上发送 API 请求时，代理某些 URL 可能会很有用

```
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```
现在，对 `/api/users` 的请求会将请求代理到 `http://localhost:3000/api/users`。
如果不希望传递`/api`，则需要重写路径：
```
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
```
更多关于proxy的配置可以查阅[官网](https://webpack.docschina.org/configuration/dev-server/#devserverproxy)

## resolve
配置模块如何解析

### alias
创建 `import` 或 `require` 的别名，来确保模块引入变得更简单。例如，一些位于 `src/` 文件夹下的常用模块


```
    // webpack.config.js

module.exports = {
    // ...
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}
```
当模块层级比较深的时候，使用该方式非常方便
```
    // src/index.js

// import {sum} from './util.js'
import {sum} from '@/util.js'

console.log(sum(1, 1))
```

### extensions
能够在引入模块时不带扩展，并按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀

```
    // webpack.config.js

module.exports = {
    // ...
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.json']
  }
}
```
```
    // src/index.js

// import {sum} from './util.js'
import {sum} from '@/util'

console.log(sum(1, 1))
```

## 配置文件抽离
当前我们都是通过一个webpack.config.js文件进行配置，当配置信息越来越多的时候，这个配置文件将难以维护，我们应该根据当前的环境进行划分配置，例如可以对开发环境和生产环境进行不同的配置划分，并且有些配置生产环境不需要使用，有些配置开发环境不需要使用，有些配置开发环境和生产环境都会使用到，我们需要做一个公共的抽离却又能单独针对当前环境的配置划分

### 创建配置文件
项目根目录下创建一个config文件夹

该文件夹下创建三个配置文件
- `webpack.base.conf` —— 开发环境与生产环境的公共基础配置
- `webpack.dev.conf` —— 开发环境配置
- `webpack.prod.conf` —— 生产环境配置

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3785930014c84a3ca686721ea3606bb2~tplv-k3u1fbpfcp-watermark.image?)

package.json中配置执行脚本

`build` -- 项目打包

`serve` -- 通过devserve 启动本地服务

```
{
  "scripts": {
    "build": "webpack --config config/webpack.prod.conf",
    "serve": "webpack serve --config config/webpack.dev.conf"
  }
}
```
### webpack-merget
通过webpack-merge 将公共基础配置与当前环境划分的配置进行合并


```
yarn add webpack-merge -D
```

公共基础配置
```
/*
* @Description base
*/
const {join} = require('path')

const resolve = (dir) => {
  return join(__dirname, '..', dir)
}

module.exports = (env) => {
  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: resolve('build')
    }
    // ...
  }
}
```
开发环境
```
/*
* @Description dev
*/

const {merge} = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')

module.exports = merge(baseConfig, {
  mode: 'development',
  //...
})
```
生产环境
```
/*
* @Description prod
*/

const {merge} = require('webpack-merge')
const baseConfig = require('./webpack.base.conf')

module.exports = merge(baseConfig, {
  mode: 'production',
  //...
})
```

## 代码分离
代码分离是 webpack 中最引人注目的特性之一。此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

-   **入口起点**：使用 [`entry`](https://webpack.docschina.org/configuration/entry-context) 配置手动地分离代码。
-   **防止重复**：使用 [Entry dependencies](https://webpack.docschina.org/configuration/entry-context/#dependencies) 或者 [`SplitChunksPlugin`](https://webpack.docschina.org/plugins/split-chunks-plugin) 去重和分离 chunk。
-   **动态导入**：通过模块的内联函数调用来分离代码。

### 入口起点(entry point)
通过entry入口手动分离

```
    // webpack.config.js

const {resolve} = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
    main: './src/main.js'
  },
  output: {
      // name 中的值便是entry对象中的 index 和 main
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'build')
  }
}
```

### 防止重复

#### [Entry dependencies](https://webpack.docschina.org/configuration/entry-context/#dependencies)
配置 [`dependOn` option](https://webpack.docschina.org/configuration/entry-context/#dependencies) 选项，这样可以在多个 chunk 之间共享模块

这里以lodash作为示例

```
 // src/index.js
 
import _ from 'lodash'
console.log(_.join(['index', 'loaded!']))
```

```
 // src/main.js

import _ from 'lodash'
console.log(_.join(['main', 'loaded!']))
```

```
 // webpack.config.js

const {resolve} = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: {import: './src/index.js', dependOn: 'shared'},
    main: {import: './src/main.js', dependOn: 'shared'},
    shared: ['lodash']
  },
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'build')
  }
}
```
#### SplitChunksPlugin
[`SplitChunksPlugin`](https://webpack.docschina.org/plugins/split-chunks-plugin) 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。使用这个插件，也可以将重复的 `lodash` 模块去除，该插件webpack已经默认安装和集成，并不需要单独安装

splitChunks.chunks属性有三个值
- async —— 异步导入的模块
- initial —— 非异步导入的模块
- all —— 包含异步和非异步导入的模块

```
// webpack.config.js

const {resolve} = require('path')

module.exports = {
  mode: 'production',
  entry: {
    // index: {import: './src/index.js', dependOn: 'shared'},
    // main: {import: './src/main.js', dependOn: 'shared'},
    // shared: ['lodash']
    index: './src/index.js',
    main: './src/main.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'build')
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

关于splitChunks更多的配置属性可以查阅[官网](https://webpack.docschina.org/plugins/split-chunks-plugin/)


### 动态导入
当涉及到动态代码拆分时，webpack 提供了两个类似的技术。第一种，也是推荐选择的方式是，使用符合 [ECMAScript 提案](https://github.com/tc39/proposal-dynamic-import) 的 [`import()` 语法](https://webpack.docschina.org/api/module-methods/#import-1) 来实现动态导入。第二种，则是 webpack 的遗留功能，使用 webpack 特定的 [`require.ensure`](https://webpack.docschina.org/api/module-methods/#requireensure)，这里我们使用第一种作为示例

EsModule 的方式导出一个函数

```
  // src/util.js
 
 export const test = () => {
  console.log('test')
}
```
通过`import()`进行导入

由于 import() 会返回一个 promise，通过.then的方式我们拿到了util.js导出的函数，它也可以和 [`async` 函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)一起使用

```
    // src/index.js
import('./util').then(res => {
  console.log(res)
})
```
```
    // webpack.config.js
const {resolve} = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'build')
  }
}
```
现在我们已经通过 dynamic import(动态导入) 来分离出一个 chunk

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec860c87b22143708ab85eaf54b49b34~tplv-k3u1fbpfcp-watermark.image?)