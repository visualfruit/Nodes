class Util {
    static toggleBool(input) {
        return !input;
    }
    static getImageRatio(input) {
        return input.width / input.height;
    }
    static map(value1, value2, newValue){
        return value1 / value2 * newValue;
    }
    static getTime() {
        var d = new Date();
        return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + " " + d.getDate() + "." + d.getMonth() + "." + d.getYear();
    }
    static getCenterPosition(outerRect, innerRect){
        let deltaX = (outerRect.width-innerRect.width)*.5;
        let deltaY = (outerRect.height-innerRect.height)*.5;
        return {x: deltaX, y: deltaY};
    }
    static nameAlreadyExists(string, checkString){
        if (string === checkString){
            return true;
        } else {
            return false;
        }
    }
}