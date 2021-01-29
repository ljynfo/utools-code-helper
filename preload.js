const beanStrToJson = function (str) {
    str = str.toString()
    str = str.replace(/\(/g, '{')
    str = str.replace(/\)/g, '}')

    const list = [];
    let tem = '';
    for (let i = 0, len = str.length; i < len; i++) {
        const ch = str[i];
        if (ch === '{' || ch === '}' || ch === '[' || ch === ']' || ch === ',') {
            let idx = tem.indexOf('=')
            if (idx > 0) {
                let next = ch
                if (i < len - 1 && (next !== ']' && next !== '}' && next !== ',')) {
                    tem = tem.substr(0, idx + 1)
                }
                // console.log(tem + '   ' + i + '      ' + next + '   ' + idx)
                list.push(tem);
            }
            tem = '';
            list.push(ch);
        } else {
            tem = tem.concat(ch);
        }
    }

    let result = '';
    for (let i = 0, len = list.length; i < len; i++) {
        let s = list[i];
        const index = s.indexOf('=');
        if (index > 0) {
            let s1 = s.substring(0, index).trim();
            let s2 = s.substring(index + 1, s.length).trim();
            if ('' !== s1 && 'null' !== s1) {
                s1 = '"' + s1 + '"';
            }
            if ('' !== s2 && 'null' !== s2) {
                s2 = '"' + s2 + '"';
            }
            s = s1 + ":" + s2;
        }
        result = result.concat(s);
    }

    // console.log(result)
    return result
};

//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
const formatJsonLoose = function (json) {
    let formatted = '',     //转换后的json字符串
        padIdx = 0,         //换行后是否增减PADDING的标识
        PADDING = '    ';   //4个空格符
    /**
     * 将对象转化为string
     */
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    }
    /**
     *利用正则类似将{'name':'ccy','age':18,'info':['address':'wuhan','interest':'playCards']}
     *---> \r\n{\r\n'name':'ccy',\r\n'age':18,\r\n
     *'info':\r\n[\r\n'address':'wuhan',\r\n'interest':'playCards'\r\n]\r\n}\r\n
     */
    json = json.replace(/([\{\}])/g, '\r\n$1\r\n')
        .replace(/([\[\]])/g, '\r\n$1\r\n')
        .replace(/(\,)/g, '$1\r\n')
        .replace(/(\r\n\r\n)/g, '\r\n')
        .replace(/\r\n\,/g, ',');
    /**
     * 根据split生成数据进行遍历，一行行判断是否增减PADDING
     */
    (json.split('\r\n')).forEach(function (node, index) {
        let indent = 0,
            padding = '';
        if (node.match(/\{$/) || node.match(/\[$/)) indent = 1;
        else if (node.match(/\}/) || node.match(/\]/)) padIdx = padIdx !== 0 ? --padIdx : padIdx;
        else indent = 0;
        for (let i = 0; i < padIdx; i++) padding += PADDING;
        formatted += padding + node + '\r\n';
        padIdx += indent;
        // console.log('index:' + index + ',indent:' + indent + ',padIdx:' + padIdx + ',node-->' + node);
    });
    // console.log(formatted)
    return formatted
};

//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
const formatJsonStrict = function (json, options) {
    let reg = null,
        formatted = '',
        pad = 0,
        PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true);
    options.spaceAfterColon = (options.spaceAfterColon !== false);
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    } else {
        json = JSON.parse(json);
        json = JSON.stringify(json);
    }
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ':');
    }
    (json.split('\r\n')).forEach(function (node, index) {
            var i = 0,
                indent = 0,
                padding = '';

            if (node.match(/\{$/) || node.match(/\[$/)) {
                indent = 1;
            } else if (node.match(/\}/) || node.match(/\]/)) {
                if (pad !== 0) {
                    pad -= 1;
                }
            } else {
                indent = 0;
            }

            for (i = 0; i < pad; i++) {
                padding += PADDING;
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        }
    );
    return formatted;
};

const removeEsc = function (str) {
    str = eval(str)
    return str
};

const formatJson = function (str) {
    try {
        str = formatJsonStrict(str)
    } catch (e) {
        console.log(e)
        str = formatJsonLoose(str)
    }
    return str
};

window.exports = {
    "remove_esc": {
        mode: "none",
        args: {
            enter: (action) => {
                window.utools.hideMainWindow()
                let info = '复制成功';
                let str = action.payload;
                try {
                    str = removeEsc(str)
                } catch (e) {
                    console.log(e)
                    info = info + '，但可能有点问题'
                }
                window.utools.copyText(str)
                window.utools.outPlugin()
                window.utools.showNotification(info)
            }
        }
    },
    "format_Json": {
        mode: "none",
        args: {
            enter: (action) => {
                window.utools.hideMainWindow()
                let info = '复制成功';
                let str = action.payload;
                try {
                    str = formatJson(str)
                } catch (e) {
                    console.log(e)
                    info = info + '，但可能有点问题'
                }
                window.utools.copyText(str)
                window.utools.outPlugin()
                window.utools.showNotification(info)
            }
        }
    },
    "bean_toString_json": {
        mode: "none",
        args: {
            enter: (action) => {
                window.utools.hideMainWindow()
                let info = '复制成功';
                let str = action.payload;
                try {
                    str = beanStrToJson(str)
                    str = formatJson(str)
                } catch (e) {
                    console.log(e)
                    info = info + '，但可能有点问题'
                }
                window.utools.copyText(str)
                window.utools.outPlugin()
                window.utools.showNotification(info)
            }
        }
    },
    "copy_text": {
        mode: "none",
        args: {
            enter: (action) => {
                window.utools.hideMainWindow()
                let info = '复制成功';
                let str = action.payload;
                window.utools.copyText(str)
                window.utools.outPlugin()
                window.utools.showNotification(info)
            }
        }
    },
    "code_helper": {
        mode: "list",
        args: {
            // 进入插件时调用（可选）
            enter: (action, callbackSetList) => {
                // 如果进入插件就要显示列表数据
                callbackSetList([
                    {
                        title: '去字符拼接',
                        code: 'remove_esc',
                        description: '去除字符串拼接',
                        icon: '' // 图标(可选)
                    },
                    {
                        title: '格式化Json串',
                        code: 'format_Json',
                        description: '把Json字符串格式化输出',
                        icon: '' // 图标(可选)
                    },
                    {
                        title: 'toString转Json并格式化',
                        code: 'bean_toString_json',
                        description: 'JavaBean的toString字符串转Json并格式化',
                        icon: '' // 图标(可选)
                    },
                    {
                        title: '复制文本',
                        code: 'copy_text',
                        description: '复制纯文本',
                        icon: '' // 图标(可选)
                    }
                ])
            },
            // 用户选择列表中某个条目时被调用
            select: (action, itemData) => {
                window.utools.hideMainWindow()
                let info = '复制成功';
                let code = itemData.code;
                let str = action.payload;
                try {
                    switch (code) {
                        case 'remove_esc':
                            str = removeEsc(str)
                            break;
                        case 'format_Json':
                            str = formatJson(str)
                            break;
                        case 'bean_toString_json':
                            str = beanStrToJson(str)
                            str = formatJson(str)
                            break;
                        case 'copy_text':
                            str = str.toString()
                            break;
                        default:
                    }

                } catch (error) {
                    console.log(error)
                    info = info + '，但可能有点问题'
                }
                window.utools.copyText(str)
                window.utools.outPlugin()
                window.utools.showNotification(info)
            }
        }
    }
}