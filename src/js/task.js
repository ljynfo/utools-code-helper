const taskExtract = function (str) {
    let list = str.split('\n')
    let result = ''
    let task
    let taskSum = 0
    let taskNum = 0
    let taskTimeSum = 0
    let errorList = [];
    try {
        let lastStr
        for (let i = 0, len = list.length; i < len; i++) {
            task = list[i];
            let thick = task.includes('【') && (task.includes('h】') || task.includes('H】'))
            let thin = task.includes('[') && (task.includes('h]') || task.includes('H]'))
            if (thick || thin) {

                let taskTabCount = task.split('\t').length - 1
                for (let j = i; j > 0; j--) {
                    lastStr = list[j - 1]
                    let lastStrTabCount = lastStr.split('\t').length - 1
                    if (lastStrTabCount <= taskTabCount - 1) {
                        lastStr = lastStr.replace(/[\r\n]/g, '')
                        break
                    }
                }
                taskSum++
                let taskTime
                if (thick) {
                    taskTime = task.substr(task.lastIndexOf('【'), task.lastIndexOf('】'))
                }
                if (thin) {
                    taskTime = task.substr(task.lastIndexOf('['), task.lastIndexOf(']'))
                }
                taskTime = taskTime.replace('h', '').replace('H', '')
                    .replace('【', '').replace('】', '')
                    .replace('[', '').replace(']', '')
                taskTime = parseFloat(taskTime)
                if (isNaN(taskTime)) {
                    errorList.push(task.trim())
                } else {
                    taskTimeSum = taskTimeSum + taskTime
                    task = task.trim()
                    taskNum++
                    result = result.concat('\n');
                    result = result.concat((lastStr + '>' + task).trim());
                }
            }
        }
        result = ('总共' + taskSum + '个任务, 解析成功' + taskNum + '个、失败' + (taskSum - taskNum) + '个, 成功任务合计' + taskTimeSum + '小时\n').concat(result)
    } catch (e) {
        result = '解析任务失败, 任务信息: '.concat(task)
    }
    let errorSum = errorList.length
    if (errorSum > 0) {
        result = result.concat("\n\n\n解析失败任务:")
    }
    for (let i = 0; i < errorSum; i++) {
        let errorTask = errorList[i];
        result = result.concat("\n".concat(errorTask))
    }
    return result
}

const columnCalculation = function (str) {
    let list = str.split('\n')
    let max
    let min
    let sum = 0
    let avg
    let count = 0
    let number
    let errorList = [];
    let result = ''
    try {
        for (let i = 0, len = list.length; i < len; i++) {
            number = parseFloat(list[i].trim())
            if (isNaN(number)) {
                errorList.push(list[i])
            } else {
                count++
                sum = sum + number
                if (max == null) {
                    max = number
                } else {
                    max = max > number ? max : number
                }
                if (min == null) {
                    min = number
                } else {
                    min = min < number ? min : number
                }
            }
        }
        avg = sum / count
        result = '总共' + list.length + '行, 解析成功' + count + '行、失败' + (list.length - count) + '行\n' +
            'max: ' + max + ', min: ' + min + ', avg: ' + avg + ', sum: ' + sum + '\n'
    } catch (e) {
        result = '解析失败, 信息: '.concat(number)
    }
    let errorSum = errorList.length
    if (errorSum > 0) {
        result = result.concat("\n\n\n解析失败:")
    }
    for (let i = 0; i < errorSum; i++) {
        let errorMsg = errorList[i];
        result = result.concat("\n".concat(errorMsg))
    }
    return result
}

module.exports = {
    taskExtract,
    columnCalculation
}