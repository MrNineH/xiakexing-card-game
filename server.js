const express = require('express');
const app = express();
const port = 3000;

// 设置静态文件目录
app.use(express.static(__dirname));

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});