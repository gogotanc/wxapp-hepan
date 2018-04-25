'use strict';

const express = require('express');
const request = require('request');
const parser = require('body-parser');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const BBS_URL = 'http://bbs.uestc.edu.cn/mobcent/app/web/index.php';

// App
const app = express();

// 解析 form 数据
app.use(parser.urlencoded({ extended: false }));

// 返回 json 格式数据
app.use("*", function(request, response, next) {
    response.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
    next();
});

// 测试
app.get('/', (req, res) => {
    res.end("{ 'message': 'Hello world' }");
});

// 登录请求
app.post('/login', (req, res) => {
    var args = req.body;
    console.log('request for /login :');
    console.log(args);
    var username = args.username;
    var password = args.password;

    var options = {
        method: 'POST',
        url: BBS_URL,
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            r: 'user/login',
            type: 'login',
            username: username,
            password: password
        }
    };

    request(options, function (error, response, body) {
        res.end(body);
    });
}); 

// 请求主题列表，包括最新回复、最新发表、某版块、某主题
app.post('/topic', (req, res) => {
    var args = req.body;
    console.log('request for /topic :');
    console.log(args);

    var options = {
        method: 'POST',
        url: BBS_URL,
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            r: 'forum/topiclist',
            accessToken: args.accessToken || '',
            accessSecret: args.accessSecret || '',
            boardId: args.boardId || '',
            page: args.page || '1',
            pageSize: args.pageSize || '25',
            sortby: args.sortby || '',
            filterType: args.filterType || '',
            filterId: args.filterId || '',
            isImageList: args.isImageList || '',
            topOrder: args.topOrder || ''
        }
    };

    request(options, function (error, response, body) {
        res.end(body);
    });
});

// 帖子详情的请求
app.post('/detail', (req, res) => {
    var args = req.body;
    console.log('request for /detail :');
    console.log(args);

    var options = {
        method: 'POST',
        url: BBS_URL,
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            r: 'forum/postlist',
            accessToken: args.accessToken,
            accessSecret: args.accessSecret,
            topicId: args.topicId,
            authorId: args.authorId,
            order: args.order,
            page: args.page,
            pageSize: args.pageSize,
        }
    };

    request(options, function (error, response, body) {
        res.end(body);
    });
});

// 今日热门
app.post('/hot', (req, res) => {
    var args = req.body;
    console.log('request for /hot :');
    console.log(args);

    var options = {
        method: 'POST',
        url: BBS_URL,
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            r: 'portal/newslist',
            accessToken: args.accessToken || '',
            accessSecret: args.accessSecret || '',
            page: args.page || '1',
            pageSize: args.pageSize || '25',
            moduleId: '2',
        }
    };

    request(options, function (error, response, body) {
        res.end(body);
    });
});

app.listen(PORT, HOST);

console.log('running at ' + PORT + ' port.');

