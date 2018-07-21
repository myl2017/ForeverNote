export function friendlyDate(dateStr) {
    let dateObj = typeof  dateStr === 'object' ? dateStr : new Date(dateStr)
    let time = dateObj.getTime()
    let now = Date.now()
    let space = now - time
    let friendlyStr = ''

    switch (true) {
        case space < 60000:
            friendlyStr = '刚刚'
            break
        case space < 1000 * 3600:
            friendlyStr = Math.floor(space / 60000) + '分钟前'
            break
        case space < 1000 * 3600 * 24:
            friendlyStr = Math.floor(space / (1000 * 3600)) + '小时前'
            break
        default:
            friendlyStr = Math.floor(space / (1000 * 3600 * 24)) + '天前'
    }
    return friendlyStr
}