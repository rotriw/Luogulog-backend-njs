With Node 16

```

sudo yarn

cp config-example.toml config.toml

node index.js --config=config.toml

```

请调整 config.toml中的一些内容。

win 下请直接修改config-example.toml为config.toml

修改[database]
url = "xxx"为本地或者在线mongodb地址。包含mongodb://

修改[request]
cookie = ""为您打开洛谷cookie。具体方式是，打开F12，打开一个洛谷讨论。复制其中cookie项的值到这里（不是set-cookie）。

或者您可以找smallfang要一个。