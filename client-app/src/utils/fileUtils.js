const fileUtils = {
    /*****************************常量********************************/
    //文件大小限制 1G
    FILE_LIMIT:1024*1024*1024,
    //上传地址
    FILE_UPLOAD_URL:'/doc/attachment/upload',
    //上传地址
    FILE_DOWMLOAD_URL:'/doc/attachment/download',
    

    /*****************************方法********************************/
    // 附件下载
    downloadFile:async (params) => {
        const{downloadHandle,addErrorMessage,param}=params;
        const result = await downloadHandle(param.id);
        if(result && result.message)
        {
            let aElemt = document.createElement('a');
            let temporaryUrl =  fileUtils.FILE_DOWMLOAD_URL+'id='+param.id || param.fileId;
            aElemt.href = fileUtils.FILE_DOWMLOAD_URL+'?id='+param.id || param.fileId;
            aElemt.download = `${param.name}`;
            aElemt.click();
            window.URL.revokeObjectURL(temporaryUrl);
        }else{
            addErrorMessage("文件下载失败");
        }
    },
    //网页端文件预览
    previewFile : async(params) => {
        const{previewHandle,addErrorMessage,param}=params;
        let win=window.open();
        const result = await previewHandle(param.id);
        if(result && result.data) {
            win.location.href=result.data;
        }else{
            win.close();
            addErrorMessage("文件预览失败");
        }
    },
    //文件大小转化
    converFileSize:(limit)=>{
        let size = "";
        if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B
            size = limit.toFixed(2) + "B";
        }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB
            size = (limit / 1024).toFixed(2) + "KB";
        }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB
            size = (limit / (1024 * 1024)).toFixed(2) + "MB";
        }else{ //其他转化成GB
            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
        }

        let sizestr = size + "";
        let len = sizestr.indexOf("\.");
        let dec = sizestr.substr(len + 1, 2);
        if(dec == "00"){//当小数点后为00时 去掉小数部分
            return sizestr.substring(0,len) + sizestr.substr(len + 3,2);
        }
        return sizestr;
    }
};
module.exports = fileUtils;