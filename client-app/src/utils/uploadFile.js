/**
 * Forp大文件断点上传类
 *
 * Copyright © 2018 FORP Co., LTD
 * All Rights Reserved.
 */

// **注意**：Tiny-Worker只能执行NodeJs环境，普通Javascript语法无法执行

const fs = window.require('fs');
const request  = window.require('request');
const sleep = window.require('thread-sleep');
// Log4js
const log4js = window.require('log4js');
log4js.configure({
    "appenders":
    {
        "file": {"type": "file", "filename": "file-assistant.log", "maxLogSize": 10485760, "backups": 10, "layout": {"type": "pattern", "pattern": "[%d{yyyy-MM-dd hh:mm:ss}] %p %m"}}
    },
    "categories": {"default": {"appenders": ["file"], "level": "debug"}}
});		// 只能在打包后环境中执行
const lg = log4js.getLogger('file');
// 全局变量
var FORP, task, endPosition, errorTimes = 0;

/**
 * 接收主线程消息
 */
const uploadFile={
    onmessage:function(event)
    {
        // FORP信息
        if (event.data.FORP)
        {
            FORP = event.data.FORP;
        }

        // task信息
        if (event.data.task)
        {
            task = event.data.task;
        }

        // 命令处理
        if ('start' == event.data.cmd)
        {
            lg.info('↑↑↑↑↑ ' + task.filePath + '[' + task.id + ']');
            this.uploadTrunk();
        }
        else if ('pause' == event.data.cmd)
        {
            // 暂停
            task.status = 'pause';
        }
        else if ('remove' == event.data.cmd)
        {
            // 删除
            task.status = 'remove';
        }
        else
        {
            lg.warn('无效的上传指令：' + event.data);
        }
    },
    /**
     * 上传文件片段
     */
    uploadTrunk:function()
    {
        try
        {
            if ('running' != task.status)
            {
                postMessage({cmd: 'statusChanged', task: task});
                lg.info('上传Worker结束运行[' + task.id + ']' + task.status);
                return;
            }

            // 分段上传
            if (task.position >= task.fileSize)
            {
                // 已上传完成
                lg.info('文件上传成功：' + task.filePath + ' ' + task.fileSize + ' ' +
                (task.finishTime - task.startTime) / 1000 + '秒 ' + (task.fileSize / ((task.finishTime - task.startTime) / 1000)) + '/秒');

                task.status = 'finished';
                // 文件上传完成
                postMessage({cmd: 'finished', task: task});
                return;
            }

            lg.info('↑↑[' + task.id + ']:' + task.position + '->' + task.fileSize);

            // Base64编码方式
            // var Buffer = require('buffer').Buffer;
            // var buffer = Buffer.alloc(FORP.uploadTrunkSize);
            // try
            // {
            // 	var fd = fs.openSync(task.filePath , 'r');
            // 	readed = fs.readSync(fd, buffer, 0, FORP.uploadTrunkSize, task.position);
            // }
            // finally
            // {
            // 	fs.closeSync(fd);
            // }
            //
            // var params =
            // {
            // 	url: FORP.host + '/fileassistant/upload/' + task.id,
            // 	headers: {'powed-by': 'Forp'}, method: 'POST', json: true,
            // 	formData: {p1: FORP.p1, position: task.position, trunkSize: readed, trunk: buffer.toString('base64')}
            // };
            // buffer = null;

            // 结束位置
            endPosition = (task.position + FORP.uploadTrunkSize) >= task.fileSize ? (task.fileSize - 1) : (task.position + FORP.uploadTrunkSize);
            // 请求参数
            var	params =
            {
                url: FORP.host + '/fileassistant/upload/' + task.id, headers: {'powed-by': 'Forp'}, method: 'POST', json: true,
                formData:
                {
                    p1: FORP.p1, position: task.position, // trunkSize: readed,
                    trunk:
                    {
                        value: fs.createReadStream(task.filePath, {start: task.position, end: endPosition}),
                        options: {filename: task.fileName}
                    }
                }
            };

            // 发送HTTP请求
            request(params, function(err, rsp, body)
            {
                // lg.debug(body);
                if (body && body.code && 200 == body.code)
                {
                    if (0 == task.position)
                    {
                        // 记录服务器端开始上传的时间：减去1秒模拟为客户端实际添加文件的时间，防止只有一段时用时为0的问题。
                        task.startTime = body.data.serverTime - 100;
                    }

                    // 更新服务器端的完成时间
                    let preFinishTime = task.finishTime;
                    task.finishTime = body.data.serverTime;
                    if (-1 == preFinishTime)
                    {
                        preFinishTime = task.startTime;
                    }

                    // 计算已上传的大小
                    var readed = 0;
                    if (task.position + FORP.uploadTrunkSize > task.fileSize)
                    {
                        readed = task.fileSize - task.position;
                    }
                    else
                    {
                        readed = FORP.uploadTrunkSize;
                    }

                    // 后移文件上传进度
                    task.position = task.position + readed;
                    // 刷新上传进度
                    postMessage({cmd: 'progress', task: task, preFinishTime: preFinishTime, finished: readed});
                    return this.uploadTrunk();
                }
                else
                {
                    // 重试3次后再改变任务状态，通知主线程
                    errorTimes++;
                    if (errorTimes >= 3)
                    {
                        task.status = 'error';
                        postMessage({cmd: 'statusChanged', task: task});
                        lg.error(errorTimes + '次重试后依然上传错误，忽律上传任务[' + task.filePath + ']');
                        return;
                    }
                    else
                    {
                        lg.warn('上传任务[' + task.filePath + ']上传出错，休眠5秒后重试......');
                        sleep(5 * 1000);
                        // Atomics.wait(new Int32Array(new SharedArrayBuffer(2)), 0, 0, 5000);
                        return this.uploadTrunk();
                    }
                }
            });
        }
        catch (err)
        {
            task.status = 'error';
            postMessage({cmd: 'statusChanged', task: task});
            lg.error('文件上传失败：' + err.message);
        }
    }
};
export default  uploadFile;