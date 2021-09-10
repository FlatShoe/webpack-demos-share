
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
img.src = require('./images/1.png)
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